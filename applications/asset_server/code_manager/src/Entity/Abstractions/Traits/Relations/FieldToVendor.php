<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityVendor;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldToVendor {

    /**
     * @var EntityVendor
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityVendor")
     */
    protected $toVendor;

    /**
     * @return EntityVendor
     */
    public function getToVendor(): EntityVendor {
        return $this->toVendor;
    }

    /**
     * @param EntityVendor $toVendor
     * @return self
     */
    public function setToVendor(EntityVendor $toVendor): self {
        $this->toVendor = $toVendor;
        return $this;
    }

}
