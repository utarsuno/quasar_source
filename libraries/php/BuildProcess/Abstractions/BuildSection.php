<?php

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
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

    abstract protected function process_entity(EntityInterface $entity);
}