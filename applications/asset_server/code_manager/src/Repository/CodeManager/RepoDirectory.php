<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoDirectory
 * @package CodeManager\Repository\CodeManager
 */
class RepoDirectory extends AbstractRepository {

    public const ENTITY_CLASS = EntityDirectory::class;

}
