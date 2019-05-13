<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\AbstractRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Traits\TraitPatternName;
use QuasarSource\Utilities\SimpleTimer;


abstract class BuildSection {
    use TraitPatternName;

    /** @var SimpleTimer */
    protected $build_time;
    /** @var CodeBuilderService */
    protected $code_builder;
    /** @var AbstractRepository */
    protected $repo_service;

    public function __construct(string $name, CodeBuilderService $code_builder) {
        $this->set_name($name);
        $this->build_time   = new SimpleTimer(false);
        $this->code_builder = $code_builder;
        $config             = $code_builder->get_config();
        $this->ensure_needed_config_data($config);
        $this->set_needed_config_data($config);
    }

    public function run_build(): void {
        $this->build_time->start();
        $this->code_builder->log('--- Build Start {' . $this->name . '} ---');
        $this->run_section_build();
        $this->build_time->stop();
        $this->code_builder->log('--- Build Completed {' . $this->name . '} in {' . $this->build_time->get_delta() . '}---');
    }

    protected function process_files_by_value(array $files_to_process): ?EntityInterface {
        foreach ($files_to_process as $file_value) {
            if (!$this->repo_service->has_entity($file_value)) {
                return $this->create_entity_from_value($file_value);
            }
            return $this->process_entity($this->repo_service->get_entity($file_value));
        }
        return null;
    }

    abstract protected function ensure_needed_config_data(array $config): void;

    abstract protected function set_needed_config_data(array $config): void;

    abstract protected function run_section_build(): void;

    abstract protected function create_entity_from_value($value): EntityInterface;

    abstract protected function process_entity(EntityInterface $entity);
}