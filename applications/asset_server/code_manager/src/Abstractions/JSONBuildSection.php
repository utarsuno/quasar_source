<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class JSONBuildSection extends AssetBuildSection {

    public function __construct(array $raw_data, CodeBuilderService $code_builder) {
        $this->ensure_config_file_data($raw_data, UFO::EXTENSION_JSON);
        parent::__construct(UFO::EXTENSION_JSON, $raw_data['assets'][UFO::EXTENSION_JSON], $code_builder);
        $this->is_enabled_minification = false;
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }
}
