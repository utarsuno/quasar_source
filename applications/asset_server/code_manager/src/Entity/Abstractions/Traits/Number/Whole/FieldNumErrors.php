<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;
use Doctrine\ORM\Mapping\Column;


trait FieldNumErrors {

    /**
     * @var int
     * @Column(name="num_errors", type="int", nullable=false, unique=false)
     */
    protected $num_errors;

    /**
     * @return int
     */
    public function getNumErrors(): int {
        return $this->num_errors;
    }

    /**
     * @param int $num_errors
     * @return self
     */
    public function setNumErrors(int $num_errors): self {
        $this->num_errors = $num_errors;
        return $this;
    }

}
