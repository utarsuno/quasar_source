<?php

namespace CodeManager\Abstractions;
use CodeManager\Repository\EntityNPMLibraryRepository;
use CodeManager\Service\CodeBuilderService;
use DateTime;
use Doctrine\ORM\Mapping\Entity;
use QuasarSource\Utilities\DateTimeUtilities as DATE;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


class NPMLibraryBuildSection extends BuildSection {

    /** @var EntityNPMLibraryRepository */
    protected $repo_service;
    /** @var array */
    protected $libs;
    /** @var DateTime */
    protected $time_of_build;

    public function __construct(array $raw_data, CodeBuilderService $code_builder) {
        if (!isset($raw_data['npm'])) {
            DBG::throw_exception_config_file('npm');
        }
        parent::__construct('NPM Libs', $code_builder);
        $this->repo_service  = $code_builder->get_repo_npm_libs();
        $this->libs          = $raw_data['npm'];
        $this->time_of_build = DATE::now();
    }

    protected function run_section_build() : void {
        $this->process_files_by_value($this->libs);
    }

    protected function create_entity_from_value($value): EntityInterface {
        return $this->repo_service->create_new_entity($value);
    }

    protected function process_entity(EntityInterface $entity): void {
        if ($entity->cache_needs_to_be_checked()) {
            if ($entity->cache_needs_to_be_updated()) {
                $entity->cache_update();
            } else {
                $entity->cache_set_to_checked();
            }
        }
    }

}

