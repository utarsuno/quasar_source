<?php declare(strict_types=1);

namespace CodeManager\Service;

use CodeManager\Service\Feature\AbstractService;
use QuasarSource\DataStructure\BuildStep\BuildStep;

/**
 * Class QAService
 * @package CodeManager\Service
 */
class QAService extends AbstractService {

    /**
     * QAService constructor.
     * @param LoggerService $logger_service
     */
    public function __construct(LoggerService $logger_service) {
        parent::__construct($logger_service);
    }

    public function provide_build_step(): BuildStep {
        $step = new BuildStep('QA Health Check');

        return $step;
    }

}