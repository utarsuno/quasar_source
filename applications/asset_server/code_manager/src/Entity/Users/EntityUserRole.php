<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;


use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityUserRole
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\EntityUserRoleRepository")
 * @Table(
 *     name="user_roles",
 *     indexes={
 *         @Index(
 *             name="search_entity_user_roles",
 *             columns={"name", "rank"}
 *         )
 *     }
 * )
 */
class EntityUserRole {

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     * @Column(name="name", type="string", nullable=false, unique=true)
     */
    private $name;

    /**
     * @var int
     * @Column(name="rank", type="integer", nullable=false, unique=true)
     */
    private $rank;

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
     * @return int
     */
    public function getRank(): int {
        return $this->rank;
    }

    /**
     * @param int $rank
     * @return self
     */
    public function setRank(int $rank): self {
        $this->rank = $rank;
        return $this;
    }

}
