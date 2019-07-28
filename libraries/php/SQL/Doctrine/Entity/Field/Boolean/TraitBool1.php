<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool1
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Boolean
 */
trait TraitBool1 {
    use TraitBool0;

    /**
     * @var bool
     * @Column(name="bool1", type="boolean", nullable=true, unique=false)
     */
    protected $bool1;

    /**
     * @return bool
     */
    public function getBool1(): bool {
        return $this->bool1;
    }

    /**
     * @param  bool $bool1
     * @return self
     */
    public function setBool1(bool $bool1): self {
        $this->bool1 = $bool1;
        return $this;
    }

}
