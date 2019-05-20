<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityUser
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\EntityUserRepository")
 * @Table(
 *     name="users",
 *     indexes={
 *         @Index(
 *             name="search_entity_users",
 *             columns={"username", "email", "last_login"}
 *         )
 *     }
 * )
 */
class EntityUser {

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var EntityUserRole
     * @ORM\ManyToOne(targetEntity="CodeManager\Entity\Users\EntityUserRole")
     */
    private $role;

    /**
     * @var string
     * @Column(name="username", type="string", nullable=true, unique=true)
     */
    private $username;

    /**
     * @var string
     * @Column(name="password", type="string", nullable=true, unique=true)
     */
    private $password;

    /**
     * @var string
     * @Column(name="email", type="string", nullable=true, unique=true)
     */
    private $email;

    /**
     * @var DateTime
     * @Column(name="last_login", type="datetime", nullable=true, unique=false)
     */
    private $last_login;

    /**
     * @var DateTime
     * @Column(name="created_at", type="datetime", nullable=false, unique=false)
     */
    private $created_at;

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
    public function getUsername(): string {
        return $this->username;
    }

    /**
     * @param string $username
     * @return self
     */
    public function setUsername(string $username): self {
        $this->username = $username;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getLastLogin(): DateTime {
        return $this->last_login;
    }

    /**
     * @param DateTime $last_login
     * @return self
     */
    public function setLastLogin(DateTime $last_login): self {
        $this->last_login = $last_login;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt(): DateTime {
        return $this->created_at;
    }

    /**
     * @param DateTime $created_at
     * @return self
     */
    public function setCreatedAt(DateTime $created_at): self {
        $this->created_at = $created_at;
        return $this;
    }

    /**
     * @return string
     */
    public function getPassword(): string {
        return $this->password;
    }

    /**
     * @param string $password
     * @return self
     */
    public function setPassword(string $password): self {
        $this->password = $password;
        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): string {
        return $this->email;
    }

    /**
     * @param string $email
     * @return self
     */
    public function setEmail(string $email): self {
        $this->email = $email;
        return $this;
    }

    /**
     * @return EntityUserRole
     */
    public function getRole(): EntityUserRole {
        return $this->role;
    }

    /**
     * @param EntityUserRole $role
     * @return self
     */
    public function setRole(EntityUserRole $role): self {
        $this->role = $role;
        return $this;
    }
}
