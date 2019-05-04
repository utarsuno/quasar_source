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

class EntityFileRepository extends AbstractRepository {

    public function remove_file_by_entity(EntityFile $file) : void {
        if ($file->hasChild()) {
            $this->remove_file_by_entity($file->getChild());
        }
        $this->remove_entity($file, true);
    }

    public function remove_file_by_path(string $file_path) : void {
        $file = $this->get_file_by_path($file_path);
        if ($file->hasChild()) {
            $this->remove_file_by_entity($file->getChild());
        }
        $this->remove_entity($file, true);
    }

    public function get_file_by_path(string $file_path) : ?EntityFile {
        return $this->findOneBy(['full_path' => $file_path]);
    }

    /**
     * Creates a new EntityFile object based off path provided and stores it into the DB.
     *
     * @param string     $file_path  < The path to the file that needs to be cached for future code builds. >
     * @param int        $file_type  < The type of the file pointed by $file_path.                          >
     * @param array      $options    < Additional EntityFile creation parameters.                           >
     * @param EntityFile $parent     < Optional: the parent to this EntityFile.                             >
     * @param EntityFile $child      < Optional: the child to this EntityFile.                              >
     * @return EntityFile            < A new EntityFile instance.                                           >
     * @throws \Doctrine\ORM\ORMException
     */
    public function create_entity_file_from_path(string $file_path, int $file_type, array $options, ?EntityFile $parent=null, ?EntityFile $child=null) : EntityFile {
        $file = new EntityFile();
        $file->initialize($file_path, $file_type, $options);
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
        $this->save_entity($file, true);
        return $file;
    }

}
