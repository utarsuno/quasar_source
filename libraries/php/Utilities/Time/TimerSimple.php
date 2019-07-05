<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:39
 */

namespace QuasarSource\Utilities\Time;

use QuasarSource\CommonFeatures\TraitOptionalMethods          as FeatureOptionalMethods;
use QuasarSource\DataStructure\StateMachine\TraitStateMachine as FeatureStateMachine;
use QuasarSource\Utilities\Math\UtilsMath                     as MATH;
use QuasarSource\Utilities\Time\UtilsUnixTime                 as TIME;

/**
 * Class TimerSimple
 * @package QuasarSource\Utilities\Time
 */
class TimerSimple {
    # ------------------------------------------------ F E A T U R E S -------------------------------------------------
    use FeatureOptionalMethods;
    use FeatureStateMachine;
    # ---------------------------------------------------- E N U M -----------------------------------------------------
    public const STATE_RUNNING = 'running';
    public const STATE_STOPPED = 'stopped';
    # -------------------------------------------------- F I E L D S ---------------------------------------------------
    /** @var float [The time instance of when time recording started.] */
    protected $time_started_at;
    /** @var float [The total time elapsed.                          ] */
    protected $time_accumulated;
    # --------------------------------------------------- M A G I C ----------------------------------------------------
    /**
     * @param bool $auto_start [If set to true, the timer will begin recording immediately upon object creation.]
     */
    public function __construct(bool $auto_start=false) {
        $this->init_trait_state_machine([self::STATE_RUNNING, self::STATE_STOPPED]);
        if ($auto_start) {
            $this->start();
        }
    }

    /**
     * Get a friendly string version of the elapsed time.
     *
     * @return string [Elapsed time in seconds.]
     */
    public function __toString(): string {
        return MATH::as_seconds_pretty($this->get_delta(), 6);
    }

    # --------------------------------------------- P U B L I C -- A P I -----------------------------------------------
    /**
     * Start recording the accumulation of time.
     */
    public function start(): void {
        $this->state_enter(self::STATE_RUNNING);
    }

    /**
     * Stop recording the accumulation of time.
     *
     * @return float
     */
    public function stop(): float {
        $this->state_enter(self::STATE_STOPPED);
        return $this->time_accumulated;
    }

    # ------------------------------------------------- G E T T E R S --------------------------------------------------
    /**
     * @return bool
     */
    public function is_running(): bool {
        return $this->state_is_on(self::STATE_RUNNING);
    }

    /**
     * Get the current amount of elapsed time.
     *
     * @return float [The current amount of elapsed time.]
     */
    public function get_delta(): float {
        if ($this->time_accumulated === null || $this->is_running()) {
            $this->set_time_accumulated();
        }
        return $this->time_accumulated;
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------
    /**
     * @return void
     */
    private function set_time_accumulated(): void {
        $this->time_accumulated = TIME::delta_to_now($this->time_started_at);
    }

    # ---------------------------------- OptionalMethods{ S T A T E -- E V E N T S } -----------------------------------
    /**
     * @param  string|null $previous_state
     * @return void
     */
    private function state_on_enter_running(string $previous_state=null): void {
        $this->time_started_at = TIME::now_as_float();
    }

    /**
     * @param  string|null $next_state
     * @return void
     */
    private function state_on_exit_running(string $next_state=null): void {
        $this->set_time_accumulated();
    }
}
