<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Time;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utils\Time\UtilsUnixTime as UNIX;

/**
 * Trait TraitUnixTime1
 * @package QuasarSource\Doctrine\Entity\Field\Time
 */
trait TraitUnixTime1 {
    use TraitUnixTime0;

    /**
     * @var int
     * @Column(name="unix_time1", type="integer", nullable=true, unique=false, options={"unsigned"=true})
     */
    protected $unix_time1;

    /**
     * @return int|null
     */
    public function getUnixTime1(): ?int {
        if (is_string($this->unix_time1)) {
            $this->unix_time1 = (int) $this->unix_time1;
        }
        return $this->unix_time1;
    }

    /**
     * @param  int $unix_time1
     * @return self
     */
    public function setUnixTime1(int $unix_time1=-1): self {
        if ($unix_time1 === -1) {
            $this->unix_time1 = UNIX::now();
        } else {
            $this->unix_time1 = $unix_time1;
        }
        return $this;
    }

}
