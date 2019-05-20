<?php

namespace CodeManager\Entity\Finance;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBankTransaction
 * @package CodeManager\Entity\Finance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityBankTransactionRepository")
 * @Table(name="bank_transactions")
 */
class EntityBankTransaction {

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     * @Column(name="details", type="string", nullable=false, unique=false)
     */
    private $details;

    /**
     * @var DateTime
     * @Column(name="posted_at", type="datetime", nullable=false, unique=false)
     */
    private $posted_at;

    /**
     * @var string
     * @Column(name="description", type="string", nullable=true, unique=false)
     */
    private $description;

    /**
     * @var int
     * @Column(name="amount", type="integer", nullable=false, unique=false)
     */
    private $amount;

    /**
     * @var int
     * @Column(name="type", type="string", nullable=false, unique=false)
     */
    private $type;

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id): void {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getDetails(): int {
        return $this->details;
    }

    /**
     * @param int $details
     */
    public function setDetails(int $details): void {
        $this->details = $details;
    }

    /**
     * @return DateTime
     */
    public function getPostedAt(): DateTime {
        return $this->posted_at;
    }

    /**
     * @param DateTime $posted_at
     */
    public function setPostedAt(DateTime $posted_at): void {
        $this->posted_at = $posted_at;
    }

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description): void {
        $this->description = $description;
    }

    /**
     * @return int
     */
    public function getAmount(): int {
        return $this->amount;
    }

    /**
     * @param int $amount
     */
    public function setAmount(int $amount): void {
        $this->amount = $amount;
    }

    /**
     * @return int
     */
    public function getType(): int {
        return $this->type;
    }

    /**
     * @param int $type
     */
    public function setType(int $type): void {
        $this->type = $type;
    }


}
