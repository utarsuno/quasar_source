<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\UnitOfWork;
use CodeManager\Service\LoggerService;
use CodeManager\Service\Feature\Logging\FeatureLoggingTrait;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\CommonFeatures\TraitTimer;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\Utilities\DataType\UtilsString as STR;


/**
 * Class UnitOfWork
 * @package QuasarSource\DataStructure\UnitOfWork
 */
abstract class UnitOfWork {
    use TraitName;
    use TraitTimer;
    use TraitFlagTable;

    public const FLAG_STARTED     = 'started';
    public const FLAG_FAILED      = 'failed';
    public const FLAG_INTERRUPTED = 'interrupted';
    public const FLAG_COMPLETED   = 'completed';

    // TEMP
    private const HEADER_START       = 'start';
    private const HEADER_FAILED      = 'failed';
    private const HEADER_INTERRUPTED = 'interrupted';
    private const HEADER_COMPLETED   = 'completed';
    // TEMP

    #@param LoggerService $logger
    /**
     * @param string $name
     */
    protected function __construct(string $name) { #, LoggerService $logger
        #$this->service_set_logger($logger);
        $this->set_name_and_label($name, 'UnitOfWork');
        $this->init_trait_timer(false);
        $this->flags_set_all([self::FLAG_STARTED, self::FLAG_FAILED, self::FLAG_INTERRUPTED, self::FLAG_COMPLETED]);
    }

    public function run_unit_of_work(): void {
        #$this->header($this->name);
        $this->timer->start();
        $this->pre_work();
        $this->perform_work();
        $this->post_work();
        $this->timer->stop();
        if ($this->failed()) {
            #$this->log('--- ' . $this->name . ' failed in {' . $this->timer->get_delta() . '}---');
            #$this->header(STR::brackets($this->name . ' failed in ', $this->timer->get_delta()));
            $this->print_header(self::HEADER_FAILED);
            # TODO: stop the rest of the build!
        } else {
            #$this->log('--- ' . $this->name . ' completed in {' . $this->timer->get_delta() . '}---');
            #$this->header(STR::brackets($this->name . ' completed in ', $this->timer->get_delta()));
        }
    }

    /**
     * @param string $result
     */
    private function print_header(string $result): void {
        #$this->header(STR::brackets($this->name . ' ' . $result . ' in ', $this->timer->get_delta()));
    }

    protected function mark_as_failed(): void {
        $this->flag_set_on(self::FLAG_FAILED);
    }

    /**
     * @return bool
     */
    protected function failed(): bool {
        return $this->flag_get(self::FLAG_FAILED);
    }

    /**
     * @return bool
     */
    protected function passed(): bool {
        return $this->flag_is_off(self::FLAG_FAILED) && $this->flag_is_on(self::FLAG_COMPLETED);
    }

    abstract protected function pre_work(): void;

    abstract protected function perform_work(): void;

    abstract protected function post_work(): void;

}