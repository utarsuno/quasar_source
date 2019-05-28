<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;


trait FieldLastLogin {

    /**
     * @var DateTime
     * @Column(name="last_login", type="datetime", nullable=true, unique=false)
     */
    protected $last_login;

    /**
     * @return DateTime
     */
    public function getLastLogin(): DateTime {
        return $this->last_login;
    }

    /**
     * @param DateTime $last_login
     * @return self
     */
    public function setLastLogin(DateTime $last_login): self {
        $this->last_login = $last_login;
        return $this;
    }

}
