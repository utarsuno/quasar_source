<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;
use Doctrine\ORM\Mapping\Column;


trait FieldNumFailed {

    /**
     * @var int
     * @Column(name="num_failed", type="int", nullable=false, unique=false)
     */
    protected $num_failed;

    /**
     * @return int
     */
    public function getNumFailed(): int {
        return $this->num_failed;
    }

    /**
     * @param int $num_failed
     * @return self
     */
    public function setNumFailed(int $num_failed): self {
        $this->num_failed = $num_failed;
        return $this;
    }

}
