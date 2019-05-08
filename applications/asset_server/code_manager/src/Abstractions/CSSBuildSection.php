<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class CSSBuildSection extends AssetBuildSection {

    public function __construct(array $raw_data, CodeBuilderService $code_builder) {
        $this->ensure_config_file_data($raw_data, UFO::EXTENSION_CSS);
        parent::__construct(UFO::EXTENSION_CSS, $raw_data['assets'][UFO::EXTENSION_CSS], $code_builder);
        $this->is_enabled_minification = true;
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }

}
