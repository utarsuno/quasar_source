<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldEmail {

    /**
     * @var string
     * @Column(name="email", type="string", nullable=false, unique=true)
     */
    protected $email;

    /**
     * @return string
     */
    public function getEmail(): string {
        return $this->email;
    }

    /**
     * @param string $email
     * @return self
     */
    public function setEmail(string $email): self {
        $this->email = $email;
        return $this;
    }

}



