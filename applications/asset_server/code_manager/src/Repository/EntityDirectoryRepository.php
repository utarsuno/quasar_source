<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;


class EntityDirectoryRepository extends AbstractRepository {

    protected function event_before_remove_entity($entity): void {}

    protected function event_after_remove_entity($entity): void {}

    protected function event_entity_additional_health_checks($entity): void {
    }

    protected function event_entity_cached_updated($entity): void {
    }

    protected function event_entity_already_exists_in_db($entity): void {
    }

    protected function event_on_entity_created($entity): void {
    }
}
