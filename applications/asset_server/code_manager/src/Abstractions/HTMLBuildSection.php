<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;
use QuasarSource\Utilities\Files\PathUtilities           as PATH;
use QuasarSource\Utilities\StringUtilities               as STR;


class HTMLBuildSection extends AssetBuildSection {

    private const PRE_PROCESS = '#pre-process-replace-style{';

    public function __construct(array $data, CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_HTML, $data, $code_builder);
    }

    protected function handle_step_minification(EntityFile $file): ?EntityFile {
        return $this->repo_service->ensure_file_has_flagged_child($file, $this->directory_output . $file->get_full_name_minified(), EntityFile::FLAG_MINIFY);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        if ($this->repo_service->does_child_file_exist_as_needed($file, $output_file_path)) {
            return null;
        }

        $file_path       = $file->getFullPath();
        $processed_lines = [];
        $lines           = UFO::get_contents_as_list($file_path);
        foreach ($lines as $line) {
            if (STR::contains($line, '/*' . self::PRE_PROCESS)) {
                $css_file_name = STR::get_matches_removed(trim($line), ['/*', '}*/', '<style>', '</style>', self::PRE_PROCESS]);
                $modified_line = STR::get_matches_removed($line, ['/*', '}*/', self::PRE_PROCESS]);

                if ($this->repo_service->has_checked_file_by_path($css_file_name)) {
                    $contents = UFO::get_contents_as_list($css_file_name);

                    if (count($contents) > 1) {
                        DBG::throw_exception('File{' . $css_file_name . '} has more than 1 line of code!');
                    } else if (count($contents) === 0) {
                        DBG::throw_exception('File{' . $css_file_name . '} has no contents!');
                    }
                    $contents = $contents[0];

                    $modified_line = STR::replace($modified_line, $css_file_name, $contents);
                } else {
                    DBG::throw_exception('Needed pre-process file not found in memory {' . $css_file_name . '}');
                }
                $processed_lines[] = $modified_line;
            } else {
                $processed_lines[] = $line;
            }
        }

        $path_processed = $this->directory_output . STR::replace(PATH::get_file_full_name($file_path), UFO::EXTENSION_HTML, '.processed' . UFO::EXTENSION_HTML);
        UFO::create_or_overwrite_file($path_processed, implode($processed_lines));

        $options                               = $file->get_flags();
        $options[EntityFile::FLAG_PRE_PROCESS] = true;

        return $this->repo_service->create_processed_child($file, $path_processed, EntityFile::TYPE_HTML, $options);
    }

    protected function handle_step_gzipped(EntityFile $file): ?EntityFile {
        return $this->repo_service->ensure_file_has_flagged_child($file, $this->directory_output . $file->get_full_name_gzipped(), EntityFile::FLAG_GZIP);
    }
}

