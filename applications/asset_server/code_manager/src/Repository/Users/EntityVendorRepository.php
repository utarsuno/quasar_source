<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;
use CodeManager\Entity\Users\EntityVendor;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityVendorRepository extends AbstractRepository {

    protected $default_search_attribute = 'name';
    protected $entity_class             = EntityVendor::class;

}
