<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntitySnapshotQA;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoSnapshotQA
 * @package CodeManager\Repository\CodeManager
 */
class RepoSnapshotQA extends AbstractRepo {

    protected $entity_class = EntitySnapshotQA::class;

}
