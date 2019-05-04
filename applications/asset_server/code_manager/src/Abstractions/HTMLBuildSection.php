<?php


namespace CodeManager\Abstractions;


use CodeManager\Service\EntityFileRepoService;

class HTMLBuildSection extends AssetBuildSection {

    public function __construct(array $data) {
        parent::__construct('HTML', $data['data_directory'], $data['output_directory'], $data['files']);
    }

    protected function process_build_section(EntityFileRepoService $repo_service): void {
        var_dump('TODO: HTML SECTION!');
    }
}