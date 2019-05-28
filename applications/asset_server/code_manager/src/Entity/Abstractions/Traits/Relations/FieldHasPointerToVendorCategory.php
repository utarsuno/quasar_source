<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityVendorCategory;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldHasPointerToVendorCategory {

    /**
     * @var EntityVendorCategory
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityVendorCategory")
     */
    protected $category;

    /**
     * @return EntityVendorCategory
     */
    public function getCategory(): EntityVendorCategory {
        return $this->category;
    }

    /**
     * @param EntityVendorCategory $category
     * @return self
     */
    public function setCategory(EntityVendorCategory $category): self {
        $this->category = $category;
        return $this;
    }
}
