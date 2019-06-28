<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Number\Decimal;
use Doctrine\ORM\Mapping\Column;


trait FieldFloat {

    /**
     * @var float
     * @Column(name="float0", type="float", nullable=true, unique=false)
     */
    protected $float0;

    /**
     * @return float
     */
    public function getFloat0(): float {
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
