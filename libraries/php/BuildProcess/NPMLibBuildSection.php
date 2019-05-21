<?php

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Repository\EntityNPMLibRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;


class NPMLibBuildSection extends BuildSection {

    /** @var EntityNPMLibRepository */
    protected $repo;

    /**
     * NPMLibBuildSection constructor.
     * @param CodeBuilderService $code_builder
     * @throws ExceptionInvalidConfigurationFile
     */
    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('NPM Libs', $code_builder);
        $this->config_initialize(
            ['npm' => null],
            $code_builder->config_get()
        );
        $this->repo = $this->get_repo(EntityNPMLibRepository::class);
    }

    protected function perform_work(): void {
        foreach ($this->config_get() as $file_value) {
            if (!$this->repo->has_entity($file_value)) {
                $this->repo->create_new_entity($file_value);
            } else {
                $this->process_entity($this->repo->get_entity($file_value));
            }
        }
    }

    protected function process_entity(EntityInterface $entity): void {
        if ($entity->cache_needs_update(true)) {
            $entity->set_state(EntityState::STATE_UPDATED);
        } else {
            $entity->set_state(EntityState::STATE_NO_CHANGE);
        }
    }

}

