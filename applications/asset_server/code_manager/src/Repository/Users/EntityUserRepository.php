<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;
use CodeManager\Entity\Users\EntityUser;
use CodeManager\Repository\Abstractions\AbstractRepository;


class EntityUserRepository extends AbstractRepository {

    protected $default_search_attribute = 'username';
    protected $entity_class             = EntityUser::class;

}
