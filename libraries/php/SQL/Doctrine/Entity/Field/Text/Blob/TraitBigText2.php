<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitBigText2
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob
 */
trait TraitBigText2 {
    use TraitBigText1;

    /**
     * @var string
     * @Column(name="blob2", type="text", nullable=true, unique=false)
     */
    protected $blob2;

    /**
     * @return string
     */
    public function getBlob2(): string {
        return $this->blob2;
    }

    /**
     * @param  mixed $blob2
     * @return self
     */
    public function setBlob2($blob2): self {
        $this->blob2 = UtilsDoctrine::convert_to_non_empty_string_or_null($blob2);
        return $this;
    }

}



