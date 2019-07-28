<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool1NotNull
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Boolean
 */
trait TraitBool2NotNull {
    use TraitBool1NotNull;

    /**
     * @var bool
     * @Column(name="bool_2", type="boolean", nullable=false, unique=false)
     */
    protected $bool_2;

    /**
     * @return bool
     */
    public function getBool_2(): bool {
        return $this->bool_2;
    }

    /**
     * @param  bool $bool_2
     * @return self
     */
    public function setBool_2(bool $bool_2): self {
        $this->bool_2 = $bool_2;
        return $this;
    }

}
