<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Enum\ProjectParameterKeys\Path   as PATHS;
use CodeManager\Enum\ProjectParameterKeys\Schema as SCHEMAS;
use CodeManager\Repository\CodeManager\EntityFileRepository;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Exception\ParameterException;

/**
 * Class AssetBuildSection
 * @package QuasarSource\BuildProcess\Abstractions
 */
abstract class AssetBuildSection extends BuildSection {

    /** @var EntityFileRepository */
    protected $repo_entity_files;
    /** @var array */
    protected $file_builds = [];

    /**
     * @param  string $name
     * @param  CodeBuilderService $code_builder
     * @throws ParameterException
     */
    public function __construct(string $name, CodeBuilderService $code_builder) {
        parent::__construct($name, $code_builder);
        $this->config_yaml_set_data(
            $this->config_universal_get(SCHEMAS::YAML_ASSETS), $code_builder->config_yaml_get(['assets', $name])
        );

        $this->repo_entity_files = $this->get_repo(EntityFileRepository::class);
        $directory_data          = $this->config_yaml_get(PATHS::DIRECTORY_DATA);
        foreach ($this->config_yaml_get('files') as $k => $v) {
            $this->file_builds[$directory_data . $k] = $v;
        }
    }

    private function parse_file(string $file, array $flags) {
        if ($this->repo_entity_files->has_entity($file)) {
            $f = $this->process_entity($this->repo_entity_files->get_entity($file));
        } else {
            $f = $this->repo_entity_files->create_new_entity($file);
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
        return \in_array(EntityFile::FLAG_PRE_PROCESS, $flags, true);
    }

    protected function has_flag_minified(array $flags) : bool {
        return \in_array(EntityFile::FLAG_MINIFY, $flags, true);
    }

    protected function has_flag_gzipped(array $flags) : bool {
        return \in_array(EntityFile::FLAG_GZIP, $flags, true);
    }

    protected function get_path_output(): string {
        return $this->config_yaml_get(PATHS::DIRECTORY_OUTPUT);
    }

    abstract protected function handle_step_processed(EntityFile $file, string $output_file_path) : ?EntityFile;

    protected function pre_work(): void {

    }

    protected function post_work(): void {

    }
}
