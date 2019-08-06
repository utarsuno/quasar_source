<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitText3
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitText3 {
    use TraitText2;

    /**
     * @var string
     * @Column(name="Text3", type="string", nullable=true, unique=false)
     */
    protected $text3;

    /**
     * @return string
     */
    public function getText3(): string {
        return $this->text3;
    }

    /**
     * @param string $text3
     * @return self
     */
    public function setText3(string $text3): self {
        $this->text3 = $text3;
        return $this;
    }
}
