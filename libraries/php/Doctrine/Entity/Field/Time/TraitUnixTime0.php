<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Time;

use Doctrine\ORM\Mapping\Column;
use QuasarSource\Utils\Time\UtilsUnixTime as UNIX;

/**
 * Trait TraitUnixTime0
 * @package QuasarSource\Doctrine\Entity\Field\Time
 */
trait TraitUnixTime0 {

    /**
     * @var int
     * @Column(name="unix_time0", type="integer", nullable=true, unique=false, options={"unsigned"=true})
     */
    protected $unix_time0;

    /**
     * @return int|null
     */
    public function getUnixTime0(): ?int {
        if (is_string($this->unix_time0)) {
            $this->unix_time0 = (int) $this->unix_time0;
        }
        return $this->unix_time0;
    }

    /**
     * @param  int $unix_time0
     * @return self
     */
    public function setUnixTime0(int $unix_time0=-1): self {
        if ($unix_time0 === -1) {
            $this->unix_time0 = UNIX::now();
        } else {
            $this->unix_time0 = $unix_time0;
        }
        return $this;
    }

}
