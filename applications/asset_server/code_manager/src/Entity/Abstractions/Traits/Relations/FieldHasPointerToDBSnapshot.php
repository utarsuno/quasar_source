<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\CodeManager\EntityDBSnapshot;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldHasPointerToDBSnapshot {

    /**
     * @var EntityDBSnapshot
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\EntityDBSnapshot")
     */
    protected $db_snapshot;

    /**
     * @return EntityDBSnapshot
     */
    public function getDbSnapshot(): EntityDBSnapshot {
        return $this->db_snapshot;
    }

    /**
     * @param EntityDBSnapshot $db_snapshot
     * @return self
     */
    public function setDbSnapshot(EntityDBSnapshot $db_snapshot): self {
        $this->db_snapshot = $db_snapshot;
        return $this;
    }
}
