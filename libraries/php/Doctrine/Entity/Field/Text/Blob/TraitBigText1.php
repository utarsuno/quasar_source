<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text\Blob;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Doctrine\UtilsDoctrine;

/**
 * Trait TraitBigText1
 * @package QuasarSource\Doctrine\Entity\Field\Text\Blob
 */
trait TraitBigText1 {
    use TraitBigText0;

    /**
     * @var string
     * @Column(name="blob1", type="text", nullable=true, unique=false)
     */
    protected $blob1;

    /**
     * @return string
     */
    public function getBlob1(): string {
        return $this->blob1;
    }

    /**
     * @param  mixed $blob1
     * @return self
     */
    public function setBlob1($blob1): self {
        $this->blob1 = UtilsDoctrine::convert_to_non_empty_string_or_null($blob1);
        return $this;
    }

}



