<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Time;

/**
 * Trait FieldUnixTime
 * @package CodeManager\Entity\Abstractions\Traits\Time
 */
trait FieldUnixTimestamp {

    /**
     * @param  int $unix_time
     * @return self
     */
    public function set_timestamp(int $unix_time=-1): self {
        return $this->setUnixTime0($unix_time);
    }

    /**
     * @return int
     */
    public function get_timestamp(): int {
        return $this->unix_timestamp0;
    }

}
