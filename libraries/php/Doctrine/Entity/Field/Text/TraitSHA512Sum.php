<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Entity\Field\Text;

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

    public function trait_destruct_sha512sum(): void {
        unset($this->latest_sha512sum_to_update_to);
    }

    /**
     * @param  string $sum
     * @return bool
     */
    public function syncSHA512Sum(string $sum): bool {
        if ($this->sha512sum !== $sum) {
            $this->sha512sum = $sum;
            return true;
        }
        return false;
    }

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
