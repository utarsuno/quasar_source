<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:39
 */

namespace QuasarSource\Utilities;


class SimpleTimer {

    private $running;
    private $time_start;
    private $time_end;
    private $time_accumulated;

    public function __construct(bool $auto_start=false) {
        $this->running          = false;
        $this->time_start       = $auto_start ? microtime(true) : null;
        $this->time_accumulated = 0.0;
    }

    public function start() : void {
        if (!$this->running) {
            $this->time_start = microtime(true);
            $this->running    = true;
        }
    }

    public function stop() : void {
        if ($this->running) {
            $this->time_end = microtime(true);
            $this->running  = false;
        }
    }

    public function pause() : void {
        if ($this->running) {
            if ($this->time_end === null) {
                $this->stop();
            }
            $this->time_accumulated += $this->time_end - $this->time_start;
            $this->running           = false;
        }
    }

    public function __toString() : string {
        $this->pause();
        if ($this->time_accumulated < 0.0001) {
            return '0s';
        }
        return strval($this->time_accumulated) . 's';
    }

}
