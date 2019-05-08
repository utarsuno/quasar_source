<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;
use CodeManager\Abstractions\EntityInterface;
use CodeManager\Entity\EntityNPMLibrary;


class EntityNPMLibraryRepository extends AbstractRepository {

    protected $default_search_attribute = 'name';
    protected $entity_class             = EntityNPMLibrary::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

    protected function event_entity_created(EntityInterface $entity, $value): void{
        $entity->on_event_first_new_creation($entity);
    }

}
