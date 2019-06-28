<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Logging;

use CodeManager\Service\LoggerService;

/**
 * Interface FeatureLoggingInterface
 * @package QuasarSource\Service\Feature\Logging
 */
interface FeatureLoggingInterface {

    /**
     * @return LoggerService
     */
    public function service_get_logger(): LoggerService;

    /**
     * @param string $message [A regular log message.]
     */
    public function log(string $message): void;

    /**
     * @param string $message [A warning message.]
     */
    public function warn(string $message): void;
}
