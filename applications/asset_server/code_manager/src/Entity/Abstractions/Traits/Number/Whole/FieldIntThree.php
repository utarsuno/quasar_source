<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldIntThree
 * @package CodeManager\Entity\Abstractions\Traits\Number\Whole
 */
trait FieldIntThree {
    use FieldIntTwo;

    /**
     * @var int
     * @Column(name="int2", type="integer", nullable=true, unique=false)
     */
    protected $int2;

    /**
     * @return int
     */
    public function getInt2(): int {
        return $this->int2;
    }

    /**
     * @param int $int2
     * @return self
     */
    public function setInt2(int $int2): self {
        $this->int2 = $int2;
        return $this;
    }

}

