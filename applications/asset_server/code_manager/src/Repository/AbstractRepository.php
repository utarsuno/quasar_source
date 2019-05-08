<?php


namespace CodeManager\Repository;

use Doctrine\ORM\EntityRepository;

abstract class AbstractRepository extends EntityRepository {

    protected $default_search_attribute;
    protected $entity_class;

    public function get_entity($search_value) {
        return $this->findOneBy([$this->default_search_attribute => $search_value]);
    }

    public function has_entity($search_value) {
        return $this->get_entity($search_value) !== null;
    }

    public function get_all_entities() : array {
        return $this->findAll();
    }

    public function save_db_state() : void {
        $this->_em->flush();
    }

    public function ensure_db_has_entity($value) {
        if (!$this->has_entity($value)) {
            return $this->create_new_entity($value);
        }
        $entity = $this->get_entity($value);
        $this->event_entity_already_exists_in_db($entity);

        $this->ensure_db_cache_for_entity_up_to_date($entity);
        $this->event_entity_additional_health_checks($entity);

        return $entity;
    }

    public function ensure_db_cache_for_entity_up_to_date($value) {
        if ($value->ensure_cache_up_to_date()) {
            $this->event_entity_cached_updated($value);
        }
    }

    public function create_new_entity($value, bool $save=true) {
        #$this->log('Creating NPM Library entry{' . $lib_name . '}');
        $entity = new $this->entity_class();
        $entity->on_event_first_new_creation($value);
        $this->event_on_entity_created($entity);
        if ($save) {
            $this->save_entity($entity, true);
        }
        return $entity;
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

    abstract protected function event_entity_additional_health_checks($entity) : void;

    abstract protected function event_entity_cached_updated($entity) : void;

    abstract protected function event_entity_already_exists_in_db($entity) : void;

    abstract protected function event_on_entity_created($entity) : void;

    abstract protected function event_before_remove_entity($entity) : void;

    abstract protected function event_after_remove_entity($entity) : void;
}
