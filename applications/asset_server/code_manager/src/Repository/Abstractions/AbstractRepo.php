<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\OptimisticLockException;
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

    public function get_entity($search_value): ?EntityInterface {
        return $this->findOneBy([$this->default_search_attribute => $search_value]);
    }

    public function has_entity($search_value): bool {
        return $this->get_entity($search_value) !== null;
    }

    public function get_all_entities(): array {
        return $this->findAll();
    }

    public function create_new_entity($value, bool $save=true): EntityInterface {
        /** @var EntityInterface $entity */
        $entity = new $this->entity_class();
        $entity->on_event_born($value);
        $entity->set_state(EntityState::STATE_CREATED);
        if ($save) {
            $this->save_entity($entity, true);
        }
        return $entity;
    }

    /**
     * @param  mixed $entity
     * @param  bool  $save_db_state
     * @throws ExceptionDB
     */
    public function remove_entity($entity, bool $save_db_state=false): void {
        #$this->event_before_remove_entity($entity);
        try {
            $this->em->remove($entity);
        } catch (ORMException $e) {
            throw ExceptionDB::doctrine_error($e->getMessage());
        }
        if ($save_db_state) {
            $this->flush();
        }
    }

    /**
     * @param  mixed $entity
     * @param  bool  $save_db_state
     * @throws ExceptionDB
     */
    public function save_entity($entity, bool $save_db_state=false): void {
        try {
            $this->em->persist($entity);
        } catch (ORMException $e) {
            throw ExceptionDB::doctrine_error($e->getMessage());
        }
        if ($save_db_state) {
            $this->flush();
        }
    }

    /**
     * @throws ExceptionDB
     */
    protected function flush(): void {
        try {
            $this->em->flush();
        } catch (OptimisticLockException $e) {
            throw ExceptionDB::doctrine_error($e->getMessage());
        } catch (ORMException $e) {
            throw ExceptionDB::doctrine_error($e->getMessage());
        }
    }

}
