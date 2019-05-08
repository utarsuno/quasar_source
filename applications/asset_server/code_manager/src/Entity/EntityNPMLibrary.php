<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity;

use CodeManager\Abstractions\EntityInterface;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Utilities\DateTimeUtilities as TIME;
use QuasarSource\Utilities\DateTimeUtilities as DATE;
use QuasarSource\Utilities\Files\PathUtilities as PATH;
use QuasarSource\Utilities\Processes\ProcessUtilities as RUN;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityNPMLibraryRepository")
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
class EntityNPMLibrary implements EntityInterface {

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

    public function ensure_cache_up_to_date(): bool {
        $last_checked = $this->getLastChecked();
        if (DATE::is_different_day($last_checked, DATE::now())) {
            $latest_version = RUN::get_npm_lib_latest_version($this->getName());
            if ($latest_version !== $this->getVersionLatest()) {
                $this->setVersionLatest($latest_version);
                $this->setLastChecked(TIME::now());
                return true;
            }
        }
        return false;
    }

    public function on_event_first_new_creation($data): void {
        $latest_version  = RUN::get_npm_lib_latest_version($data);
        PATH::cwd_push(PATH::NODE_DIRECTORY);
        $current_version = RUN::get_npm_lib_version_local($data);
        PATH::cwd_pop();
        $this->setName($data);
        $this->setLastChecked(TIME::now());
        $this->setVersionLocal($current_version);
        $this->setVersionLatest($latest_version);
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
