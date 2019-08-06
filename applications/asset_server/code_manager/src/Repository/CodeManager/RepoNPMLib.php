<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityNPMLib;
use CodeManager\Repository\Abstractions\AbstractRepo;

/**
 * Class RepoNPMLib
 * @package CodeManager\Repository\CodeManager
 */
class RepoNPMLib extends AbstractRepo {

    protected $entity_class = EntityNPMLib::class;

}
