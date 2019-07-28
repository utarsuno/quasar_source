<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitEntityType0
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small
 */
trait TraitEntityType {

    /**
     * @var int
     * @Column(name="entity_type", type="smallint", nullable=true, unique=false)
     */
    protected $entity_type;

    /**
     * @return int
     */
    public function getEntityType(): int {
        return $this->entity_type;
    }

    /**
     * @param  int $entity_type
     * @return self
     */
    public function setEntityType(int $entity_type): self {
        if (!UtilsDoctrine::does_value_fit_into_smallint($entity_type)) {
            throw new InvalidArgumentException('entity_type{' . $entity_type . '} is either too small or too large!');
        }
        $this->entity_type = $entity_type;
        return $this;
    }

}



