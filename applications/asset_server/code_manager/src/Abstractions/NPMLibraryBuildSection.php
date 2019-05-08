<?php

namespace CodeManager\Abstractions;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\EntityNPMLibraryRepoService;
use QuasarSource\Utilities\DateTimeUtilities   as DATE;


class NPMLibraryBuildSection extends BuildSection {

    /** @var EntityNPMLibraryRepoService */
    protected $repo_service;

    /** @var array */
    protected $libs;

    public function __construct(array $data, CodeBuilderService $code_builder) {
        parent::__construct('NPM Libs', $data, $code_builder);
        $this->repo_service = $code_builder->get_service_npm_libs();
        $this->libs         = $data;
    }

    protected function run_section_build() : void {
        $today = DATE::now();

        foreach ($this->libs as $lib) {
            if (!$this->repo_service->has_npm_lib_by_name($lib)) {
                $this->repo_service->cache_create_new($lib);
            } else {
                $npm_lib      = $this->repo_service->get_lib($lib);
                $last_checked = $npm_lib->getLastChecked();

                if (!DATE::is_different_day($last_checked, $today)) {
                    $this->repo_service->check_version_latest($npm_lib);
                }
            }
        }
    }

}

