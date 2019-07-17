<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntitySnapshotQA;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoSnapshotQA
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotQA extends AbstractRepository {

    public const ENTITY_CLASS = EntitySnapshotQA::class;
    protected $entity_class   = EntitySnapshotQA::class;

}
