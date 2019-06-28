<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\CodeManager\EntityFileRepository;
use CodeManager\Repository\CodeManager\EntityQAReportRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\BuildSection;
use QuasarSource\Utilities\Exception\ParameterException;


class QAReportBuildSection extends BuildSection {

    /** @var EntityFileRepository */
    protected $repo_entity_files;
    /** @var EntityQAReportRepository */
    protected $repo;

    /**
     * QAReportBuildSection constructor.
     * @param CodeBuilderService $code_builder
     * @throws ParameterException
     */
    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('QA Report', $code_builder);
        $this->config_initialize(
            ['stats' => ['unit_tests' => null]],
            $code_builder->config_yaml_get('qa_report')
        );
        $this->repo_entity_files = $this->get_repo(EntityFileRepository::class);
        $this->repo              = $this->get_repo(EntityQAReportRepository::class);
    }

    protected function perform_work() : void {
        foreach ($this->config_yaml_get('stats') as $stat => $file_path) {
            if (!$this->repo_entity_files->has_entity($file_path)) {
                $this->event_qa_entity_file_not_stored_in_db($file_path);
            } else {
                $this->process_entity($this->repo_entity_files->get_entity($file_path));
            }
        }
    }

    protected function on_entity_update(EntityInterface $entity) {
        $this->repo->create_new_entity($entity);
    }

    private function event_qa_entity_file_not_stored_in_db(string $file_path): void {
        $entity_file = $this->repo_entity_files->create_new_entity($file_path);
        $this->repo->create_new_entity($entity_file);
    }

}

