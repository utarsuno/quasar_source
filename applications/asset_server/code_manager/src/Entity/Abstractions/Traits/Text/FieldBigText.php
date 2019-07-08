<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait FieldBigText
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait FieldBigText {

    /**
     * @var string
     * @Column(name="blob0", type="text", nullable=true, unique=false)
     */
    protected $blob0;

    /**
     * @return string
     */
    public function getBlob0(): string {
        return $this->blob0;
    }

    /**
     * @param  string $blob0
     * @return self
     */
    public function setBlob0(string $blob0): self {
        $this->blob0 = $blob0;
        return $this;
    }

}



