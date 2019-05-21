<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use DateTime;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
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
     * @var string
     * @Column(name="version_local", type="string", nullable=false, unique=false)
     */
    private $version_local;

    /**
     * @var string
     * @Column(name="version_latest", type="string", nullable=false, unique=false)
     */
    private $version_latest;

    /**
     * @var DateTime
     * @Column(name="last_checked", type="datetime", nullable=false, unique=false)
     */
    private $last_checked;

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
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getVersionLocal(): string {
        return $this->version_local;
    }

    /**
     * @param string $version_local
     */
    public function setVersionLocal(string $version_local): void {
        $this->version_local = $version_local;
    }

    /**
     * @return string
     */
    public function getVersionLatest(): string {
        return $this->version_latest;
    }

    /**
     * @param string $version_latest
     */
    public function setVersionLatest(string $version_latest): void {
        $this->version_latest = $version_latest;
    }

    /**
     * @return DateTime
     */
    public function getLastChecked(): DateTime {
        return $this->last_checked;
    }

    /**
     * @param DateTime $last_checked
     */
    public function setLastChecked(DateTime $last_checked): void {
        $this->last_checked = $last_checked;
    }
}
