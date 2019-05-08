<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\EntityFileRepoService;
use QuasarSource\Utilities\SimpleTimer;


abstract class AssetBuildSection extends BuildSection {

    /** @var string */
    protected $directory_output;
    /** @var string */
    protected $directory_data;
    /** @var array */
    protected $files;
    /** @var array */
    protected $file_builds      = [];
    /** @var array */
    protected $file_build_times = [];
    /** @var EntityFileRepoService */
    protected $repo_service;
    /** @var EntityFile */
    protected $last_file;

    public function __construct(string $name, array $data, CodeBuilderService $code_builder) {
        parent::__construct($name, $data, $code_builder);
        $this->repo_service     = $code_builder->get_service_repo_files();
        $this->directory_output = $data['output_directory'];
        $this->directory_data   = $data['data_directory'];
        $this->files            = $data['files'];

        foreach ($this->files as $key => $value) {
            $file_path                     = $this->directory_data . $key;
            $this->file_builds[$file_path] = $value;
        }
    }

    public function run_section_build() : void {
        foreach ($this->file_builds as $file => $flags) {
            $build_timer = new SimpleTimer(true);

            $f = $this->repo_service->ensure_file_is_cached($file);

            if ($this->has_flag_processed($flags)) {
                $this->last_file = $this->handle_step_processed($f, $flags[1]);
            }

            if ($this->has_flag_minified($flags)) {
                if ($this->last_file === null) {
                    $this->last_file = $this->handle_step_minification($f);
                } else {
                    $this->last_file = $this->handle_step_minification($this->last_file);
                }
            }

            if ($this->has_flag_gzipped($flags)) {
                if ($this->last_file === null) {
                    $this->last_file = $this->handle_step_gzipped($f);
                } else {
                    $this->last_file = $this->handle_step_gzipped($this->last_file);
                }
            }

            $this->file_build_times[$file] = strval($build_timer);
        }
    }

    protected function has_flag_processed(array $flags) : bool {
        return in_array(EntityFile::FLAG_PRE_PROCESS, $flags, true);
    }

    protected function has_flag_minified(array $flags) : bool {
        return in_array(EntityFile::FLAG_MINIFY, $flags, true);
    }

    protected function has_flag_gzipped(array $flags) : bool {
        return in_array(EntityFile::FLAG_GZIP, $flags, true);
    }

    abstract protected function handle_step_minification(EntityFile $file) : ?EntityFile;

    abstract protected function handle_step_processed(EntityFile $file, string $output_file_path) : ?EntityFile;

    abstract protected function handle_step_gzipped(EntityFile $file) : ?EntityFile;
}