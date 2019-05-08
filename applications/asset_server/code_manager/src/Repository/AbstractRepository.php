<?php


namespace CodeManager\Repository;

use CodeManager\Abstractions\EntityDBStateInterface;
use Doctrine\ORM\EntityRepository;

abstract class AbstractRepository extends EntityRepository implements EntityDBStateInterface {

    public function get_entity_by_attribute(string $attribute, $value) {
        return $this->findOneBy([$attribute => $value]);
    }

    public function get_all_entities() : array {
        return $this->findAll();
    }

    public function save_db_state() : void {
        $this->_em->flush();
    }

    public function remove_entity($entity, bool $save_db_state=false) : void {
        $this->event_before_remove_entity($entity);
        $this->_em->remove($entity);
        $this->event_after_remove_entity($entity);
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

    abstract protected function event_before_remove_entity($entity) : void;

    abstract protected function event_after_remove_entity($entity) : void;
}
