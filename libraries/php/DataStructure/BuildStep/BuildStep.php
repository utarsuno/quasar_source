<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\BuildStep;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\CommonFeatures\TraitTimer;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;

/**
 * Class BuildStep
 * @package QuasarSource\DataStructure\BuildStep
 */
final class BuildStep {
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

    private $output    = [];

    private $errors    = [];

    private $callbacks = [];

    /**
     * @param string $name
     */
    public function __construct(string $name) { #, LoggerService $logger
        $this->set_name_and_label($name, 'BuildStep');
        $this->init_trait_timer(false, true);
        $this->flags_set_all([self::FLAG_STARTED, self::FLAG_FAILED, self::FLAG_INTERRUPTED, self::FLAG_COMPLETED]);
    }

    /**
     * @param callable $callback
     * @param string   $description
     */
    public function add_sub_step(callable $callback, string $description): void {
        $this->callbacks[$description] = $callback;
    }

    public function run(): void {
        $this->pre_run();
        $failed = false;
        var_dump('There are {' . count($this->callbacks) . '} callbacks!');
        foreach ($this->callbacks as $description => $callback) {
            var_dump('Executing callback{' . $description . '}!');
            try {
                $callback();
                $this->timer->mark_lap($description);
            } catch (\Throwable $e) {
                $this->mark_as_failed();
                $failed = true;
                # TODO: Temporary.
                throw $e;
                #break;
            }
        }
        if (!$failed) {
            $this->flag_set_on(self::FLAG_COMPLETED);
        }
        $this->post_run();
        if ($this->passed()) {
            var_dump($this . ' passed in {' . $this->timer . '}!');
            $this->output[] = [$this . ' passed in {' . $this->timer . '}!'];
        } else {
            var_dump('Did not pass??');
        }
    }

    public function run_unit_of_work(): void {
        #$this->header($this->name);
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
        $this->flag_set_off(self::FLAG_COMPLETED);
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

    protected function pre_run(): void {
        $this->timer->start();
        $this->flag_set_on(self::FLAG_STARTED);
    }

    protected function post_run(): void {
        $this->timer->stop();
    }

}