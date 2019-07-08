<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Time;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utilities\Time\UtilsUnixTime as UNIX;

/**
 * Trait FieldUnixTime
 * @package CodeManager\Entity\Abstractions\Traits\Time
 */
trait FieldUnixTime {

    /**
     * @var int
     * @Column(name="unix_timestamp0", type="bigint", nullable=true, unique=false)
     */
    protected $unix_timestamp0;

    /**
     * @return int|null
     */
    public function getUnixTime0(): ?int {
        return $this->unix_timestamp0;
    }

    /**
     * @param int $unix_timestamp0
     * @return self
     */
    public function setUnixTime0(int $unix_timestamp0=-1): self {
        if ($unix_timestamp0 === -1) {
            $this->unix_timestamp0 = UNIX::now();
        } else {
            $this->unix_timestamp0 = $unix_timestamp0;
        }
        return $this;
    }

}

