<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager;
use CodeManager\Entity\CodeManager\EntityNPMLib;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoNPMLib
 * @package CodeManager\Repository\CodeManager
 */
class RepoNPMLib extends AbstractRepo {

    protected $default_search_attribute = 'name';
    public const ENTITY_CLASS           = EntityNPMLib::class;
    protected $entity_class             = EntityNPMLib::class;

}
