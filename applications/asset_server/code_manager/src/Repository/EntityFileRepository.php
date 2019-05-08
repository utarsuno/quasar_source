<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\EntityFile;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping;
use Doctrine\ORM\ORMException;


class EntityFileRepository extends AbstractRepository {

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
     * @throws ORMException
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

    protected function event_before_remove_entity($entity): void {
        if ($entity->hasChild()) {
            $this->remove_entity($entity->getChild());
        }
    }

    protected function event_after_remove_entity($entity): void {}

}
