<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\CodeManager\EntityDBSnapshot;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityDBSnapshotRepository extends AbstractRepository {

    protected $entity_class = EntityDBSnapshot::class;
    #protected $default_search_attribute = 'username';

    protected function event_before_remove_entity(EntityInterface $entity): void {

    }
}



