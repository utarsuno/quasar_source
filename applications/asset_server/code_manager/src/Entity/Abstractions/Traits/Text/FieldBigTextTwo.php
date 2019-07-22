<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldBigTextTwo
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait FieldBigTextTwo {
    use FieldBigText;

    /**
     * @var string
     * @Column(name="blob1", type="text", nullable=true, unique=false)
     */
    protected $blob1;

    /**
     * @return string
     */
    public function getBlob1(): string {
        return $this->blob1;
    }

    /**
     * @param  string $blob1
     * @return self
     */
    public function setBlob1(string $blob1): self {
        $this->blob1 = $blob1;
        return $this;
    }
}
