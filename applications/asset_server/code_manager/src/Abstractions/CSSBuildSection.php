<?php

namespace CodeManager\Abstractions;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class CSSBuildSection extends AssetBuildSection {

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_CSS, $code_builder, true);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }

}
