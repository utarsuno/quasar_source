<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitBigText0
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Text\Blob
 */
trait TraitBigText0 {

    /**
     * @var string
     * @Column(name="blob0", type="text", nullable=true, unique=false)
     */
    protected $blob0;

    /**
     * @return string
     */
    public function getBlob0(): string {
        return $this->blob0;
    }

    /**
     * @param  mixed $blob0
     * @return self
     */
    public function setBlob0($blob0): self {
        $this->blob0 = UtilsDoctrine::convert_to_non_empty_string_or_null($blob0);
        return $this;
    }

}



