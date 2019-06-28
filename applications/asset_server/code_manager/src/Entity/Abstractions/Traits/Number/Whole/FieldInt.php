<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Number\Whole;

use Doctrine\ORM\Mapping\Column;


trait FieldInt {

    /**
     * @var int
     * @Column(name="int0", type="integer", nullable=false, unique=false)
     */
    protected $int0;

    /**
     * @return int
     */
    public function getInt0(): int {
        return $this->int0;
    }

    /**
     * @param int $int0
     * @return self
     */
    public function setInt0(int $int0): self {
        $this->int0 = $int0;
        return $this;
    }

    /**
     * @param int $n
     * @return bool
     */
    public function isInt0EqualTo(int $n): bool {
        return $this->int0 === $n;
    }

}

