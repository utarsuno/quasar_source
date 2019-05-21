<?php

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Users\EntityUser;
use CodeManager\Entity\Users\EntityVendor;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityCashFlow
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityCashFlowRepository")
 * @Table(name="cash_flows")
 */
class EntityCashFlow {

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     * @Column(name="amount", type="integer", nullable=false, unique=false)
     */
    private $amount;

    /**
     * @var string
     * @Column(name="description", type="string", nullable=true, unique=false)
     */
    private $description;

    /**
     * @var EntityVendor
     * @ORM\ManyToOne(targetEntity="CodeManager\Entity\Users\EntityVendor")
     */
    private $fromVendor;

    /**
     * @var EntityUser
     * @ORM\ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUser")
     */
    private $fromUser;

    /**
     * @var EntityVendor
     * @ORM\ManyToOne(targetEntity="CodeManager\Entity\Users\EntityVendor")
     */
    private $toVendor;

    /**
     * @var EntityUser
     * @ORM\ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUser")
     */
    private $toUser;

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return self
     */
    public function setId($id): self {
        $this->id = $id;
        return $this;
    }

    /**
     * @return int
     */
    public function getAmount(): int {
        return $this->amount;
    }

    /**
     * @param int $amount
     * @return self
     */
    public function setAmount(int $amount): self {
        $this->amount = $amount;
        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param string $description
     * @return self
     */
    public function setDescription(string $description): self {
        $this->description = $description;
        return $this;
    }

    /**
     * @return EntityVendor
     */
    public function getFromVendor(): EntityVendor {
        return $this->fromVendor;
    }

    /**
     * @param EntityVendor $fromVendor
     * @return self
     */
    public function setFromVendor(EntityVendor $fromVendor): self {
        $this->fromVendor = $fromVendor;
        return $this;
    }

    /**
     * @return EntityUser
     */
    public function getFromUser(): EntityUser {
        return $this->fromUser;
    }

    /**
     * @param EntityUser $fromUser
     * @return self
     */
    public function setFromUser(EntityUser $fromUser): self {
        $this->fromUser = $fromUser;
        return $this;
    }

    /**
     * @return EntityVendor
     */
    public function getToVendor(): EntityVendor {
        return $this->toVendor;
    }

    /**
     * @param EntityVendor $toVendor
     * @return self
     */
    public function setToVendor(EntityVendor $toVendor): self {
        $this->toVendor = $toVendor;
        return $this;
    }

    /**
     * @return EntityUser
     */
    public function getToUser(): EntityUser {
        return $this->toUser;
    }

    /**
     * @param EntityUser $toUser
     * @return self
     */
    public function setToUser(EntityUser $toUser): self {
        $this->toUser = $toUser;
        return $this;
    }

}
