<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityUserRole;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldHasPointerToUserRole {

    /**
     * @var EntityUserRole
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUserRole")
     */
    protected $role;

    /**
     * @return EntityUserRole
     */
    public function getRole(): EntityUserRole {
        return $this->role;
    }

    /**
     * @param EntityUserRole $role
     * @return self
     */
    public function setRole(EntityUserRole $role): self {
        $this->role = $role;
        return $this;
    }
}
