<?php declare(strict_types=1);

namespace QuasarSource\CommonFeatures;

use QuasarSource\Utils\Time\TimerAdvanced;
use QuasarSource\Utils\Time\TimerSimple;

/**
 * Trait TraitTimer
 * @package QuasarSource\Traits
 */
trait TraitTimer {

    /** @var TimerSimple|TimerAdvanced */
    protected $timer;

    /**
     * Initialize the timer.
     *
     * @param bool $auto_start
     * @param bool $advanced_timer
     */
    public function init_trait_timer(bool $auto_start=false, bool $advanced_timer=false): void {
        if ($advanced_timer) {
            $this->timer = new TimerAdvanced($auto_start);
        } else {
            $this->timer = new TimerSimple($auto_start);
        }
    }

}
