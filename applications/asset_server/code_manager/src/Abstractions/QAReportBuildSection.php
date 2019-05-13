<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityQAReportRepository;
use CodeManager\Service\CodeBuilderService;
use DateTime;
use QuasarSource\Utilities\DateTimeUtilities as DATE;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


class QAReportBuildSection extends BuildSection {

    /** @var EntityQAReportRepository */
    protected $repo;
    /** @var EntityFileRepository */
    protected $repo_files;
    /** @var array */
    protected $stats;
    /** @var array */
    protected $unit_tests;
    /** @var DateTime */
    protected $time_of_build;

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct('QA Report', $code_builder);
        $this->repo          = $code_builder->get_repo(CodeBuilderService::ENTITY_REPOSITORY_QA_REPORT);
        $this->repo_files    = $code_builder->get_repo(CodeBuilderService::ENTITY_REPOSITORY_FILES);
        $this->time_of_build = DATE::now();
    }

    protected function run_section_build() : void {
        foreach ($this->stats as $stat => $file_path) {
            if (!$this->repo_files->has_entity($file_path)) {
                $entity_file = $this->repo_files->create_entity_from_value($file_path);
                $this->create_entity_from_value($entity_file);
            } else {
                $this->process_entity($this->repo_files->get_entity($file_path));
            }
        }
    }

    protected function create_entity_from_value($value): EntityInterface {
        return $this->repo->create_new_entity($value);
    }

    protected function process_entity(EntityInterface $entity) : ?EntityInterface {
        if ($entity->cache_needs_to_be_checked()) {
            if ($entity->cache_needs_to_be_updated()) {
                $entity->cache_update();
                return $this->create_entity_from_value($entity);
            }
            $entity->cache_set_to_checked();
        }
        return $entity;
    }

    /*        __        ___        ___      ___      ___    __
     |  |\/| |__) |    |__   |\/| |__  |\ |  |   /\   |  | /  \ |\ |
     |  |  | |    |___ |___  |  | |___ | \|  |  /~~\  |  | \__/ | \|*/

    protected function ensure_needed_config_data(array $config): void {
        if (!isset($config['qa_report'])) {
            DBG::throw_exception_config_file('qa_report');
        }
        if (!isset($config['qa_report']['stats'])) {
            DBG::throw_exception_config_file('qa_report{stats}');
        }
        if (!isset($config['qa_report']['stats']['unit_tests'])) {
            DBG::throw_exception_config_file('qa_report{stats}{unit_tests}');
        }
    }

    protected function set_needed_config_data(array $config): void {
        $this->stats      = $config['qa_report']['stats'];
        $this->unit_tests = $this->stats['unit_tests'];
    }

}

