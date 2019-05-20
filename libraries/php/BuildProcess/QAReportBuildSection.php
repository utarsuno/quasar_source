<?php

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityQAReportRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;


class QAReportBuildSection extends BuildSection {

    /** @var EntityFileRepository */
    protected $repo_entity_files;
    /** @var EntityQAReportRepository */
    protected $repo;

    /**
     * QAReportBuildSection constructor.
     * @param CodeBuilderService $code_builder
     * @throws ExceptionInvalidConfigurationFile
     */
    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('QA Report', $code_builder);
        $this->config_initialize(
            ['stats' => ['unit_tests' => null]],
            $code_builder->config_get('qa_report')
        );
        $this->repo_entity_files = $this->get_repo(EntityFileRepository::class);
        $this->repo              = $code_builder->get_repo(EntityQAReportRepository::class);
    }

    protected function perform_work() : void {
        #foreach ($this->stats as $stat => $file_path) {
        foreach ($this->config_get('stats') as $stat => $file_path) {
            if (!$this->repo_entity_files->has_entity($file_path)) {
                $entity_file = $this->repo_entity_files->create_new_entity($file_path);
                $this->repo->create_new_entity($entity_file);
            } else {
                $this->process_entity($this->repo_entity_files->get_entity($file_path));
            }
        }
    }

    protected function process_entity(EntityInterface $entity) : ?EntityInterface {
        if ($entity->cache_needs_to_be_checked()) {
            if ($entity->cache_needs_to_be_updated()) {
                $entity->cache_update();
                return $this->repo->create_new_entity($entity);
            }
            $entity->cache_set_to_checked();
        }
        return $entity;
    }

}

