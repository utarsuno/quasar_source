<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:21
 */

namespace QuasarSource\CommonFeatures;

/**
 * Trait TraitAliveOrDead
 * @package QuasarSource\CommonFeatures
 */
trait TraitAliveOrDead {

    /** @var bool $alive */
    protected $alive = false;

    public function kill(): void {
        $this->alive = false;
    }

    public function revive(): void {
        $this->alive = true;
    }

    /**
     * @return bool
     */
    public function is_alive(): bool {
        return $this->alive;
    }
}
