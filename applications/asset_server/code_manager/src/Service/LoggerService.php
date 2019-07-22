<?php declare(strict_types=1);

namespace CodeManager\Service;

use Psr\Log\LoggerInterface;
use CodeManager\Service\Feature\Logging\InterfaceLogger;

/**
 * Class LoggerService
 *
 * Utility singleton service for any logging needed.
 *
 * @package CodeManager\Service
 */
class LoggerService implements InterfaceLogger {

    /** @var LoggerInterface $logger */
    private $logger;

    /**
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    /**
     * @param string $message
     */
    public function info(string $message): void {
        $this->logger->info($message);
    }

    /**
     * @param string $message [Any kind of section title/header/divider, etc.]
     */
    public function header(string $message): void {
        $this->logger->debug('--- ' . $message . ' ---');
    }

    /**
     * @param string $message [A regular log message.]
     */
    public function log(string $message): void {
        $this->logger->debug($message);
    }

    /**
     * @param string $message [A warning message.]
     */
    public function warn(string $message): void {
        $this->logger->warning($message);
    }

    /**
     * @return LoggerService
     */
    public function service_get_logger(): LoggerService {
        return $this;
    }
}
