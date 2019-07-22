<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Boolean;
use Doctrine\ORM\Mapping\Column;


/**
 * Trait FieldBoolean
 * @package CodeManager\Entity\Abstractions\Traits\Boolean
 */
trait FieldBoolean {

    /**
     * @var bool
     * @Column(name="bool0", type="boolean", nullable=true, unique=false)
     */
    protected $bool0;

    /**
     * @return bool
     */
    public function isBooleanValue0(): bool {
        return $this->bool0;
    }

    /**
     * @param bool $bool0
     * @return self
     */
    public function setBooleanValue0(bool $bool0): self {
        $this->bool0 = $bool0;
        return $this;
    }
}
