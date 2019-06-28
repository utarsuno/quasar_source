<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Boolean;
use Doctrine\ORM\Mapping\Column;


trait FieldBooleanThree {
    use FieldBooleanTwo;

    /**
     * @var bool
     * @Column(name="bool2", type="boolean", nullable=false, unique=false)
     */
    protected $bool2;

    /**
     * @return bool
     */
    public function isBooleanValue2(): bool {
        return $this->bool2;
    }

    /**
     * @param bool $bool2
     * @return self
     */
    public function setBooleanValue2(bool $bool2): self {
        $this->bool2 = $bool2;
        return $this;
    }
}
