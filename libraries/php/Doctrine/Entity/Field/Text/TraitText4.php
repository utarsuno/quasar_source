<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitText4
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitText4 {
    use TraitText3;

    /**
     * @var string
     * @Column(name="Text4", type="string", nullable=true, unique=false)
     */
    protected $text4;

    /**
     * @return string
     */
    public function getText4(): string {
        return $this->text4;
    }

    /**
     * @param string $text4
     * @return self
     */
    public function setText4(string $text4): self {
        $this->text4 = $text4;
        return $this;
    }
}
