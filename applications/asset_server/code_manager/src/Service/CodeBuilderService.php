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
use CodeManager\Abstractions\JSONBuildSection;
use CodeManager\Abstractions\NPMLibraryBuildSection;
use CodeManager\Entity\EntityFile;
use Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\ArrayUtilities                as ARY;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileParserXMLQA;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;
use QuasarSource\Utilities\Processes\ProcessMinifyJS;


class CodeBuilderService extends BaseAbstractService {

    // TODO: Get rid of hard-coded paths.
    private const PATH_CONFIG_FILE     = '/quasar_source/configs/code_manager.yml';

    private const KEY_HEADER_ASSETS    = 'assets';

    private const KEY_HEADER_QA_REPORT = 'qa_report';
    private const KEY_HEADER_PROJECTS  = 'projects';

    private const ALL_HEADER_KEYS = [
        self::KEY_HEADER_ASSETS,
        self::KEY_HEADER_PROJECTS,
        self::KEY_HEADER_QA_REPORT
    ];

    private const ALL_ASSET_SECTIONS = [UFO::EXTENSION_CSS, UFO::EXTENSION_HTML, UFO::EXTENSION_JSON];

    private $loaded = false;

    /** @var EntityFileRepoService */
    private $service_repo_files;
    /** @var EntityQAReportRepoService */
    private $service_qa_report;
    /** @var EntityNPMLibraryRepoService */
    private $service_npm_libs;

    private $config;
    private $config_assets;

    /** @var CSSBuildSection */
    private $asset_build_css;
    /** @var HTMLBuildSection */
    private $asset_build_html;
    /** @var JSONBuildSection */
    private $asset_build_json;
    /** @var NPMLibraryBuildSection */
    private $lib_build_npm;

    private $config_qa_report;

    public function __construct(LoggerInterface $logger) {
        parent::__construct($logger);
    }

    /**
     * @throws Exception
     */
    private function ensure_config_data_loaded() : void {
        if (!$this->loaded) {
            $this->config = UFO::get_yaml_contents(self::PATH_CONFIG_FILE);
            $this->loaded = true;
            if (!ARY::has_all_keys_in($this->config, self::ALL_HEADER_KEYS)) {
                DBG::throw_exception_config_file(json_encode(ARY::get_all_missing_keys_relative_to($this->config, self::ALL_HEADER_KEYS)));
            }
            $this->config_assets = $this->config[self::KEY_HEADER_ASSETS];
            if (!ARY::has_all_keys_in($this->config_assets, self::ALL_ASSET_SECTIONS)) {
                DBG::throw_exception_config_file(json_encode(ARY::get_all_missing_keys_relative_to($this->config_assets, self::ALL_ASSET_SECTIONS)));
            }
            $this->asset_build_css  = new CSSBuildSection($this->config_assets[UFO::EXTENSION_CSS], $this);
            $this->asset_build_html = new HTMLBuildSection($this->config_assets[UFO::EXTENSION_HTML], $this);
            $this->asset_build_json = new JSONBuildSection($this->config_assets[UFO::EXTENSION_JSON], $this);
            $this->lib_build_npm    = new NPMLibraryBuildSection($this->config['npm'], $this);
            $this->config_qa_report = $this->config[self::KEY_HEADER_QA_REPORT]['stats'];
        }
    }

    public function run_code_health_check() : void {
        $p = ProcessMinifyJS::minify_file_to('a', 'b', true);
        #$this->ensure_config_data_loaded();
        #$this->run_all_builds();
        #$this->print_final_results();
    }

    public function generate_qa_report(string $path) : void {
        $f = $this->service_repo_files->ensure_file_is_cached($path);
        if ($this->service_repo_files->did_file_cache_update($f)) {
            $this->service_qa_report->cache_new_report($f);
        }
    }

    private function run_all_builds() : void {
        $this->asset_build_css->run_build();
        $this->asset_build_html->run_build();
        $this->asset_build_json->run_build();
        $this->lib_build_npm->run_build();
    }

    private function print_final_results() : void {
        if (isset($this->config_qa_report['unit_tests'])) {
            $this->generate_qa_report($this->config_qa_report['unit_tests']);
        }

        $all_db_files = $this->service_repo_files->get_all_entities();
        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {

                if ($entity_file->getFileType() === EntityFile::TYPE_HTML) {
                    var_dump($entity_file->getChild()->to_full_string($entity_file->get_child_recursively()));
                } else {
                    var_dump($entity_file->to_full_string($entity_file->get_child_recursively()));
                }
            }
        }

        $qa_results = FileParserXMLQA::get_content('/quasar_source/applications/asset_server/code_manager/report.xml');
        var_dump($qa_results->get_qa_report());
    }

    public function set_services(EntityFileRepoService $repo_files, EntityQAReportRepoService $qa_report, EntityNPMLibraryRepoService $npm_libs) : void {
        $this->service_repo_files = $repo_files;
        $this->service_qa_report  = $qa_report;
        $this->service_npm_libs   = $npm_libs;
    }

    public function get_service_repo_files() : EntityFileRepoService {
        return $this->service_repo_files;
    }

    public function get_service_qa_report() : EntityQAReportRepoService {
        return $this->service_qa_report;
    }

    public function get_service_npm_libs() : EntityNPMLibraryRepoService {
        return $this->service_npm_libs;
    }

}

