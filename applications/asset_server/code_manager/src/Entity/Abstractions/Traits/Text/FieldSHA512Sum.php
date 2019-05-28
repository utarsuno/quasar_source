<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldSHA512Sum {

    /**
     * @Column(name="sha512sum", type="string", nullable=true, unique=true, length=512)
     */
    protected $sha512sum;

    /**
     * @return string
     */
    public function getSha512sum() : string {
        return $this->sha512sum;
    }

    /**
     * @param string $sha512sum
     * @return self
     */
    public function setSha512sum(string $sha512sum) : self {
        $this->sha512sum = $sha512sum;
        return $this;
    }

}

