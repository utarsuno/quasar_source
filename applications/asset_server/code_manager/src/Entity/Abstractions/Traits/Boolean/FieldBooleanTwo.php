<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Boolean;
use Doctrine\ORM\Mapping\Column;


trait FieldBooleanTwo {
    use FieldBoolean;

    /**
     * @var bool
     * @Column(name="bool1", type="boolean", nullable=false, unique=false)
     */
    protected $bool1;

    /**
     * @return bool
     */
    public function isBooleanValue1(): bool {
        return $this->bool1;
    }

    /**
     * @param bool $bool1
     * @return self
     */
    public function setBooleanValue1(bool $bool1): self {
        $this->bool1 = $bool1;
        return $this;
    }
}
