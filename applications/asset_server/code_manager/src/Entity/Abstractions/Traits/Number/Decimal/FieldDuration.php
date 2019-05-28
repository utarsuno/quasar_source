<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Decimal;
use Doctrine\ORM\Mapping\Column;


trait FieldDuration {

    /**
     * @var float
     * @Column(name="duration", type="float", nullable=false, unique=false)
     */
    protected $duration;

    /**
     * @return float
     */
    public function getDuration(): float {
        return $this->duration;
    }

    /**
     * @param float $duration
     * @return self
     */
    public function setDuration(float $duration): self {
        $this->duration = $duration;
        return $this;
    }
}
