<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Color;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitHexColor0
 * @package QuasarSource\Doctrine\Entity\Field\Color
 */
trait TraitHexColor1 {
    use TraitHexColor0;

    /**
     * @var string
     * @Column(name="hexcolor1", type="string", nullable=true, unique=false, length=8)
     */
    protected $hexcolor1;

    /**
     * @return string
     */
    public function getHexColor1(): string {
        return $this->hexcolor1;
    }

    /**
     * @param  string $hex_color1
     * @return self
     */
    public function setHexColor1(string $hex_color1): self {
        $this->verify_value($hex_color1);
        $this->hexcolor1 = strtoupper($hex_color1);
        return $this;
    }
}
