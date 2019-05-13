<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;
use QuasarSource\Utilities\Files\PathUtilities           as PATH;
use QuasarSource\Utilities\StringUtilities               as STR;


class HTMLBuildSection extends AssetBuildSection {

    private const PRE_PROCESS       = '#pre-process-replace-style{';
    private const PATTERN_MATCH     = '/*' . self::PRE_PROCESS;
    private const PATTERN_FILE_NAME = ['/*', '}*/', '<style>', '</style>', self::PRE_PROCESS];
    private const PATTERN_FILE_LINE = ['/*', '}*/', self::PRE_PROCESS];

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_HTML, $code_builder, true);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        if ($this->repo_entity_files->does_child_file_exist_as_needed($file, $output_file_path)) {
            return null;
        }

        $file_path       = $file->getFullPath();
        $processed_lines = [];
        $lines           = UFO::get_contents_as_list($file_path);
        foreach ($lines as $line) {
            if (STR::contains($line, self::PATTERN_MATCH)) {
                $css_file_name     = STR::get_matches_removed(trim($line), self::PATTERN_FILE_NAME);
                if (!$this->repo_entity_files->has_checked_file_by_path($css_file_name)) {
                    DBG::throw_exception('Needed pre-process file not found in memory {' . $css_file_name . '}');
                }
                $modified_line     = STR::get_matches_removed($line, self::PATTERN_FILE_LINE);
                $processed_lines[] = STR::replace($modified_line, $css_file_name, UFO::get_css_minified_contents($css_file_name));
            } else {
                $processed_lines[] = $line;
            }
        }

        $path_processed = $this->directory_output . STR::replace(PATH::get_file_full_name($file_path), UFO::EXTENSION_HTML, '.processed' . UFO::EXTENSION_HTML);
        UFO::create_or_overwrite_file($path_processed, implode($processed_lines));

        return $this->repo_entity_files->ensure_file_has_child($file, $path_processed, EntityFile::FLAG_PRE_PROCESS);
    }

}

