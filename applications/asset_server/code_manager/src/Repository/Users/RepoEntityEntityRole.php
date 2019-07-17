<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;
use CodeManager\Entity\Users\EntityEntityEntityRole;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoEntityEntityRole
 * @package CodeManager\Repository\Users
 */
class RepoEntityEntityRole extends AbstractRepository {

    #protected $default_search_attribute = 'name';
    public const ENTITY_CLASS           = EntityEntityEntityRole::class;
    protected $entity_class             = EntityEntityEntityRole::class;

}
