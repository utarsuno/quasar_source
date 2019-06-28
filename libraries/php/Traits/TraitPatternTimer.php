<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\Traits;
use QuasarSource\Utilities\Time\SimpleTimer;


trait TraitPatternTimer {

    /** @var SimpleTimer */
    protected $timer;

    /**
     * Initialize the timer.
     *
     * @param bool $auto_start
     */
    public function init_trait_timer(bool $auto_start=false): void {
        $this->timer = new SimpleTimer($auto_start);
    }

}
