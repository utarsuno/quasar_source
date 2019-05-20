<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Users\EntityUserRole;
use CodeManager\Entity\Users\EntityVendor;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityVendorRepository extends AbstractRepository {

    protected $default_search_attribute = 'name';
    protected $entity_class             = EntityVendor::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}
