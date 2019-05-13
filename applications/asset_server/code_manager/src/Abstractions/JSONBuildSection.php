<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class JSONBuildSection extends AssetBuildSection {

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_JSON, $code_builder, false);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }
}
