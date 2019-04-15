<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:39
 */

namespace QuasarSource\Utilities;


class SimpleTimer {

    /** @var bool       < Indicates if the timer is currently accumulating time. > */
    private $running;
    /** @var mixed|null < The time instance of when time recording started.      > */
    private $time_start;
    /** @var float      < The total time elapsed.                                > */
    private $time_accumulated;

    /**
     * SimpleTimer constructor.
     *
     * @param bool $auto_start < If set to true, the timer will begin recording immediately upon object creation. >
     */
    public function __construct(bool $auto_start=false) {
        $this->running          = $auto_start;
        $this->time_start       = $auto_start ? microtime(true) : null;
        $this->time_accumulated = 0.0;
    }

    /**
     * Start recording the accumulation of time.
     */
    public function start() : void {
        if (!$this->running) {
            $this->time_start = microtime(true);
            $this->running    = true;
        }
    }

    /**
     * Stop recording the accumulation of time.
     */
    public function stop() : void {
        if ($this->running) {
            $this->time_accumulated = microtime(true) - $this->time_start;
            $this->running          = false;
        }
    }

    /**
     * Get the current amount of elapsed time.
     *
     * @return float < The current amount of elapsed time. >
     */
    public function get_delta() : float {
        if ($this->running) {
            $this->time_accumulated = microtime(true) - $this->time_start;
        }
        return $this->time_accumulated;
    }

    /**
     * Get a friendly string version of the elapsed time.
     *
     * @return string < Elapsed time in seconds. >
     */
    public function __toString() : string {
        $delta = $this->get_delta();
        if ($delta < 0.01) {
            return '0s';
        }
        return strval($delta) . 's';
    }

}
