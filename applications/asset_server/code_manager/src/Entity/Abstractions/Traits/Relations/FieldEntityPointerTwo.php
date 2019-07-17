<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldEntityPointerTwo
 * @package CodeManager\Entity\Abstractions\Traits\Relations
 */
trait FieldEntityPointerTwo {
    use FieldEntityPointer;

    /**
     * @var int
     * @Column(name="entity_pointer1", type="integer", nullable=true, unique=false)
     */
    protected $entity_pointer1;

    /**
     * @return int
     */
    public function getEntityPointer1(): int {
        return $this->entity_pointer1;
    }

    /**
     * @param int $entity_1_id
     * @return self
     */
    public function setEntityPointer1(int $entity_1_id): self {
        $this->entity_pointer1 = $entity_1_id;
        return $this;
    }

}
