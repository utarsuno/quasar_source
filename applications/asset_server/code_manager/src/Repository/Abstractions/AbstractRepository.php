<?php


namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;

abstract class AbstractRepository extends EntityRepository {

    protected $default_search_attribute;
    protected $entity_class;

    public function get_entity($search_value) : ?EntityInterface {
        return $this->findOneBy([$this->default_search_attribute => $search_value]);
    }

    public function has_entity($search_value) : bool {
        return $this->get_entity($search_value) !== null;
    }

    public function get_all_entities() : array {
        return $this->findAll();
    }

    public function create_new_entity($value, bool $save=true) : EntityInterface {
        /** @var EntityInterface $entity */
        $entity = new $this->entity_class();
        $entity->on_event_born($value);
        $entity->set_state(EntityState::STATE_CREATED);
        if ($save) {
            $this->save_entity($entity, true);
        }
        return $entity;
    }

    public function remove_entity($entity, bool $save_db_state=false) : void {
        #$this->event_before_remove_entity($entity);
        try {
            $this->_em->remove($entity);
        } catch (ORMException $e) {
            DBG::throw_exception($e->getMessage());
        }
        if ($save_db_state) {
            $this->flush();
        }
    }

    public function save_entity($entity, bool $save_db_state=false) : void {
        try {
            $this->_em->persist($entity);
        } catch (ORMException $e) {
            DBG::throw_exception($e->getMessage());
        }
        if ($save_db_state) {
            $this->flush();
        }
    }

    private function flush() : void {
        try {
            $this->_em->flush();
        } catch (OptimisticLockException $e) {
            DBG::throw_exception($e->getMessage());
        } catch (ORMException $e) {
            DBG::throw_exception($e->getMessage());
        }
    }

    abstract protected function event_before_remove_entity(EntityInterface $entity) : void;

}
