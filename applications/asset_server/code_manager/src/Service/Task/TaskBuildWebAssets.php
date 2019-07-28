<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Entity\CodeManager\File\EntityFileType;
use CodeManager\Repository\CodeManager\File\RepoDirectory;
use CodeManager\Repository\CodeManager\File\RepoFile;
use CodeManager\Repository\CodeManager\File\RepoFileType;
use Exception;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\DataStructure\Factory\TraitFactoryBuildStep;
use QuasarSource\Utils\Process\UtilsProcess;
use RuntimeException;
use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\File\UtilsPath       as PATH;
use QuasarSource\Utils\File\UtilsFile       as UFO;

/**
 * Class TaskBuildWebAssets
 * @package CodeManager\Service\Task
 */
final class TaskBuildWebAssets {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------
    use TraitEnvironmentVariablesAsFields;
    use TraitFactoryBuildStep;
    # ----------------------------------------------- C O N S T A N T S ------------------------------------------------
    private const PRE_PROCESS                  = '#pre-process-';
    private const PATTERN_MANIFEST             = '/*' . self::PRE_PROCESS . 'manifest';
    private const PATTERN_SUB_MANIFEST_REPLACE = self::PATTERN_MANIFEST . '{default}*/';
    # -------------------------------------------------- F I E L D S ---------------------------------------------------

    /** @var RepoDirectory $repo_directory */
    private $repo_directory;

    /** @var RepoFile $repo_file */
    private $repo_file;

    /** @var RepoFileType $repo_file_type */
    private $repo_file_type;

    private $env_build_css;
    private $env_build_html;
    private $env_path_output;
    private $env_node_file_minifier;

    # --------------------------------------------------- M A G I C ----------------------------------------------------

    /**
     * @param RepoDirectory $repo_directory
     * @param RepoFile      $repo_file
     * @param RepoFileType  $repo_file_type
     */
    public function __construct(RepoDirectory $repo_directory, RepoFile $repo_file, RepoFileType $repo_file_type) {
        $this->repo_directory = $repo_directory;
        $this->repo_file      = $repo_file;
        $this->repo_file_type = $repo_file_type;
        $this->envs_set_as_str([
            'PATH_DIR_BUILD_CSS_DATA'  => 'env_build_css',
            'PATH_DIR_BUILD_HTML_DATA' => 'env_build_html',
            'PATH_BUILD_CSS_OUTPUT'    => 'env_path_output',
            'PATH_NODE_MINIFY_FILE'    => 'env_node_file_minifier'
        ]);
    }

    public function __destruct() {
        $this->trait_destruct_factory_build_step();
        unset($this->repo_file, $this->repo_file_type, $this->repo_directory,
            $this->env_build_css, $this->env_build_html, $this->env_path_output, $this->env_node_file_minifier);
    }

    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @throws Exception
     */
    public function build_step0_task_css(): void {
        $directory = $this->repo_directory->get_real($this->env_build_css);
        /** @var EntityFile $file */
        foreach ($directory->getFiles() as $file) {
            // TODO: Potentially also check that the physical file exists
            $this->repo_file->ensure_file_has_gzipped_child(
                $this->ensure_file_has_minified_child($file), $this->env_path_output
            );
        }
    }

    /**
     * @throws Exception
     */
    public function build_step1_task_html(): void {
        $directory = $this->repo_directory->get_real($this->env_build_html);
        /** @var EntityFile $file */
        foreach ($directory->getFiles() as $file) {
            $this->process_html_file($file);
        }
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------

    /**
     * @param  EntityFile $file
     * @return EntityFile
     */
    protected function ensure_file_has_minified_child(EntityFile $file): EntityFile {
        if (!$file->hasChild()) {
            $needed_type = $this->repo_file_type->get_type_as_minified($file);
            $output_path = $this->env_path_output . STR::replace(PATH::get_file_full_name($file->getFullPath()), $file->getFileTypeString(), $needed_type->getAsString());
            $this->minify($file, $output_path);
            return $this->repo_file->create_new_fully_cached_entity_child($file, $needed_type, $output_path);
        }
        return $file->getChild();
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param EntityFile $file
     */
    private function process_html_file(EntityFile $file): void {
        var_dump('Need to run process for the HTML file {' . $file->getFullPath() . '}');

        $lines = UFO::get($file->getFullPath());
        foreach ($lines as $line) {
            if (STR::has($line, self::PATTERN_MANIFEST)) {
                $processed_lines[] = STR::replace($line, self::PATTERN_SUB_MANIFEST_REPLACE, $this->web_manifest_default);
            }
        }

    }

    /**
     * @param EntityFile $file
     * @param string     $output_path
     */
    private function minify(EntityFile $file, string $output_path): void {
        $file_type       = $file->getFileType();
        $file_type_group = $file_type->getEntityType();
        switch ($file_type_group) {
            case EntityFileType::GROUP_CSS:
            case EntityFileType::GROUP_HTML:
                UtilsProcess::run_cmd(['node', $this->env_node_file_minifier, '-i', $file->getFullPath(), '-o', $output_path]);
                break;
            default:
                throw new RuntimeException('Unable to minify the provided file {' . $file->getFullPath() . '}');
        }
    }

}
