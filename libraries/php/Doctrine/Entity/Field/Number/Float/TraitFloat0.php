<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Number\Float;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitFloat0
 * @package QuasarSource\Doctrine\Entity\Field\Number\Float
 */
trait TraitFloat0 {

    /**
     * @var float
     * @Column(name="float0", type="float", nullable=true, unique=false)
     */
    protected $float0;

    /**
     * @return float|null
     */
    public function getFloat0(): ?float {
        return $this->float0;
    }

    /**
     * @param float $float0
     * @return self
     */
    public function setFloat0(float $float0): self {
        $this->float0 = $float0;
        return $this;
    }
}
