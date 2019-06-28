<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Time;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utilities\Time\UnixTimeUtilities as UNIX;


trait FieldUnixTimeTwo {
    use FieldUnixTime;

    /**
     * @var int
     * @Column(name="unix_timestamp1", type="bigint", nullable=true, unique=false)
     */
    protected $unix_timestamp1;

    /**
     * @return int|null
     */
    public function getUnixTimestamp1(): ?int {
        return $this->unix_timestamp1;
    }

    /**
     * @param int $unix_timestamp1
     * @return self
     */
    public function setUnixTimestamp1(int $unix_timestamp1=-1): self {
        if ($unix_timestamp1 === -1) {
            $this->unix_timestamp1 = UNIX::now();
        } else {
            $this->unix_timestamp1 = $unix_timestamp1;
        }
        return $this;
    }

}

