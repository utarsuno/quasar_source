<?php

namespace CodeManager\Entity\Abstractions\Traits\Time;

use DateTime;
use Doctrine\ORM\Mapping\Column;


trait FieldLastChecked {

    /**
     * @var DateTime
     * @Column(name="last_checked", type="datetime", nullable=false, unique=false)
     */
    private $last_checked;

    /**
     * @return DateTime
     */
    public function getLastChecked(): DateTime {
        return $this->last_checked;
    }

    /**
     * @param DateTime $last_checked
     * @return self
     */
    public function setLastChecked(DateTime $last_checked): self {
        $this->last_checked = $last_checked;
        return $this;
    }

}
