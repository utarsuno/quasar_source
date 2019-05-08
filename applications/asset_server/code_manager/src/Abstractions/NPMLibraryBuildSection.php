<?php

namespace CodeManager\Abstractions;
use CodeManager\Repository\EntityNPMLibraryRepository;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\EntityNPMLibraryRepoService;
use DateTime;
use QuasarSource\Utilities\DateTimeUtilities as DATE;


class NPMLibraryBuildSection extends BuildSection {

    /** @var EntityNPMLibraryRepository */
    protected $repo_service;
    /** @var array */
    protected $libs;
    /** @var DateTime */
    protected $time_of_build;


    public function __construct(array $data, CodeBuilderService $code_builder) {
        parent::__construct('NPM Libs', $code_builder);
        $this->repo_service  = $code_builder->get_repo_npm_libs();
        $this->libs          = $data;
        $this->time_of_build = DATE::now();
    }

    protected function run_section_build() : void {
        foreach ($this->libs as $lib) {

            $this->repo_service->ensure_db_has_entity($lib);

            $this->repo_service->ensure_db_cache_for_entity_up_to_date($this->repo_service->get_entity($lib));
        }
    }

}

