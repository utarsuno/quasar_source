<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;


trait FieldCashAmount {

    /**
     * @var int
     * @Column(name="amount", type="integer", nullable=false, unique=false)
     */
    protected $amount;

    /**
     * @return int
     */
    public function getAmount(): int {
        return $this->amount;
    }

    /**
     * @param int $amount
     * @return self
     */
    public function setAmount(int $amount): self {
        $this->amount = $amount;
        return $this;
    }

}
