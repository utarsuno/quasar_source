<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\CommonFeatures;
use QuasarSource\Utilities\Time\TimerSimple;

/**
 * Trait TraitTimer
 * @package QuasarSource\Traits
 */
trait TraitTimer {

    /** @var TimerSimple */
    protected $timer;

    /**
     * Initialize the timer.
     *
     * @param bool $auto_start
     */
    public function init_trait_timer(bool $auto_start=false): void {
        $this->timer = new TimerSimple($auto_start);
    }

}
