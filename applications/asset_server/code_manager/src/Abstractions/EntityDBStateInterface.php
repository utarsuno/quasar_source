<?php

namespace CodeManager\Abstractions;

interface EntityDBStateInterface {

    /**
     * Delete an Entity from the DB. Optionally save DB state.
     *
     * @param object $entity      < The Entity to perform an action against.                        >
     * @param bool $save_db_state < If true, the DB will be saved at the end of this function call. >
     */
    public function remove_entity($entity, bool $save_db_state=false) : void;

    /**
     * Delete an Entity from the DB. Optionally save DB state.
     *
     * @param object $entity      < The Entity to perform an action against.                        >
     * @param bool $save_db_state < If true, the DB will be saved at the end of this function call. >
     */
    public function save_entity($entity, bool $save_db_state=false) : void;

    /**
     * @return array < All currently existing entities (of one type). >
     */
    public function get_all_entities() : array;

}