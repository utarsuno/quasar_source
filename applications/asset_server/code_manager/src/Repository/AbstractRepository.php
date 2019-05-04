<?php


namespace CodeManager\Repository;

use CodeManager\Abstractions\EntityDBStateInterface;
use Doctrine\ORM\EntityRepository;

class AbstractRepository extends EntityRepository implements EntityDBStateInterface {

    public function get_entity_by_attribute(string $attribute, $value) {
        return $this->findOneBy([$attribute => $value]);
    }

    public function get_all_entities() : array {
        return $this->findAll();
    }

    public function remove_entity($entity, bool $save_db_state=false) : void {
        $this->_em->remove($entity);
        if ($save_db_state) {
            $this->_em->flush();
        }
    }

    public function save_entity($entity, bool $save_db_state=false) : void {
        $this->_em->persist($entity);
        if ($save_db_state) {
            $this->_em->flush();
        }
    }

}
