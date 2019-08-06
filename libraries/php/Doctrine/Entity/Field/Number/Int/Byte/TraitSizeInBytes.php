<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Number\Int\Byte;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\Doctrine\UtilsDoctrine;

/**
 * Trait TraitSizeInBytes
 * @package QuasarSource\Doctrine\Entity\Field\Number\Int\Byte
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
        $this->verify_value($size_in_bytes);
        $this->size_in_bytes = $size_in_bytes;
        return $this;
    }

    /**
     * @param  int $size_in_bytes
     * @return bool
     */
    public function syncSizeInBytes(int $size_in_bytes): bool {
        $this->verify_value($size_in_bytes);
        if ($this->size_in_bytes !== $size_in_bytes) {
            $this->size_in_bytes = $size_in_bytes;
            return true;
        }
        return false;
    }

    /**
     * @param int $size_in_bytes
     */
    private function verify_value(int $size_in_bytes): void {
        if (!UtilsDoctrine::does_value_fit_into_int($size_in_bytes)) {
            throw new InvalidArgumentException('SmallInt0{' . $size_in_bytes . '} is either too small or too large!');
        }
    }
}



