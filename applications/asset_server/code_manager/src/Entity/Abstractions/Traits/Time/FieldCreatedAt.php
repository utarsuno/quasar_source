<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;


trait FieldCreatedAt {

    /**
     * @var DateTime
     * @Column(name="created_at", type="datetime", nullable=false, unique=false)
     */
    protected $created_at;

    /**
     * @return DateTime
     */
    public function getCreatedAt(): ?DateTime {
        return $this->created_at;
    }

    /**
     * @param DateTime $created_at
     * @return self
     */
    public function setCreatedAt(DateTime $created_at): self {
        $this->created_at = $created_at;
        return $this;
    }

}



