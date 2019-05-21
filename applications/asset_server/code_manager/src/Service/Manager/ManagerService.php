<?php

namespace CodeManager\Service\Manager;

use CodeManager\Service\Abstractions\BaseAbstractService;
use CodeManager\Service\Abstractions\OwnsManagers;
use CodeManager\Service\CodeBuilderService;
use Psr\Log\LoggerInterface;


class ManagerService extends BaseAbstractService implements OwnsManagers {

    private const KEY_REPO       = RepositoryManagerService::class;
    private const KEY_BUILD_STEP = BuildStepManagerService::class;

    /** @var array */
    private $managers = [
        self::KEY_BUILD_STEP => [false, null],
        self::KEY_REPO       => [true , null]
    ];

    public function __construct(
        LoggerInterface          $logger,
        RepositoryManagerService $manager_repo,
        BuildStepManagerService  $manager_build_step) {
        parent::__construct($logger);
        $this->managers[self::KEY_REPO][1]       = $manager_repo;
        $this->managers[self::KEY_BUILD_STEP][1] = $manager_build_step;
    }

    public function get_manager(string $manager_class): BaseAbstractService {
        if ($manager_class === self::KEY_BUILD_STEP && $this->managers[self::KEY_BUILD_STEP][0] === false) {
            /** @var BuildStepManagerService $manager_build_step */
            $manager_build_step = $this->managers[self::KEY_BUILD_STEP][1];
            $manager_build_step->set_code_builder(CodeBuilderService::$SINGLETON);
            $this->managers[self::KEY_BUILD_STEP][0] = true;
        }
        return $this->managers[$manager_class][1];
    }

}