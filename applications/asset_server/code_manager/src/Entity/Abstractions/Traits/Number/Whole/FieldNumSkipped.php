<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;
use Doctrine\ORM\Mapping\Column;


trait FieldNumSkipped {

    /**
     * @var int
     * @Column(name="num_skipped", type="int", nullable=false, unique=false)
     */
    protected $num_skipped;

    /**
     * @return int
     */
    public function getNumSkipped(): int {
        return $this->num_skipped;
    }

    /**
     * @param int $num_skipped
     * @return self
     */
    public function setNumSkipped(int $num_skipped): self {
        $this->num_skipped = $num_skipped;
        return $this;
    }
}
