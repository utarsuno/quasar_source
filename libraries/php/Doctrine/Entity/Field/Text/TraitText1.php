<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitText1
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitText1 {
    use TraitText0;

    /**
     * @var string
     * @Column(name="Text1", type="string", nullable=true, unique=false)
     */
    protected $text1;

    /**
     * @return string
     */
    public function getText1(): string {
        return $this->text1;
    }

    /**
     * @param string $text1
     * @return self
     */
    public function setText1(string $text1): self {
        $this->text1 = $text1;
        return $this;
    }
}
