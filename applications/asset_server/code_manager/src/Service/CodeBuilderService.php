<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;


use CodeManager\Entity\EntityFile;
use CodeManager\Exceptions\ExceptionInvalidConfigurationFile;
use Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\SimpleTimer;


class CodeBuilderService extends BaseAbstractService {

    private const BUILD_STEP_MINIFY = 'minify';
    private const BUILD_STEP_GZIP   = 'gzip';

    // TODO: Get rid of hard-coded paths.
    private const PATH_CONFIG_FILE  = '/quasar_source/configs/code_manager.yml';

    private const KEY_HEADER_ASSETS      = 'assets';
    private const KEY_SECTION_ASSETS_CSS = 'css';

    private const KEY_HEADER_QA_REPORT = 'qa_report';
    private const KEY_HEADER_PROJECTS  = 'projects';

    private const DIRECTORY_ASSETS_CSS = '/quasar_source/assets/css/';

    private const ALL_HEADER_KEYS = [
        self::KEY_HEADER_ASSETS,
        self::KEY_HEADER_PROJECTS,
        self::KEY_HEADER_QA_REPORT
    ];

    private const ALL_ASSET_SECTIONS = [
        self::KEY_SECTION_ASSETS_CSS
    ];

    private $css_builds = [];
    private $loaded     = false;
    /** @var EntityFileRepoService */
    private $service_repo_files;

    private $config;
    private $config_assets;
    private $config_assets_css;

    public function __construct(LoggerInterface $logger) {
        parent::__construct($logger);
    }

    public function generate_qa_report() : void {

    }

    /**
     * @throws ExceptionInvalidConfigurationFile
     * @throws Exception
     */
    private function ensure_config_data_loaded() : void {
        if (!$this->loaded) {
            $this->config = UFO::get_yaml_contents(self::PATH_CONFIG_FILE);
            $this->loaded = true;

            // Ensure all major configuration sections provided.
            foreach (self::ALL_HEADER_KEYS as $key) {
                if (!array_key_exists($key, $this->config)) {
                    $this->raise_config_file_error($key);
                }
            }
            $this->config_assets = $this->config[self::KEY_HEADER_ASSETS];

            // Ensure all asset sections provided.
            foreach (self::ALL_ASSET_SECTIONS as $key) {
                if (!array_key_exists($key, $this->config_assets)) {
                    $this->raise_config_file_error($key);
                }
            }
            $this->config_assets_css = $this->config_assets[self::KEY_SECTION_ASSETS_CSS];
        }
    }

    /**
     * @param string $missing_section
     * @throws ExceptionInvalidConfigurationFile
     */
    private function raise_config_file_error(string $missing_section) : void {
        throw new ExceptionInvalidConfigurationFile("Section{$missing_section} missing from code_manager.yml");
    }

    public function run_code_health_check() : void {
        /*
        $this->ensure_config_data_loaded();
        $this->process_assets_css($this->config_assets_css['files'], $this->config_assets_css['output_directory']);

        $all_db_files = $this->service_repo_files->get_all_entity_files();

        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {
                var_dump($entity_file->to_full_string());
            }
        }*/

        $qa_results = UFO::get_xml_contents('/quasar_source/applications/asset_server/code_manager/report.xml', true);
        var_dump($qa_results);
    }

    public function set_service_repo_files(EntityFileRepoService $repo_files) : void {
        $this->service_repo_files = $repo_files;
    }

    private function process_assets_css(array $files, string $output_directory) : void {
        foreach ($files as $key => $value) {
            $file_path                    = self::DIRECTORY_ASSETS_CSS . $key . '.css';
            $this->css_builds[$file_path] = $value;
        }

        $time_per_file = [];

        foreach ($this->css_builds as $file => $options) {
            $timer       = new SimpleTimer();

            $f           = $this->service_repo_files->ensure_file_is_cached($file, EntityFile::FILE_TYPE_CSS);
            $actions     = $options['actions'];
            $parent_file = $f;
            $minify_path = $output_directory . $f->getName() . '.min' . $f->getExtension();

            if (in_array(self::BUILD_STEP_MINIFY, $actions, true)) {
                $parent_file = $this->service_repo_files->ensure_file_has_minified_child($f, $minify_path);
            }

            if (in_array(self::BUILD_STEP_GZIP, $actions, true)) {
                $this->service_repo_files->ensure_file_has_gzip_child($parent_file);
            }

            $time_per_file[$file] = strval($timer);
        }


    }



}

