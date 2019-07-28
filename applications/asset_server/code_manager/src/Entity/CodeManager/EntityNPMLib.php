<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextThree;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\Utils\File\UtilsPath       as PATH;
use QuasarSource\Utils\Process\UtilsProcess as RUN;

/**
 * Class EntityNPMLib
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoNPMLib")
 * @Table(name="npm_lib")
 */
class EntityNPMLib extends AbstractEntity implements CacheTableInterface {
    use TraitCacheTable;
    // Name, VersionLatest, VersionLocal.
    use FieldTextThree;
    // Represents the last time it was checked.
    use TraitUnixTime0;

    /** @var string $db_table_name */
    public static $db_table_name = 'npm_lib';

    private const CACHE_KEY_LATEST_VERSION = 'cache_latest_version';

    public function cache_calculate(string $key) {
        if ($key === self::CACHE_KEY_LATEST_VERSION) {
            return RUN::get_npm_lib_latest_version($this->getName());
        }
        return null;
    }

    public function cache_needs_inspection() : bool {
        $last_checked = $this->getUnixTimestamp();
        var_dump('Last checked is {' . $last_checked . '}');


        #if (DATE::is_different_day($last_checked, DATE::now())) {
        #    $this->setLastChecked(TIME::now());
        #    return true;
        #}
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
        PATH::cwd_push(\CodeManager\Enum\ProjectParameterKeys\Path::DIRECTORY_NODE);
        $current_version = RUN::get_npm_lib_version_local($data);
        PATH::cwd_pop();
        $this->setName($data);
        $this->setVersionLocal($current_version);
        $this->setVersionLatest($latest_version);
        $this->cache_update(false);
    }

}
