<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\File;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldInt;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextTwo;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTimeTwo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Entity;

use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity\File
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityDirectoryRepository")
 * @Table(name="directory")
 */
class EntityDirectory extends EntityState implements EntityInterface, CacheTableInterface {
    use TraitCacheTable;
    use FieldID;
    // The time instance that this directory was first and last cached at.
    use FieldUnixTimeTwo;
    // SHA512SUM, relative path.
    use FieldTextTwo;
    // Directory TypeID.
    use FieldInt;
    // Parent directory.
    use FieldEntityPointer;

    public const TYPE_NO_MATCH = -1;
    public const TYPE_IGNORE   = 1;

    #public function __construct() {
    #    $this->files       = new ArrayCollection();
    #    $this->directories = new ArrayCollection();
    #}

    public function cache_needs_update(bool $trigger_update): bool {
        return false;
    }

    public function cache_update(bool $update_state=true): void {}

    public function on_event_born($data): void {}

    public function cache_calculate(string $cache_key) {}
}
