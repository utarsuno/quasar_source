<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\BuildStep;

use InvalidArgumentException;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\CommonFeatures\TraitTimer;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\Utils\DataType\UtilsArray  as ARY;
use QuasarSource\Utils\DataType\UtilsString as STR;
use Throwable;

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
    public const FLAG_RECOVERED   = 'recovered';
    public const FLAG_INTERRUPTED = 'interrupted';
    public const FLAG_COMPLETED   = 'completed';

    /** @var array $callbacks */
    private $callbacks           = [];

    /** @var array $callbacks_on_failed */
    private $callbacks_on_failed = [];

    /** @var array $callbacks_on_passed */
    private $callbacks_on_passed = [];

    private $callback_executions = [];

    private $last_exception_thrown;

    /**
     * @param string $name
     */
    public function __construct(string $name) {
        $this->set_name_and_label($name, 'BuildStep');
        $this->init_trait_timer(false, true);
        $this->flags_set_all([self::FLAG_STARTED, self::FLAG_FAILED, self::FLAG_INTERRUPTED, self::FLAG_COMPLETED, self::FLAG_RECOVERED]);
    }

    /**
     * @return mixed
     */
    public function get_last_exception() {
        return $this->last_exception_thrown;
    }

    /**
     * @param callable      $callback
     * @param string        $description
     * @param callable|null $callback_on_passed
     * @param callable|null $callback_on_failed
     */
    public function add_sub_step(
        callable $callback,
        string   $description,
        callable $callback_on_passed=null,
        callable $callback_on_failed=null
    ): void {
        $this->callback_executions[$description] = 0;
        $this->callbacks[$description]           = $callback;
        ARY::ref_add_non_null_pair($this->callbacks_on_passed, $description, $callback_on_passed);
        ARY::ref_add_non_null_pair($this->callbacks_on_failed, $description, $callback_on_failed);
    }

    /**
     * @param  string   $description
     * @param  callable $callback
     * @return bool
     * @throws Throwable
     */
    private function execute_callback(string $description, callable $callback): bool {
        ++$this->callback_executions[$description];
        try {
            $callback();
            $this->timer->mark_lap($description);
            return true;
        } catch (Throwable $e) {
            $this->timer->mark_lap($e->getMessage());
            $this->mark_as_failed();
            $this->last_exception_thrown = $e;
            return false;
        }
    }

    /**
     * @param  int $n
     * @throws Throwable
     */
    public function run_step(int $n): void {
        $index       = 0;
        $index_found = false;
        foreach ($this->callbacks as $desc => $callback) {
            if ($index === $n) {
                $index_found = true;
                var_dump('Executing{' . $desc . '}');
                $passed = $this->execute_callback($desc, $callback);
                if (!$passed) {
                    $this->run_on_failed_if_exists($desc);
                } else {
                    $this->run_on_passed_if_exists($desc);
                }
            }
            ++$index;
        }
        if (!$index_found) {
            throw new InvalidArgumentException('BuildStep{' . $n . '} was not found!');
        }
    }

    /**
     * @throws Throwable
     */
    public function run(): void {
        $this->timer->start();
        $this->flag_set_on(self::FLAG_STARTED);
        #var_dump('There are {' . count($this->callbacks) . '} callbacks!');

        foreach ($this->callbacks as $description => $callback) {
            #$function_name = $callback[1];
            if ($this->has_step_already_ran($description)) {
                var_dump('Skipping step{' . $description . '}, it has already been executed.');
                continue;
            }
            var_dump('Executing{' . $description . '}');
            $passed = $this->execute_callback($description, $callback);
            if (!$passed) {
                $this->run_on_failed_if_exists($description);
            } else {
                $this->run_on_passed_if_exists($description);
            }
        }
        $this->flag_set_on(self::FLAG_COMPLETED);
        $this->timer->stop();
    }

    /**
     * @param  string $description
     * @throws Throwable
     */
    private function run_on_failed_if_exists(string $description): void {
        if (!$this->has_on_failed($description)) {
            throw $this->last_exception_thrown;
        }
        $on_failed = $this->execute_callback($description, $this->callbacks_on_failed[$description]);
        if (!$on_failed) {
            throw $this->last_exception_thrown;
        }
        $this->mark_as_recovered();
        $this->timer->mark_lap($description);
    }

    /**
     * @param  string $description
     * @return bool
     */
    private function has_step_already_ran(string $description): bool {
        return $this->callback_executions[$description] !== 0;
    }

    /**
     * @param  string $description
     * @throws Throwable
     */
    private function run_on_passed_if_exists(string $description): void {
        if ($this->has_on_passed($description)) {
            $on_passed = $this->execute_callback($description, $this->callbacks_on_passed[$description]);
            if (!$on_passed) {
                throw $this->last_exception_thrown;
            }
        }
        $this->timer->mark_lap($description);
    }

    protected function mark_as_passed(): void {
        $this->flag_set_on(self::FLAG_COMPLETED);
        $this->flag_set_off(self::FLAG_FAILED);
    }

    protected function mark_as_failed(): void {
        $this->flag_set_on(self::FLAG_FAILED);
        $this->flag_set_off(self::FLAG_COMPLETED);
    }

    private function mark_as_recovered(): void {
        $this->flag_set_off(self::FLAG_FAILED);
        $this->flag_set_on(self::FLAG_RECOVERED);
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

    /**
     * @param  string $desc
     * @return bool
     */
    private function has_on_failed(string $desc): bool {
        return array_key_exists($desc, $this->callbacks_on_failed);
    }

    /**
     * @param  string $desc
     * @return bool
     */
    private function has_on_passed(string $desc): bool {
        return array_key_exists($desc, $this->callbacks_on_passed);
    }

}