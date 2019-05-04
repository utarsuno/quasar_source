<?php


namespace CodeManager\Abstractions;


use CodeManager\Entity\EntityFile;
use CodeManager\Service\EntityFileRepoService;
use QuasarSource\Utilities\SimpleTimer;

class CSSBuildSection extends AssetBuildSection {

    public function __construct(array $data) {
        parent::__construct('CSS', $data['data_directory'], $data['output_directory'], $data['files']);
    }

    public function process_build_section(EntityFileRepoService $repo_service): void {
        var_dump('TODO: CSS SECTION!');

        $time_per_file = [];

        foreach ($this->file_builds as $file => $options) {
            $timer       = new SimpleTimer();

            $f           = $repo_service->ensure_file_is_cached($file);
            $flags       = $options['flags'];
            $parent_file = $f;
            $minify_path = $this->directory_output . $f->getName() . '.min' . $f->getExtension();

            if (in_array(EntityFile::FLAG_MINIFY, $flags, true)) {
                $parent_file = $repo_service->ensure_file_has_minified_child($f, $minify_path);
            }

            if (in_array(EntityFile::FLAG_GZIP, $flags, true)) {
                $repo_service->ensure_file_has_gzip_child($parent_file);
            }

            $time_per_file[$file] = strval($timer);
        }
    }
}