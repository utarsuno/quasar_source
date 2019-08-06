<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool0
 * @package QuasarSource\Doctrine\Entity\Field\Boolean
 */
trait TraitBool0 {

    /**
     * @var bool
     * @Column(name="bool0", type="boolean", nullable=true, unique=false)
     */
    protected $bool0;

    /**
     * @return bool
     */
    public function getBool0(): bool {
        return $this->bool0;
    }

    /**
     * @param  bool $bool0
     * @return self
     */
    public function setBool0(bool $bool0): self {
        $this->bool0 = $bool0;
        return $this;
    }

}
