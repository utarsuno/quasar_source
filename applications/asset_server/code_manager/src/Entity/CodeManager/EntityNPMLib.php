<?php declare(strict_types=1);
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
use CodeManager\Entity\Abstractions\Traits\Text\FieldTextThree;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\Utilities\File\UtilsPath       as PATH;
use QuasarSource\Utilities\Process\UtilsProcess as RUN;


/**
 * Class EntityNPMLib
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityNPMLibRepository")
 * @Table(name="_Code_Manager___Entity___Code_Manager___Entity_N_P_M_Lib")
 */
class EntityNPMLib extends EntityState implements EntityInterface, CacheTableInterface {
    use TraitCacheTable;
    use FieldID;
    // Name, VersionLatest, VersionLocal.
    use FieldTextThree;
    // Represents the last time it was checked.
    use FieldUnixTime;

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
