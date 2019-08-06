<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Time;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utils\Time\UtilsUnixTime as UNIX;

/**
 * Trait TraitUnixTime2
 * @package QuasarSource\Doctrine\Entity\Field\Time
 */
trait TraitUnixTime2 {
    use TraitUnixTime1;

    /**
     * @var int
     * @Column(name="unix_time2", type="integer", nullable=true, unique=false, options={"unsigned"=true})
     */
    protected $unix_time2;

    /**
     * @return int|null
     */
    public function getUnixTime2(): ?int {
        if (is_string($this->unix_time2)) {
            $this->unix_time2 = (int) $this->unix_time2;
        }
        return $this->unix_time2;
    }

    /**
     * @param  int $unix_time2
     * @return self
     */
    public function setUnixTime2(int $unix_time2=-1): self {
        if ($unix_time2 === -1) {
            $this->unix_time2 = UNIX::now();
        } else {
            $this->unix_time2 = $unix_time2;
        }
        return $this;
    }

}
