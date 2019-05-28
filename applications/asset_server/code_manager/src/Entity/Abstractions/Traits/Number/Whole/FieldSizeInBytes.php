<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;
use Doctrine\ORM\Mapping\Column;


trait FieldSizeInBytes {

    /**
     * @Column(name="size_in_bytes", type="bigint", nullable=true, unique=false)
     */
    protected $size_in_bytes;

    /**
     * @return int
     */
    public function getSizeInBytes() : int {
        return $this->size_in_bytes;
    }

    /**
     * @param int $sizeInBytes
     * @return self
     */
    public function setSizeInBytes(int $sizeInBytes) : self {
        $this->size_in_bytes = $sizeInBytes;
        return $this;
    }
}
