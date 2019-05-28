<?php

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;


trait FieldTypeID {

    /**
     * @var int
     * @Column(name="type_id", type="integer", nullable=false, unique=false)
     */
    protected $type_id;

    /**
     * @return int
     */
    public function getTypeID() : int {
        return $this->type_id;
    }

    /**
     * @param int $type_id
     * @return self
     */
    public function setTypeID(int $type_id) : self {
        $this->type_id = $type_id;
        return $this;
    }

}



