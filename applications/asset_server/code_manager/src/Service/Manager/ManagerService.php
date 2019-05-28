<?php

namespace CodeManager\Service\Manager;

use CodeManager\Service\Abstractions\BaseAbstractService;
use CodeManager\Service\Abstractions\OwnsManagers;
use CodeManager\Service\CodeBuilderService;
use Psr\Log\LoggerInterface;
use Symfony\Component\Console\Application;


class ManagerService extends BaseAbstractService implements OwnsManagers {

    private const KEY_REPO       = RepositoryManagerService::class;
    private const KEY_BUILD_STEP = BuildStepManagerService::class;
    private const KEY_COMMANDS   = CommandManagerService::class;

    /** @var array */
    private $managers = [];
    private $application;

    public function __construct(
        LoggerInterface          $logger,
        RepositoryManagerService $manager_repo,
        BuildStepManagerService  $manager_build_step,
        CommandManagerService    $manager_commands
    ) {
        parent::__construct($logger);
        $this->managers[self::KEY_REPO]       = [true , $manager_repo];
        $this->managers[self::KEY_BUILD_STEP] = [false, $manager_build_step];
        $this->managers[self::KEY_COMMANDS]   = [false, $manager_commands];
    }

    public function set_application(Application $application): void {
        $this->application = $application;
    }

    public function get_manager(string $manager_class): BaseAbstractService {
        if ($manager_class === self::KEY_BUILD_STEP && $this->managers[self::KEY_BUILD_STEP][0] === false) {
            /** @var BuildStepManagerService $manager_build_step */
            $manager_build_step                      = $this->managers[self::KEY_BUILD_STEP][1];
            $this->managers[self::KEY_BUILD_STEP][0] = true;
            $manager_build_step->set_code_builder(CodeBuilderService::$SINGLETON);
        } else if ($manager_class === self::KEY_COMMANDS && $this->managers[self::KEY_COMMANDS][0] === false) {
            /** @var CommandManagerService $manager_commands */
            $manager_commands                      = $this->managers[self::KEY_COMMANDS][1];
            $this->managers[self::KEY_COMMANDS][0] = true;
            $manager_commands->set_application($this->application);
        }
        return $this->managers[$manager_class][1];
    }

}