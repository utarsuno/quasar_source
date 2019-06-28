<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldTextTwo {
    use FieldText;

    /**
     * @var string
     * @Column(name="text1", type="string", nullable=true, unique=false)
     */
    protected $text1;

    /**
     * @return string
     */
    public function getText1(): string {
        return $this->text1;
    }

    /**
     * @param string $text1
     * @return self
     */
    public function setText1(string $text1): self {
        $this->text1 = $text1;
        return $this;
    }

}



