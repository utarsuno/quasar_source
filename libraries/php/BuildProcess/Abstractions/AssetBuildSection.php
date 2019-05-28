<?php

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Exceptions\ExceptionInvalidConfigurationFile;


abstract class AssetBuildSection extends BuildSection {

    public const CONFIG_KEY_DIR_OUTPUT = 'output_directory';
    public const CONFIG_KEY_DIR_DATA   = 'data_directory';

    /** @var EntityFileRepository */
    protected $repo_entity_files;
    /** @var array */
    protected $file_builds = [];

    /**
     * AssetBuildSection constructor.
     * @param string $name
     * @param CodeBuilderService $code_builder
     * @throws ExceptionInvalidConfigurationFile
     */
    public function __construct(string $name, CodeBuilderService $code_builder) {
        parent::__construct($name, $code_builder);
        $this->config_initialize(
            [self::CONFIG_KEY_DIR_OUTPUT => null, self::CONFIG_KEY_DIR_DATA => null, 'files' => null],
            $code_builder->config_get(['assets', $name])
        );
        $this->repo_entity_files = $this->get_repo(EntityFileRepository::class);
        $directory_data          = $this->config_get(self::CONFIG_KEY_DIR_DATA);
        foreach ($this->config_get('files') as $k => $v) {
            $this->file_builds[$directory_data . $k] = $v;
        }
    }

    private function parse_file(string $file, array $flags) {
        if (!$this->repo_entity_files->has_entity($file)) {
            $f = $this->repo_entity_files->create_new_entity($file);
        } else {
            $f = $this->process_entity($this->repo_entity_files->get_entity($file));
        }

        if ($this->has_flag_processed($flags)) {
            $result = $this->handle_step_processed($f, $flags[1]);
            $f      = $result ?? $f;
        }
        if ($this->has_flag_minified($flags)) {
            $f = $this->repo_entity_files->ensure_file_has_child($f, $this->get_path_output() . $f->get_full_name_minified(), EntityFile::FLAG_MINIFY);
        }
        if ($this->has_flag_gzipped($flags)) {
            $f = $this->repo_entity_files->ensure_file_has_child($f, $this->get_path_output() . $f->get_full_name_gzipped(), EntityFile::FLAG_GZIP);
        }
    }

    public function perform_work() : void {
        foreach ($this->file_builds as $file => $flags) {
            $this->parse_file($file, $flags);
        }
    }

    protected function on_entity_update(EntityInterface $entity) {
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

    protected function get_path_output(): string {
        return $this->config_get(self::CONFIG_KEY_DIR_OUTPUT);
    }

    abstract protected function handle_step_processed(EntityFile $file, string $output_file_path) : ?EntityFile;
}
