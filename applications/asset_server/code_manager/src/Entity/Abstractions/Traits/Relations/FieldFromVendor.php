<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityVendor;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldFromVendor {

    /**
     * @var EntityVendor
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityVendor")
     */
    protected $fromVendor;

    /**
     * @return EntityVendor
     */
    public function getFromVendor(): EntityVendor {
        return $this->fromVendor;
    }

    /**
     * @param EntityVendor $fromVendor
     * @return self
     */
    public function setFromVendor(EntityVendor $fromVendor): self {
        $this->fromVendor = $fromVendor;
        return $this;
    }

}
