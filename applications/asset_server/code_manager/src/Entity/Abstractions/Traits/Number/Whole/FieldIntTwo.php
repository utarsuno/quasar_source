<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldIntTwo
 * @package CodeManager\Entity\Abstractions\Traits\Number\Whole
 */
trait FieldIntTwo {
    use FieldInt;

    /**
     * @var int
     * @Column(name="int1", type="integer", nullable=false, unique=false)
     */
    protected $int1;

    /**
     * @return int
     */
    public function getInt1(): int {
        return $this->int1;
    }

    /**
     * @param int $int1
     * @return self
     */
    public function setInt1(int $int1): self {
        $this->int1 = $int1;
        return $this;
    }

}
