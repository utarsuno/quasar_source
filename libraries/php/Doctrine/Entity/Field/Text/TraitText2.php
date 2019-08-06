<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitText2
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitText2 {
    use TraitText1;

    /**
     * @var string
     * @Column(name="Text2", type="string", nullable=true, unique=false)
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
