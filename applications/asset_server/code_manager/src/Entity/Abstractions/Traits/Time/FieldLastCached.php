<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;


trait FieldLastCached {

    /**
     * @var DateTime
     * @Column(name="last_cached", type="datetime", nullable=true, unique=false)
     */
    protected $last_cached;

    /**
     * @return DateTime|null
     */
    public function getLastCached(): ?DateTime {
        return $this->last_cached;
    }

    /**
     * @param DateTime $last_cached
     * @return self
     */
    public function setLastCached(DateTime $last_cached): self {
        $this->last_cached = $last_cached;
        return $this;
    }

}



