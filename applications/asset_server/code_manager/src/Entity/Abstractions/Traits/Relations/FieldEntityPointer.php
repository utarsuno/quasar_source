<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use Doctrine\ORM\Mapping\Column;


trait FieldEntityPointer {

    /**
     * @var int
     * @Column(name="entity_pointer0", type="integer", nullable=true, unique=false)
     */
    protected $entity_pointer0;

    /**
     * @return int
     */
    public function getEntityPointer0(): int {
        return $this->entity_pointer0;
    }

    /**
     * @param int $entity_0_id
     * @return self
     */
    public function setEntityPointer0(int $entity_0_id): self {
        $this->entity_pointer0 = $entity_0_id;
        return $this;
    }

}
