<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Color;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\Utils\DataType\Object\UtilsHex;

/**
 * Trait TraitHexColor0
 * @package QuasarSource\Doctrine\Entity\Field\Color
 */
trait TraitHexColor0 {

    /**
     * @var string
     * @Column(name="hexcolor0", type="string", nullable=true, unique=false, length=8)
     */
    protected $hexcolor0;

    /**
     * @param string $hex
     */
    protected function verify_value(string $hex): void {
        $result = UtilsHex::verify_color($hex);
        if ($result !== '') {
            throw new InvalidArgumentException('HexColor{' . $hex .'} value provided is not valid{' . $result . '}');
        }
    }

    /**
     * @return string
     */
    public function getHexColor0(): string {
        return $this->hexcolor0;
    }

    /**
     * @param  string $hex_color0
     * @return self
     */
    public function setHexColor0(string $hex_color0): self {
        $this->verify_value($hex_color0);
        $this->hexcolor0 = strtoupper($hex_color0);
        return $this;
    }
}
