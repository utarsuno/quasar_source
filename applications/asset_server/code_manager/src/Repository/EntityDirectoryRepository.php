<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;


use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\Abstractions\AbstractRepository;

class EntityDirectoryRepository extends AbstractRepository {

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}
