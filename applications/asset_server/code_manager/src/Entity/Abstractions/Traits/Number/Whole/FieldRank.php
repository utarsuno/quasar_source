<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;


trait FieldRank {

    /**
     * @var int
     * @Column(type="integer", nullable=false, unique=false)
     */
    protected $rank;

    /**
     * @return int
     */
    public function getRank(): int {
        return $this->rank;
    }

    /**
     * @param int $rank
     * @return self
     */
    public function setRank(int $rank): self {
        $this->rank = $rank;
        return $this;
    }

}

