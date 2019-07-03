<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Service\LoggerService;
use CodeManager\Service\Feature\Logging\FeatureLoggingTrait;
use QuasarSource\Traits\TraitName;
use QuasarSource\Traits\TraitTimer;
use QuasarSource\Utilities\UtilsString as STR;


/**
 * Class UnitOfWork
 * @package QuasarSource\BuildProcess\Abstractions
 */
abstract class UnitOfWork {
    use TraitName;
    use TraitTimer;
    use FeatureLoggingTrait;

    // TEMP
    private const HEADER_START     = 'start';
    private const HEADER_FAILED    = 'failed';
    private const HEADER_COMPLETED = 'completed';
    // TEMP

    /** @var bool */
    protected $step_failed = false;

    /**
     * @param string        $name
     * @param LoggerService $logger
     */
    protected function __construct(string $name, LoggerService $logger) {
        $this->service_set_logger($logger);
        $this->set_name_and_label($name, 'Step');
        $this->init_trait_timer(false);
    }

    public function run_unit_of_work(): void {
        $this->header($this->name);
        $this->timer->start();
        $this->pre_work();
        $this->perform_work();
        $this->post_work();
        $this->timer->stop();
        if ($this->failed()) {
            $this->log('--- ' . $this->name . ' failed in {' . $this->timer->get_delta() . '}---');
            $this->header(STR::brackets($this->name . ' failed in ', $this->timer->get_delta()));
            $this->print_header(self::HEADER_FAILED);
            # TODO: stop the rest of the build!
        } else {
            $this->log('--- ' . $this->name . ' completed in {' . $this->timer->get_delta() . '}---');
            $this->header(STR::brackets($this->name . ' completed in ', $this->timer->get_delta()));
        }
    }

    /**
     * @param string $result
     */
    private function print_header(string $result): void {
        $this->header(STR::brackets($this->name . ' ' . $result . ' in ', $this->timer->get_delta()));
    }

    protected function mark_as_failed(): void {
        $this->step_failed = true;
    }

    /**
     * @return bool
     */
    protected function failed(): bool {
        return $this->step_failed;
    }

    abstract protected function pre_work(): void;

    abstract protected function perform_work(): void;

    abstract protected function post_work(): void;

}