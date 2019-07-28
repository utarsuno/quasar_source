<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntitySnapshotQA;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoSnapshotQA
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotQA extends AbstractRepo {

    public const ENTITY_CLASS = EntitySnapshotQA::class;
    protected $entity_class   = EntitySnapshotQA::class;

}
