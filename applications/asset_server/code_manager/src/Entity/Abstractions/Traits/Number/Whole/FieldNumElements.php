<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;
use Doctrine\ORM\Mapping\Column;


trait FieldNumElements {

    /**
     * @var int
     * @Column(name="num_elements", type="int", nullable=false, unique=false)
     */
    protected $number_of_elements;

    /**
     * @return int
     */
    public function getNumElements(): int {
        return $this->number_of_elements;
    }

    /**
     * @param int $number_of_elements
     * @return self
     */
    public function setNumElements(int $number_of_elements): self {
        $this->number_of_elements = $number_of_elements;
        return $this;
    }
}
