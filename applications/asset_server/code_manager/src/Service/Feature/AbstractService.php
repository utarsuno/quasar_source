<?php declare(strict_types=1);

namespace CodeManager\Service\Feature;

use CodeManager\Service\Feature\Logging\TraitLogger;
use CodeManager\Service\LoggerService;

/**
 * Class AbstractRepository
 * @package CodeManager\Service\Feature
 */
abstract class AbstractService {
    use TraitLogger;

    /**
     * AbstractService constructor.
     * @param LoggerService $logger_service
     */
    public function __construct(LoggerService $logger_service) {
        $this->service_set_logger($logger_service);
    }
}
