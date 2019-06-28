<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Logging;

use CodeManager\Service\LoggerService;
use QuasarSource\Utilities\StringUtilities as STR;

/**
 * Trait FeatureLoggingTrait
 * @package QuasarSource\Service\Feature\Logging
 */
trait FeatureLoggingTrait {

    /** @var LoggerService */
    private $service_logger;

    /**
     * @return LoggerService
     */
    public function service_get_logger(): LoggerService {
        return $this->service_logger;
    }

    /**
     * @param  LoggerService $logger_service
     * @return FeatureLoggingTrait
     */
    protected function service_set_logger(LoggerService $logger_service): self {
        $this->service_logger = $logger_service;
        return $this;
    }

    /**
     * @param string $message [Any kind of section title/header/divider, etc. ]
     * @param mixed  $value   [Optional parameter to be displayed in brackets.]
     */
    public function header(string $message, $value = null): void {
        $this->service_logger->header($value !== null ? STR::brackets($message, $value) : $message);
    }

    /**
     * @param string $message [A regular log message.]
     * @param mixed  $value   [Optional parameter to be displayed in brackets.]
     */
    public function log(string $message, $value = null): void {
        $this->service_logger->log($value !== null ? STR::brackets($message, $value) : $message);
    }

    /**
     * @param string $message [A warning message.]
     * @param mixed  $value   [Optional parameter to be displayed in brackets.]
     */
    public function warn(string $message, $value = null): void {
        $this->service_logger->warn($value !== null ? STR::brackets($message, $value) : $message);
    }
}
