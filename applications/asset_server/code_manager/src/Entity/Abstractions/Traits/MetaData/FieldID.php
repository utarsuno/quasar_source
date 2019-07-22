<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\MetaData;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;

/**
 * Trait FieldID
 * @package CodeManager\Entity\Abstractions\Traits\MetaData
 */
trait FieldID {

    /**
     * @var int $id
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    protected $id;

    /**
     * @return int
     */
    public function getID(): int {
        return $this->id;
    }

}
