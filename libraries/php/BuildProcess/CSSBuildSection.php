<?php

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\AssetBuildSection;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class CSSBuildSection extends AssetBuildSection {

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(UFO::EXTENSION_CSS, $code_builder);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }

}
