<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\ORMException;
use QuasarSource\Utils\Exception\ExceptionDB;

/**
 * Class AbstractRepo
 * @package CodeManager\Repository\Abstractions
 */
abstract class AbstractRepo extends EntityRepository {

    public const ENTITY_CLASS = '';

    /** @var EntityManagerInterface $em */
    protected $em;

    /**
     * Initializes a new <tt>EntityRepository</tt>.
     *
     * @param EntityManagerInterface $em    The EntityManager to use.
     * @param ClassMetadata          $class The class descriptor.
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->em = $em;
    }

    /**
     * @return array
     */
    public function get_all(): array {
        return $this->findAll();
    }

    /**
     * @param  bool $auto_save
     * @return AbstractEntity
     */
    public function get_new_entity(bool $auto_save=false): AbstractEntity {
        $entity_class = static::ENTITY_CLASS;
        $entity       = new $entity_class();
        if ($auto_save) {
            $this->save_entity($entity, true);
        }
        return $entity;
    }

    /**
     * @param  string $repo_class
     * @return ObjectRepository
     */
    protected function get_repo(string $repo_class): ObjectRepository {
        return $this->em->getRepository($repo_class);
    }

    /**
     * @param  int $id
     * @return object|null
     */
    protected function get_entity_by_id(int $id) {
        return $this->findOneBy(['id' => $id]);
    }

    protected $default_search_attribute;

    /** @var string $entity_class */
    protected $entity_class;

    public function get_entity($search_value) {
        return $this->findOneBy([$this->default_search_attribute => $search_value]);
    }

    public function has_entity($search_value): bool {
        return $this->get_entity($search_value) !== null;
    }

    /**
     * @param  $value
     * @param  bool $save
     */
    public function create_new_entity($value, bool $save=true) {
        $entity = new $this->entity_class();
        //$entity->on_event_born($value);
        if ($save) {
            $this->save_entity($entity, true);
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
     * @param  mixed $entity
     * @param  bool  $save_db_state
     */
    public function save_entity($entity, bool $save_db_state=false): void {
        $this->em->persist($entity);
        if ($save_db_state) {
            $this->em->flush();
        }
    }

    protected function flush(): void {
        $this->em->flush();
    }

}
