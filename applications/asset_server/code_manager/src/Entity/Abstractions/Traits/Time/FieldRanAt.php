<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utilities\DateTimeUtilities as TIME;


trait FieldRanAt {

    /**
     * @var DateTime
     * @Column(name="ran_at", type="datetime", nullable=true, unique=false)
     */
    protected $ran_at;

    /**
     * @return DateTime|null
     */
    public function getRanAt(): ?DateTime {
        return $this->ran_at;
    }

    /**
     * @param DateTime $ran_at
     * @return self
     */
    public function setRanAt(DateTime $ran_at): self {
        $this->ran_at = $ran_at;
        return $this;
    }

    public function setRanAtNow(): self {
        return $this->setRanAt(TIME::now());
    }

}

