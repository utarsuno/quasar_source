<?php declare(strict_types=1);

namespace CodeManager\Service\Feature;

use CodeManager\Service\Feature\Repository\InterfaceOwnsRepos;
use QuasarSource\DataStructure\Factory\TraitFactoryBuildStep;

/**
 * Class AbstractRepository
 * @package CodeManager\Service\Feature
 */
abstract class AbstractFactoryService extends AbstractService implements InterfaceOwnsRepos {
    use TraitFactoryBuildStep;

}
