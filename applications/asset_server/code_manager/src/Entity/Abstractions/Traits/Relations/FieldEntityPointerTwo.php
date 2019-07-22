<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Relations;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;

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
     * @param  mixed $entity_1_id
     * @return self
     */
    public function setEntityPointer1($entity_1_id): self {
        if (is_int($entity_1_id)) {
            $this->entity_pointer1 = $entity_1_id;
        } else if ($entity_1_id === null) {
            throw new InvalidArgumentException('EntityPointer provided is null.');
        } else {
            /** @var AbstractEntity $entity_1_id */
            $this->entity_pointer1 = $entity_1_id->getID();
        }
        return $this;
    }

}
