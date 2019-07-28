<?php declare(strict_types=1);

namespace QuasarSource\BuildProcess;
use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\BuildProcess\Abstractions\AssetBuildSection;
use QuasarSource\Utils\File\UtilsFile             as UFO;
use QuasarSource\Utils\DataType\UtilsString       as STR;
use QuasarSource\Utils\File\Enum\EnumFileTypeExtensions     as EXTENSION;

class HTMLBuildSection extends AssetBuildSection {

    private const PRE_PROCESS                  = '#pre-process-';
    private const PRE_PROCESS_CSS              = self::PRE_PROCESS . 'style{';

    private const PATTERN_CSS                  = '/*' . self::PRE_PROCESS_CSS;
    private const PATTERN_SUB_CSS_FILE_NAME    = ['/*', '}*/', '<style>', '</style>', self::PRE_PROCESS_CSS];
    private const PATTERN_SUB_CSS_FILE_LINE    = ['/*', '}*/', self::PRE_PROCESS_CSS];

    private const PATTERN_MANIFEST             = '/*' . self::PRE_PROCESS . 'manifest';
    private const PATTERN_SUB_MANIFEST_REPLACE = '/*#pre-process-manifest{default}*/';

    private const RAW_WEB_MANIFEST             = [
        'name'             => 'QuasarSource',
        'short_name'       => 'QS',
        'lang'             => 'en',
        'description'      => 'QuasarSource in development.',
        'display'          => 'fullscreen',
        'orientation'      => 'landscape',
        #'theme_color'      => '#6fff9a',
        #'background_color' => '#3a3a3a',
        'start_url'        => '/',
        #'icons'            => [
        #    'src'   => '/p2.png',
        #    'sizes' => '64x64',
        #    'type'  => 'image/png'
        #]
    ];

    /** @var string */
    private $web_manifest_default;

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct(EXTENSION::HTML, $code_builder);
        $this->web_manifest_default = 'data:application/manifest+json,' . json_encode(self::RAW_WEB_MANIFEST);
    }

    protected function handle_step_processed(EntityFile $file, string $output_file_path): ?EntityFile {
        $file_path       = $file->getFullPath();
        $processed_lines = [];
        $lines           = UFO::get($file_path);
        foreach ($lines as $line) {
            if (STR::has($line, self::PATTERN_CSS)) {
                $this->process_line_css($line, $processed_lines);
            } else if (STR::has($line, self::PATTERN_MANIFEST)) {
                $this->process_line_manifest($line, $processed_lines);
            } else {
                $processed_lines[] = $line;
            }
        }

        $path_processed = $this->get_path_output() . $file->get_full_name_processed();
        UFO::set($path_processed, $processed_lines);
        return $this->repo_entity_files->ensure_file_has_child($file, $path_processed, EntityFile::FLAG_PRE_PROCESS);
    }

    private function process_line_css(string $line, array & $processed_lines): void {
        $css_file_name     = STR::remove(trim($line), self::PATTERN_SUB_CSS_FILE_NAME);
        #if (!$this->repo_entity_files->has_checked_file_by_path($css_file_name)) {
        #    DBG::throw_exception('Needed pre-process file not found in memory {' . $css_file_name . '}');
        #}
        $modified_line     = STR::remove($line, self::PATTERN_SUB_CSS_FILE_LINE);
        #$processed_lines[] = STR::replace($modified_line, $css_file_name, CSS::get($css_file_name));
    }

    private function process_line_manifest(string $line, array & $processed_lines): void {
        $processed_lines[] = STR::replace($line, self::PATTERN_SUB_MANIFEST_REPLACE, $this->web_manifest_default);
    }

}

