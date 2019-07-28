<?php declare(strict_types=1);

namespace QuasarSource\SQL\Doctrine\Entity\Field\Text;

use Doctrine\ORM\Mapping\Column;

/**
 * Trait TraitSHA512Sum
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitSHA512Sum {

    /** @var string */
    protected $latest_sha512sum_to_update_to;

    /**
     * @var string
     * @Column(name="sha512sum", type="string", nullable=true, unique=true, length=128)
     */
    protected $sha512sum;

    /**
     * @return string
     */
    public function getSHA512Sum(): string {
        return $this->sha512sum;
    }

    /**
     * @param  string $sum
     * @return self
     */
    public function setSHA512Sum(string $sum): self {
        $this->sha512sum = $sum;
        return $this;
    }

}
