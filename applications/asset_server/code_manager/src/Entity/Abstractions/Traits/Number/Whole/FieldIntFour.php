<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;


trait FieldIntFour {
    use FieldIntThree;

    /**
     * @var int
     * @Column(name="int3", type="integer", nullable=false, unique=false)
     */
    protected $int3;

    /**
     * @return int
     */
    public function getInt3(): int {
        return $this->int3;
    }

    /**
     * @param int $int3
     * @return self
     */
    public function setInt3(int $int3): self {
        $this->int3 = $int3;
        return $this;
    }

}

