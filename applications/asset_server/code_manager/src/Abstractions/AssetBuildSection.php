<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\EntityFileRepoService;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


abstract class AssetBuildSection extends BuildSection {

    /** @var string */
    protected $directory_output;
    /** @var string */
    protected $directory_data;
    /** @var array */
    protected $files;
    /** @var array */
    protected $file_builds = [];
    /** @var EntityFileRepoService */
    protected $repo_entity_files;
    /** @var EntityFile */
    protected $last_file;
    /** @var boolean */
    protected $is_enabled_minification;

    public function __construct(string $name, CodeBuilderService $code_builder, bool $is_enabled_minification) {
        parent::__construct($name, $code_builder);
        $this->is_enabled_minification = $is_enabled_minification;
        $this->repo_entity_files       = $code_builder->get_repo(CodeBuilderService::ENTITY_REPOSITORY_FILES);
    }

    public function run_section_build() : void {
        foreach ($this->file_builds as $file => $flags) {

            if (!$this->repo_entity_files->has_entity($file)) {
                $f = $this->create_entity_from_value($file);
            } else {
                $f = $this->process_entity($this->repo_entity_files->get_entity($file));
            }

            if ($this->has_flag_processed($flags)) {
                $this->last_file = $this->handle_step_processed($f, $flags[1]);
            }
            if ($this->has_flag_minified($flags)) {
                $this->last_file = $this->handle_step_minification($this->last_file ?? $f);
            }
            if ($this->has_flag_gzipped($flags)) {
                $this->last_file = $this->handle_step_gzipped($this->last_file ?? $f);
            }
        }
    }

    protected function create_entity_from_value($value): EntityInterface {
        return $this->repo_entity_files->create_new_entity($value);
    }

    protected function process_entity(EntityInterface $entity) : EntityInterface {
        if ($entity->cache_needs_to_be_checked()) {
            if ($entity->cache_needs_to_be_updated()) {
                $entity->cache_update();
            } else {
                $entity->cache_set_to_checked();
            }
        }
        return $entity;
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

    protected function handle_step_minification(EntityFile $file): ?EntityFile {
        if ($this->is_enabled_minification) {
            return $this->repo_entity_files->ensure_file_has_child($file, $this->directory_output . $file->get_full_name_minified(), EntityFile::FLAG_MINIFY);
        }
        return null;
    }

    protected function handle_step_gzipped(EntityFile $file): ?EntityFile {
        return $this->repo_entity_files->ensure_file_has_child($file, $this->directory_output . $file->get_full_name_gzipped(), EntityFile::FLAG_GZIP);
    }

    abstract protected function handle_step_processed(EntityFile $file, string $output_file_path) : ?EntityFile;

    /*        __        ___        ___      ___      ___    __
     |  |\/| |__) |    |__   |\/| |__  |\ |  |   /\   |  | /  \ |\ |
     |  |  | |    |___ |___  |  | |___ | \|  |  /~~\  |  | \__/ | \|*/

    protected function ensure_needed_config_data(array $config): void {
        if (!isset($config['assets'])) {
            DBG::throw_exception_config_file('assets');
        }
        if (!isset($config['assets'][$this->name])) {
            DBG::throw_exception_config_file('assets{' . $this->name . '}');
        }
    }

    protected function set_needed_config_data(array $config): void {
        $data                          = $config['assets'][$this->name];
        $this->directory_output        = $data['output_directory'];
        $this->directory_data          = $data['data_directory'];
        $this->files                   = $data['files'];
        foreach ($this->files as $key => $value) {
            $file_path                     = $this->directory_data . $key;
            $this->file_builds[$file_path] = $value;
        }
    }
}