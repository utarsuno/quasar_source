<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class JSONBuildSection extends AssetBuildSection {

    public function __construct(array $data, CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_CSS, $data, $code_builder);
    }

    protected function handle_step_gzipped(EntityFile $file): ?EntityFile {
        return $this->repo_service->ensure_file_has_flagged_child($file, $this->directory_output . $file->get_full_name_gzipped(), EntityFile::FLAG_GZIP);
    }

    protected function handle_step_minification(EntityFile $file): ?EntityFile {
        return null;
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }
}
