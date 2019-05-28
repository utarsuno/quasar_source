<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\Users\EntityUser;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldFromUser {

    /**
     * @var EntityUser
     * @ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUser")
     */
    protected $fromUser;

    /**
     * @return EntityUser
     */
    public function getFromUser(): EntityUser {
        return $this->fromUser;
    }

    /**
     * @param EntityUser $fromUser
     * @return self
     */
    public function setFromUser(EntityUser $fromUser): self {
        $this->fromUser = $fromUser;
        return $this;
    }

}
