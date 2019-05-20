<?php

namespace CodeManager\Entity\Users;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;


/**
 * Class EntityVendor
 * @package CodeManager\Entity\Users
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Users\EntityVendorRepository")
 * @ORM\Table(name="vendors")
 */
class EntityVendor {

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     * @Column(name="name", type="string", nullable=true, unique=true)
     */
    private $name;

    /**
     * @var string
     * @Column(name="description", type="string", nullable=true, unique=false)
     */
    private $description;

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
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @param string $name
     * @return self
     */
    public function setName(string $name): self {
        $this->name = $name;
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

}