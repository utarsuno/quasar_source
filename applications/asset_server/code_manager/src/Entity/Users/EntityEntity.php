<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\Users;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextThree;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimeTwo;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityEntity
 * @package CodeManager\Entity\Users
 *
 * @Entity(repositoryClass="CodeManager\Repository\Users\RepoEntityEntity")
 * @Table(name="entity_entity")
 */
class EntityEntity extends AbstractEntity {
    // Username, Password, Email.
    use FieldTextThree;
    // The time instance that this account was created at and last logged in at.
    use FieldUnixTimeTwo;
    // A pointer to the EntityUserRole.
    use FieldEntityPointer;

    public static $db_table_name = 'entity_entity';

    /**
     * @param  int $time
     * @return EntityEntity
     */
    public function set_created_at(int $time): self {
        return $this->setUnixTime0($time);
    }

    /**
     * @param  int $logged_in_at
     * @return EntityEntity
     */
    public function set_logged_in_at(int $logged_in_at): self {
        return $this->setUnixTimestamp1($logged_in_at);
    }

    /**
     * @param  string $username
     * @return EntityEntity
     */
    public function set_username(string $username): self {
        return $this->setText0($username);
    }

    /**
     * @param  string $password
     * @return EntityEntity
     */
    public function set_password(string $password): self {
        return $this->setText1($password);
    }

    /**
     * @param  string $email
     * @return EntityEntity
     */
    public function set_email(string $email): self {
        return $this->setText2($email);
    }
}
