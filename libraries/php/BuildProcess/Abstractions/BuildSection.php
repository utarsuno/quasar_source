<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\Feature\Repository\OwnsReposInterface;
use Doctrine\Common\Persistence\ObjectRepository;
use CodeManager\Service\Feature\Config\FeatureConfigUniversalInterface;
use CodeManager\Service\Feature\Config\FeatureConfigYAMLTrait;

/**
 * Class BuildSection
 * @package QuasarSource\BuildProcess\Abstractions
 */
abstract class BuildSection extends UnitOfWork implements OwnsReposInterface, FeatureConfigUniversalInterface {
    use FeatureConfigYAMLTrait;

    /** @var AbstractRepository */
    protected $repo;

    /** @var CodeBuilderService */
    protected $code_builder;

    /**
     * @param string $name
     * @param CodeBuilderService $code_builder
     */
    public function __construct(string $name, CodeBuilderService $code_builder) {
        parent::__construct($name, $code_builder->service_get_logger());
        $this->code_builder = $code_builder;
    }

    /**
     * @param  string $repo_name
     * @return ObjectRepository
     */
    public function get_repo(string $repo_name): ObjectRepository {
        return $this->code_builder->get_repo($repo_name);
    }

    protected function process_entity(EntityInterface $entity): ?EntityInterface {
        if ($entity->cache_needs_update(true)) {
            $entity->set_state(EntityState::STATE_UPDATED);

        } else {
            $entity->set_state(EntityState::STATE_NO_CHANGE);
        }
        return $entity;
    }

    abstract protected function on_entity_update(EntityInterface $entity);

    /**
     * @param  string $key
     * @return mixed
     */
    public function config_universal_get(string $key) {
        return $this->code_builder->config_universal_get($key);
    }
}

