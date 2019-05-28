<?php

namespace CodeManager\Entity\Abstractions\Traits\Boolean;
use Doctrine\ORM\Mapping\Column;


trait FieldOptional {

    /**
     * @var bool
     * @Column(name="optional", type="boolean", nullable=false, unique=false)
     */
    protected $optional;

    /**
     * @return bool
     */
    public function isOptional(): bool {
        return $this->optional;
    }

    /**
     * @param bool $optional
     * @return self
     */
    public function setOptional(bool $optional): self {
        $this->optional = $optional;
        return $this;
    }
}
