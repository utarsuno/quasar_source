<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldVersionLatest {

    /**
     * @var string
     * @Column(name="version_latest", type="string", nullable=false, unique=false)
     */
    protected $version_latest;

    /**
     * @return string
     */
    public function getVersionLatest(): string {
        return $this->version_latest;
    }

    /**
     * @param string $version_latest
     * @return self
     */
    public function setVersionLatest(string $version_latest): self {
        $this->version_latest = $version_latest;
        return $this;
    }
}



