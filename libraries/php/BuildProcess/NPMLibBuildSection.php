<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\CodeManager\RepoNPMLib;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\Utilities\Exception\ParameterException;


class NPMLibBuildSection extends BuildSection {

    /** @var RepoNPMLib */
    protected $repo;

    /**
     * NPMLibBuildSection constructor.
     * @param CodeBuilderService $code_builder
     * @throws ParameterException
     */
    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('NPM Libs', $code_builder);
        $this->config_initialize(
            ['npm' => null],
            $code_builder->config_yaml_get_all()
        );
        $this->repo = $this->get_repo(RepoNPMLib::class);
    }

    protected function perform_work(): void {
        foreach ($this->config_yaml_get_all() as $file_value) {
            if (!$this->repo->has_entity($file_value)) {
                $this->repo->create_new_entity($file_value);
            } else {
                $this->process_entity($this->repo->get_entity($file_value));
            }
        }
    }

    protected function on_entity_update(EntityInterface $entity) {
        return $entity;
    }

}

