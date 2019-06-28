<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\AssetBuildSection;
use QuasarSource\Enums\EnumFileTypeExtensions as EXTENSION;

/**
 * Class CSSBuildSection
 * @package QuasarSource\BuildProcess
 */
class CSSBuildSection extends AssetBuildSection {

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(EXTENSION::CSS, $code_builder);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        return null;
    }

}
