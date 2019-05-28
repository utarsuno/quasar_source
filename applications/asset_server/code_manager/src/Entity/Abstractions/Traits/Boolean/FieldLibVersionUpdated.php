<?php

namespace CodeManager\Entity\Abstractions\Traits\Boolean;
use Doctrine\ORM\Mapping\Column;


trait FieldLibVersionUpdated {

    /**
     * @var bool
     * @Column(name="lib_version_updated", type="boolean", nullable=false, unique=false)
     */
    protected $lib_version_updated;

    /**
     * @return bool
     */
    public function isLibVersionUpdated(): bool {
        return $this->lib_version_updated;
    }

    /**
     * @param bool $lib_version_updated
     * @return self
     */
    public function setLibVersionUpdated(bool $lib_version_updated): self {
        $this->lib_version_updated = $lib_version_updated;
        return $this;
    }
}
