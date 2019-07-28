<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small;

use Doctrine\ORM\Mapping\Column;
use InvalidArgumentException;
use QuasarSource\SQL\Doctrine\UtilsDoctrine;

/**
 * Trait TraitSmallInt1
 * @package QuasarSource\SQL\Doctrine\Entity\Field\Number\Int\Small
 */
trait TraitSmallInt1 {
    use TraitSmallInt0;

    /**
     * @var string
     * @Column(name="smallint1", type="smallint", nullable=true, unique=false)
     */
    protected $smallint1;

    /**
     * @return string
     */
    public function getSmallInt1(): string {
        return $this->smallint1;
    }

    /**
     * @param  int $small_int1
     * @return self
     */
    public function setSmallInt1(int $small_int1): self {
        if (!UtilsDoctrine::does_value_fit_into_smallint($small_int1)) {
            throw new InvalidArgumentException('SmallInt1{' . $small_int1 . '} is either too small or too large!');
        }
        $this->smallint1 = $small_int1;
        return $this;
    }

}



