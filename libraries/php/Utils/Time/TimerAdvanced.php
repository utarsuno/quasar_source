<?php declare(strict_types=1);

namespace QuasarSource\Utils\Time;

use QuasarSource\Utils\Math\UtilsMath     as MATH;
use QuasarSource\Utils\Time\UtilsUnixTime as TIME;

/**
 * Class TimerAdvanced
 * @package QuasarSource\Utils\Time
 */
class TimerAdvanced extends TimerSimple {
    # ------------------------------------------------ F E A T U R E S -------------------------------------------------
    # ---------------------------------------------------- E N U M -----------------------------------------------------
    public const STATE_PAUSED = 'paused';
    # -------------------------------------------------- F I E L D S ---------------------------------------------------
    protected $time_accumulated_paused;
    protected $times_started_at = [];
    protected $times_paused_at  = [];
    protected $laps             = [];
    protected $last_time_started;
    protected $last_time_paused;
    protected $last_lap;
    # --------------------------------------------------- M A G I C ----------------------------------------------------
    /**
     * @param bool $auto_start [If set to true, the timer will begin recording immediately upon object creation.]
     */
    public function __construct(bool $auto_start=false) {
        parent::__construct($auto_start);
        $this->state_set_meeseeks(self::STATE_RUNNING, false);
        $this->state_add(self::STATE_PAUSED);
    }

    public function __destruct() {
        parent::__destruct();
        unset($this->time_accumulated_paused, $this->times_started_at, $this->times_paused_at,
            $this->last_time_paused, $this->last_time_started, $this->laps, $this->last_lap);
    }

    /**
     * Get a friendly string version of the elapsed time.
     *
     * @return string [Elapsed time in seconds.]
     */
    public function __toString(): string {
        #$this->get_delta()
        #$time_total   = MATH::as_seconds_pretty($this->time_accumulated + $this->time_accumulated_paused);
        $time_running = MATH::as_seconds_pretty($this->get_delta(), 6);
        $time_paused  = MATH::as_seconds_pretty($this->time_accumulated_paused, 6);
        if ($time_paused === '0s' || $time_paused === '~0s') {
            return 'Ran for{' . $time_running . '}, laps' . json_encode($this->laps);
        }
        return 'Ran for{' . $time_running . '}, paused for{' . $time_paused . '}, laps' . json_encode($this->laps);
    }

    # --------------------------------------------- P U B L I C -- A P I -----------------------------------------------

    /**
     * @param string $description
     */
    public function mark_lap(string $description): void {
        if ($this->last_lap === null) {
            $this->last_lap           = TIME::now_as_float();
            $this->laps[$description] = MATH::as_seconds_pretty($this->last_lap - $this->time_started_at, 3);
        } else {
            $now                      = TIME::now_as_float();
            $this->laps[$description] = MATH::as_seconds_pretty($now - $this->last_lap,3);
            $this->last_lap           = $now;
        }
    }

    /**
     * Resume the timer.
     */
    public function resume(): void {
        $this->state_enter(self::STATE_RUNNING);
    }

    public function pause(): void {
        $this->state_enter(self::STATE_PAUSED);
    }

    # ------------------------------------------------- G E T T E R S --------------------------------------------------
    /**
     * Get the current amount of elapsed time.
     *
     * @return float [The current amount of elapsed time.]
     */
    public function get_delta(): float {
        #if ($this->time_accumulated === null || $this->is_running()) {
        #    $this->time_accumulated = TIME::delta_to_now($this->time_started_at);
        #}
        if ($this->is_running()) {
            var_dump('TODO: Handle this scenario!');
        }
        return $this->time_accumulated;
    }

    # ---------------------------------- OptionalMethods{ S T A T E -- E V E N T S } -----------------------------------

    /**
     * @param string|null $previous_state
     */
    protected function state_on_enter_stopped(string $previous_state=null): void {
        $this->state_set_meeseeks(self::STATE_RUNNING);
        $this->state_set_meeseeks(self::STATE_PAUSED);
    }

    /**
     * @param  string|null $previous_state
     * @return void
     */
    protected function state_on_enter_running(string $previous_state=null): void {
        $this->last_time_started = TIME::now_as_float();
        if ($previous_state === self::STATE_PAUSED) {
            $this->times_started_at[]       = $this->last_time_started;
            $this->time_accumulated_paused += $this->last_time_started - $this->last_time_paused;
        } else if ($previous_state === null) {
            $this->time_started_at    = $this->last_time_started;
            $this->times_started_at[] = $this->last_time_started;
        }
    }

    /**
     * @param string|null $next_state
     */
    protected function state_on_exit_paused(string $next_state=null): void {
        if ($next_state === self::STATE_STOPPED) {
            $this->time_accumulated_paused += TIME::now_as_float() - $this->last_time_paused;
        }
    }

    /**
     * @param  string|null $next_state
     * @return void
     */
    protected function state_on_exit_running(string $next_state=null): void {
        if ($next_state === self::STATE_PAUSED) {
            $this->last_time_paused   = TIME::now_as_float();
            $this->times_paused_at[]  = $this->last_time_paused;
            $this->time_accumulated  += $this->last_time_paused - $this->last_time_started;
        } else if ($next_state === self::STATE_STOPPED) {
            $this->time_accumulated += TIME::now_as_float() - $this->last_time_started;
        }
    }
}
