<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Relations;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;

/**
 * Trait FieldEntityPointer
 * @package CodeManager\Entity\Abstractions\Traits\Relations
 */
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
     * @param  mixed $entity_0_id
     * @return self
     */
    public function setEntityPointer0($entity_0_id): self {
        if (is_int($entity_0_id)) {
            $this->entity_pointer0 = $entity_0_id;
        } else if ($entity_0_id === null) {
            throw new InvalidArgumentException('EntityPointer provided is null.');
        } else {
            /** @var AbstractEntity $entity_1_id */
            $this->entity_pointer0 = $entity_0_id->getID();
        }
        return $this;
    }

}
