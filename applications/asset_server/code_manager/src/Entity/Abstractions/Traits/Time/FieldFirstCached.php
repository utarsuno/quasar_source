<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;


trait FieldFirstCached {

    /**
     * @var DateTime
     * @Column(name="first_cached", type="datetime", nullable=true, unique=false)
     */
    protected $first_cached;

    /**
     * @return DateTime|null
     */
    public function getFirstCached(): ?DateTime {
        return $this->first_cached;
    }

    /**
     * @param DateTime $first_cached
     * @return self
     */
    public function setFirstCached(DateTime $first_cached): self {
        $this->first_cached = $first_cached;
        return $this;
    }

}



