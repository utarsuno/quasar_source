<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Boolean;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitBool0NotNull
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Boolean
 */
trait TraitBool0NotNull {

    /**
     * @var bool
     * @Column(name="bool_0", type="boolean", nullable=false, unique=false)
     */
    protected $bool_0;

    /**
     * @return bool
     */
    public function getBool_0(): bool {
        return $this->bool_0;
    }

    /**
     * @param  bool $bool_0
     * @return self
     */
    public function setBool_0(bool $bool_0): self {
        $this->bool_0 = $bool_0;
        return $this;
    }

}
