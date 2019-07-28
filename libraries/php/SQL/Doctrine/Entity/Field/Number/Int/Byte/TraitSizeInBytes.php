<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Byte;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitSizeInBytes
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Byte
 */
trait TraitSizeInBytes {

    /**
     * @var int
     * @Column(name="size_in_bytes", type="integer", nullable=true, unique=false, options={"unsigned"=true})
     */
    protected $size_in_bytes;

    /**
     * @return int
     */
    public function getSizeInBytes(): int {
        return $this->size_in_bytes;
    }

    /**
     * @param  int $size_in_bytes
     * @return self
     */
    public function setSizeInBytes(int $size_in_bytes): self {
        if (!UtilsDoctrine::does_value_fit_into_int($size_in_bytes)) {
            throw new InvalidArgumentException('SmallInt0{' . $size_in_bytes . '} is either too small or too large!');
        }
        $this->size_in_bytes = $size_in_bytes;
        return $this;
    }

}



