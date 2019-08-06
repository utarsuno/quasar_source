<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Service\DBService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * Class AbstractRepo
 * @package CodeManager\Repository\Abstractions
 */
abstract class AbstractRepo extends EntityRepository {

    /** @var string $entity_class */
    protected $entity_class;

    /** @var EntityManagerInterface $em */
    protected $em;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    /**
     * @param EntityManagerInterface $em
     * @param ClassMetadata          $class
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->em = $em;
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @return string
     */
    public function get_entity_class(): string {
        return $this->_entityName;
    }

    /**
     * @param  mixed $entity
     * @param  bool  $save_db_state
     */
    public function save($entity, bool $save_db_state=false): void {
        if (is_array($entity)) {
            foreach ($entity as $e) {
                $this->em->persist($e);
            }
        } else {
            $this->em->persist($entity);
        }
        if ($save_db_state) {
            $this->em->flush();
        }
    }

    /**
     * @param  string $find_key
     * @param  mixed  $find_value
     * @param  string $sort_key
     * @return array
     */
    public function findByAscendingBy(string $find_key, $find_value, string $sort_key): array {
        return $this->findBy([$find_key => $find_value], [$sort_key => 'ASC']);
    }

    /**
     * @param  string $find_key
     * @param  mixed  $find_value
     * @param  string $sort_key
     * @return array
     */
    public function findByDescendingBy(string $find_key, $find_value, string $sort_key): array {
        return $this->findBy([$find_key => $find_value], [$sort_key => 'DESC']);
    }

    /**
     * @param  int $id
     * @return object|null
     */
    public function find_by_id(int $id) {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @return array
     */
    public function get_all(): array {
        return $this->findAll();
    }

    protected function flush(): void {
        $this->em->flush();
    }

    # ------------

    /**
     * @param  bool $auto_save
     * @return AbstractEntity
     */
    public function get_new_entity(bool $auto_save=false): AbstractEntity {
        $entity_class = $this->get_entity_class();
        $entity       = new $entity_class();
        if ($auto_save) {
            $this->save($entity, true);
        }
        return $entity;
    }

    /**
     * @param  $value
     * @param  bool $save
     */
    public function create_new_entity($value, bool $save=true) {
        $entity = new $this->entity_class();
        //$entity->on_event_born($value);
        if ($save) {
            $this->save($entity, true);
        }
        return $entity;
    }

    /**
     * @param  mixed $entity
     * @param  bool  $save_db_state
     */
    public function remove_entity($entity, bool $save_db_state=false): void {
        $this->em->remove($entity);
        if ($save_db_state) {
            $this->em->flush();
        }
    }

    /**
     * @param DBService $db_service
     */
    public function set_db_service(DBService $db_service): void {}

}
