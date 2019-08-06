<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitText0
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitText0 {

    /**
     * @var string
     * @Column(name="Text0", type="string", nullable=true, unique=false)
     */
    protected $text0;

    /**
     * @return string
     */
    public function getText0(): string {
        return $this->text0;
    }

    /**
     * @param  string $text0
     * @return self
     */
    public function setText0(string $text0): self {
        $this->text0 = $text0;
        return $this;
    }
}
