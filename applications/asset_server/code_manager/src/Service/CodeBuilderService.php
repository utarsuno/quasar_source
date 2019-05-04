<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;


use CodeManager\Abstractions\CSSBuildSection;
use CodeManager\Abstractions\HTMLBuildSection;
use CodeManager\Entity\EntityFile;
use CodeManager\Exceptions\ExceptionInvalidConfigurationFile;
use Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\ArrayUtilities      as ARY;
use QuasarSource\Utilities\Files\FileParserXMLQA;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\SimpleTimer;


class CodeBuilderService extends BaseAbstractService {

    // TODO: Get rid of hard-coded paths.
    private const PATH_CONFIG_FILE  = '/quasar_source/configs/code_manager.yml';

    private const KEY_HEADER_ASSETS       = 'assets';
    private const KEY_SECTION_ASSETS_CSS  = 'css';
    private const KEY_SECTION_ASSETS_HTML = 'html';

    private const KEY_HEADER_QA_REPORT = 'qa_report';
    private const KEY_HEADER_PROJECTS  = 'projects';

    private const ALL_HEADER_KEYS = [
        self::KEY_HEADER_ASSETS,
        self::KEY_HEADER_PROJECTS,
        self::KEY_HEADER_QA_REPORT
    ];

    private const ALL_ASSET_SECTIONS = [
        self::KEY_SECTION_ASSETS_CSS,
        self::KEY_SECTION_ASSETS_HTML
    ];

    private $css_builds = [];
    private $loaded     = false;

    /** @var EntityFileRepoService */
    private $service_repo_files;

    /** @var EntityQAReportRepoService */
    private $service_qa_report;

    private $config;
    private $config_assets;

    /** @var CSSBuildSection */
    private $asset_build_css;

    /** @var HTMLBuildSection */
    private $asset_build_html;

    private $config_qa_report;


    public function __construct(LoggerInterface $logger) {
        parent::__construct($logger);
    }

    /**
     * @throws ExceptionInvalidConfigurationFile
     * @throws Exception
     */
    private function ensure_config_data_loaded() : void {
        if (!$this->loaded) {
            $this->config = UFO::get_yaml_contents(self::PATH_CONFIG_FILE);
            $this->loaded = true;
            if (!ARY::has_all_keys_in($this->config, self::ALL_HEADER_KEYS)) {
                $this->raise_config_file_error(json_encode(ARY::get_all_missing_keys_relative_to($this->config, self::ALL_HEADER_KEYS)));
            }
            $this->config_assets = $this->config[self::KEY_HEADER_ASSETS];
            if (!ARY::has_all_keys_in($this->config_assets, self::ALL_ASSET_SECTIONS)) {
                $this->raise_config_file_error(json_encode(ARY::get_all_missing_keys_relative_to($this->config_assets, self::ALL_ASSET_SECTIONS)));
            }
            $this->asset_build_css  = new CSSBuildSection($this->config_assets[self::KEY_SECTION_ASSETS_CSS]);
            $this->asset_build_html = new HTMLBuildSection($this->config_assets[self::KEY_SECTION_ASSETS_HTML]);
            $this->config_qa_report = $this->config[self::KEY_HEADER_QA_REPORT]['stats'];
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
        $this->ensure_config_data_loaded();
        $this->asset_build_css->run_build($this->service_repo_files);
        $this->asset_build_html->run_build($this->service_repo_files);
        if (isset($this->config_qa_report['unit_tests'])) {
            $this->generate_qa_report($this->config_qa_report['unit_tests']);
        }
        $this->print_final_results();
    }

    public function set_services(EntityFileRepoService $repo_files, EntityQAReportRepoService $qa_report) : void {
        $this->service_repo_files = $repo_files;
        $this->service_qa_report  = $qa_report;
    }

    public function generate_qa_report(string $path) : void {
        var_dump('Generate QA REPORT!');

        $f = $this->service_repo_files->ensure_file_is_cached($path);
        if ($this->service_repo_files->did_file_cache_update($f)) {
            $this->service_qa_report->cache_new_report($f);
        }
    }

    private function print_final_results() : void {
        $all_db_files = $this->service_repo_files->get_all_entities();
        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {
                var_dump($entity_file->to_full_string($entity_file->getChildRecursively()));
            }
        }

        $qa_results = FileParserXMLQA::get_content('/quasar_source/applications/asset_server/code_manager/report.xml');
        var_dump($qa_results->get_qa_report());
    }
}

