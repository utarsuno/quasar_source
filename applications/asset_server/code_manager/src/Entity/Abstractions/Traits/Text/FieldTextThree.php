<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldTextThree
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait FieldTextThree {
    use FieldTextTwo;

    /**
     * @var string
     * @Column(name="text2", type="string", nullable=true, unique=false)
     */
    protected $text2;

    /**
     * @return string
     */
    public function getText2(): string {
        return $this->text2;
    }

    /**
     * @param string $text2
     * @return self
     */
    public function setText2(string $text2): self {
        $this->text2 = $text2;
        return $this;
    }
}
