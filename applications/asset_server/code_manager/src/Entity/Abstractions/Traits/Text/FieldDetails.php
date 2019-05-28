<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldDetails {

    /**
     * @var string
     * @Column(name="details", type="string", nullable=true, unique=false)
     */
    protected $details;

    /**
     * @return string
     */
    public function getDetails(): string {
        return $this->details;
    }

    /**
     * @param string $details
     * @return self
     */
    public function setDetails(string $details): self {
        $this->details = $details;
        return $this;
    }

}



