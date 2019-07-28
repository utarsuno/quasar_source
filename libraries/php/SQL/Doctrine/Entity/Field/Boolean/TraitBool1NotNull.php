<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool1NotNull
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Boolean
 */
trait TraitBool1NotNull {
    use TraitBool0NotNull;

    /**
     * @var bool
     * @Column(name="bool_1", type="boolean", nullable=false, unique=false)
     */
    protected $bool_1;

    /**
     * @return bool
     */
    public function getBool_1(): bool {
        return $this->bool_1;
    }

    /**
     * @param  bool $bool_1
     * @return self
     */
    public function setBool_1(bool $bool_1): self {
        $this->bool_1 = $bool_1;
        return $this;
    }

}
