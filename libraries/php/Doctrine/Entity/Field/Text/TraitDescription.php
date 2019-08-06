<?php declare(strict_types=1);
namespace QuasarSource\Doctrine\Entity\Field\Text;
use Doctrine\ORM\Mapping\Column;
/**
 * Trait TraitDescription
 * @package CodeManager\Entity\Abstractions\Traits\Text
 */
trait TraitDescription {

    /**
     * @var string
     * @Column(name="description", type="string", nullable=true, unique=false, length=1024)
     */
    protected $description;

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param  string $description
     * @return self
     */
    public function setDescription(string $description): self {
        $this->description = $description;
        return $this;
    }

}
