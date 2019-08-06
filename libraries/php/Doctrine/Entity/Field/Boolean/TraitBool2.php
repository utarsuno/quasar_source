<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool2
 * @package QuasarSource\Doctrine\Entity\Field\Boolean
 */
trait TraitBool2 {
    use TraitBool1;

    /**
     * @var bool
     * @Column(name="bool2", type="boolean", nullable=true, unique=false)
     */
    protected $bool2;

    /**
     * @return bool
     */
    public function getBool2(): bool {
        return $this->bool2;
    }

    /**
     * @param  bool $bool2
     * @return self
     */
    public function setBool2(bool $bool2): self {
        $this->bool1 = $bool2;
        return $this;
    }

}
