<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitSmallInt0
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small
 */
trait TraitSmallInt0 {

    /**
     * @var int
     * @Column(name="smallint0", type="smallint", nullable=true, unique=false)
     */
    protected $smallint0;

    /**
     * @return int
     */
    public function getSmallInt0(): int {
        return $this->smallint0;
    }

    /**
     * @param  int $small_int0
     * @return self
     */
    public function setSmallInt0(int $small_int0): self {
        if (!UtilsDoctrine::does_value_fit_into_smallint($small_int0)) {
            throw new InvalidArgumentException('SmallInt0{' . $small_int0 . '} is either too small or too large!');
        }
        $this->smallint0 = $small_int0;
        return $this;
    }

}



