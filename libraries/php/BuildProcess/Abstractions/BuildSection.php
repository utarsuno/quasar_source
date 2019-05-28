<?php

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Service\CodeBuilderService;
use Doctrine\Common\Persistence\ObjectRepository;
use QuasarSource\Traits\TraitConfigParams;


abstract class BuildSection extends UnitOfWork {
    use TraitConfigParams;

    /** @var AbstractRepository */
    protected $repo;

    /**
     * BuildSection constructor.
     * @param string $name
     * @param CodeBuilderService $code_builder
     */
    public function __construct(string $name, CodeBuilderService $code_builder) {
        parent::__construct($name, $code_builder);
    }

    protected function get_repo(string $repo_name): ObjectRepository {
        return $this->code_builder->get_repo($repo_name);
    }

    protected function pre_work(): void {}

    abstract protected function perform_work(): void;

    protected function post_work(): void {}

    protected function process_entity(EntityInterface $entity): ?EntityInterface {
        if ($entity->cache_needs_update(true)) {
            $entity->set_state(EntityState::STATE_UPDATED);

        } else {
            $entity->set_state(EntityState::STATE_NO_CHANGE);
        }
        return $entity;
    }

    abstract protected function on_entity_update(EntityInterface $entity);
}