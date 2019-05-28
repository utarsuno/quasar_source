<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Finance\EntityBankTransactionType;


trait FieldHasPointerToBankTransactionType {

    /**
     * @var EntityBankTransactionType
     * @anyToOne(targetEntity="CodeManager\Entity\Finance\EntityBankTransctionType")
     */
    protected $type;

    /**
     * @return EntityBankTransactionType
     */
    public function getType(): EntityBankTransactionType {
        return $this->type;
    }

    /**
     * @param EntityBankTransactionType $type
     * @return self
     */
    public function setType(EntityBankTransactionType $type): self {
        $this->type = $type;
        return $this;
    }
}
