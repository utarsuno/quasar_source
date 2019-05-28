<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldName;
use CodeManager\Entity\Abstractions\Traits\Text\FieldVersionLatest;
use CodeManager\Entity\Abstractions\Traits\Text\FieldVersionLocal;
use CodeManager\Entity\Abstractions\Traits\Time\FieldLastChecked;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructures\Cached;
use QuasarSource\DataStructures\TraitCached;
use QuasarSource\Utilities\DateTimeUtilities as TIME;
use QuasarSource\Utilities\DateTimeUtilities as DATE;
use QuasarSource\Utilities\Files\PathUtilities as PATH;
use QuasarSource\Utilities\Processes\ProcessUtilities as RUN;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityNPMLibRepository")
 * @Table(
 *     name="npm_library",
 *     indexes={
 *         @Index(
 *             name="search_entity_npm_library",
 *             columns={"name", "last_checked"}
 *         )
 *     }
 * )
 */
class EntityNPMLib extends EntityState implements EntityInterface, Cached {
    use TraitCached;
    use FieldID;
    use FieldName;
    use FieldVersionLatest;
    use FieldVersionLocal;
    use FieldLastChecked;

    public const TABLE_NAME      = 'npm_library';
    public const SORT_FIELD_TIME = 'last_checked';

    private const CACHE_KEY_LATEST_VERSION = 'cache_latest_version';

    public function cache_set(string $key): void {
        if ($key === self::CACHE_KEY_LATEST_VERSION) {
            $this->cached_values[$key] = RUN::get_npm_lib_latest_version($this->getName());
        }
    }

    public function cache_needs_inspection() : bool {
        $last_checked = $this->getLastChecked();
        if (DATE::is_different_day($last_checked, DATE::now())) {
            $this->setLastChecked(TIME::now());
            return true;
        }
        return false;
    }

    public function cache_needs_update(bool $trigger_update) : bool {
        if ($this->cache_needs_inspection()) {
            if ($this->getVersionLatest() !== $this->cache_get(self::CACHE_KEY_LATEST_VERSION)) {
                if ($trigger_update) {
                    $this->cache_update(true);
                }
                return true;
            }
            return false;
        }
        return false;
    }

    public function cache_update(bool $update_state=true): void {
        $this->setVersionLatest($this->cache_get(self::CACHE_KEY_LATEST_VERSION));
    }

    public function on_event_born($data): void {
        $latest_version  = RUN::get_npm_lib_latest_version($data);
        PATH::cwd_push(PATH::get(PATH::NODE_DIR));
        $current_version = RUN::get_npm_lib_version_local($data);
        PATH::cwd_pop();
        $this->setName($data);
        $this->setVersionLocal($current_version);
        $this->setVersionLatest($latest_version);
        $this->cache_update(false);
    }

}
