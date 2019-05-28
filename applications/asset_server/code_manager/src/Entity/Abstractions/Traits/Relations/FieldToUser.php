<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityUser;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldToUser {

    /**
     * @var EntityUser
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUser")
     */
    protected $toUser;

    /**
     * @return EntityUser
     */
    public function getToUser(): EntityUser {
        return $this->toUser;
    }

    /**
     * @param EntityUser $toUser
     * @return self
     */
    public function setToUser(EntityUser $toUser): self {
        $this->toUser = $toUser;
        return $this;
    }

}
