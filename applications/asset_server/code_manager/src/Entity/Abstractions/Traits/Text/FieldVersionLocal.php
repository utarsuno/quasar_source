<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldVersionLocal {

    /**
     * @var string
     * @Column(name="version_local", type="string", nullable=false, unique=false)
     */
    protected $version_local;

    /**
     * @return string
     */
    public function getVersionLocal(): string {
        return $this->version_local;
    }

    /**
     * @param string $version_local
     * @return self
     */
    public function setVersionLocal(string $version_local): self {
        $this->version_local = $version_local;
        return $this;
    }
}



