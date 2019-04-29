<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\EntityFile;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping;
use QuasarSource\Utilities\Files\FileUtilities;

class EntityFileRepository extends EntityRepository {

    public function get_all() : ?array {
        return $this->findAll();
    }

    public function has_file_by_path(string $file_path) : bool {
        return $this->get_file_by_path($file_path) !== null;
    }

    public function remove_file_by_entity(EntityFile $file) : void {
        if ($file->hasChild()) {
            $this->remove_file_by_entity($file->getChild());
        }
        $this->_em->remove($file);
        $this->_em->flush();
    }

    public function remove_file_by_path(string $file_path) : void {
        $file = $this->get_file_by_path($file_path);

        if ($file->hasChild()) {
            $this->remove_file_by_entity($file->getChild());
        }

        $this->_em->remove($file);
        $this->_em->flush();
    }

    public function get_file_by_path(string $file_path) : ?EntityFile {
        return $this->findOneBy(['full_path' => $file_path,]);
    }

    /**
     * Creates a new EntityFile object based off path provided and stores it into the DB.
     *
     * @param string $file_path  < The path to the file that needs to be cached for future code builds. >
     * @param string $file_type  < The type of the file pointed by $file_path.                          >
     * @param EntityFile $parent < Optional: the parent to this EntityFile.                             >
     * @param EntityFile $child  < Optional: the child to this EntityFile.                              >
     * @return EntityFile        < A new EntityFile instance.                                           >
     */
    public function create_entity_file_from_path(string $file_path, string $file_type, ?EntityFile $parent=null, ?EntityFile $child=null) : EntityFile {
        $file = new EntityFile();
        $file->initialize($file_path, $file_type);
        if ($parent !== null) {
            $file->setParent($parent);
            $parent->setChild($file);
            $this->_em->persist($parent);
        }
        if ($child !== null) {
            $file->setChild($child);
            $child->setParent($file);
            $this->_em->persist($child);
        }
        $this->_em->persist($file);
        $this->_em->flush();
        return $file;
    }

}
