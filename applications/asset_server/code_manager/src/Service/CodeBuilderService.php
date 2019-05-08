<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;


use CodeManager\Abstractions\BuildSection;
use CodeManager\Abstractions\CSSBuildSection;
use CodeManager\Abstractions\HTMLBuildSection;
use CodeManager\Abstractions\JSONBuildSection;
use CodeManager\Abstractions\NPMLibraryBuildSection;
use CodeManager\Abstractions\QAReportBuildSection;
use CodeManager\Entity\EntityFile;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityNPMLibraryRepository;
use CodeManager\Repository\EntityQAReportRepository;
use Exception;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Utilities\Files\FileUtilities as UFO;
use QuasarSource\Utilities\Files\PathUtilities as PATH;


class CodeBuilderService extends BaseAbstractService {

    /** @var EntityFileRepository */
    private $repo_entity_files;
    /** @var EntityQAReportRepository */
    private $repo_qa_report;
    /** @var EntityNPMLibraryRepository */
    private $repo_npm_libs;
    /** @var array */
    private $config;
    /** @var CSSBuildSection */
    private $asset_build_css;
    /** @var HTMLBuildSection */
    private $asset_build_html;
    /** @var JSONBuildSection */
    private $asset_build_json;
    /** @var NPMLibraryBuildSection */
    private $lib_build_npm;
    /** @var QAReportBuildSection */
    private $config_qa_report;
    /** @var array */
    private $all_build_sections = [];

    /**
     * @throws Exception
     */
    private function ensure_config_data_loaded() : void {
        if ($this->config === null) {
            $this->config           = UFO::get_yaml_contents(PATH::YML_FILE_CODE_MANAGER);
            $this->asset_build_css  = new CSSBuildSection($this->config, $this);
            $this->asset_build_html = new HTMLBuildSection($this->config, $this);
            $this->asset_build_json = new JSONBuildSection($this->config, $this);
            $this->lib_build_npm    = new NPMLibraryBuildSection($this->config, $this);
            $this->config_qa_report = new QAReportBuildSection($this->config, $this);

            $this->all_build_sections[] = $this->asset_build_css;
            $this->all_build_sections[] = $this->asset_build_html;
            $this->all_build_sections[] = $this->asset_build_json;
            $this->all_build_sections[] = $this->lib_build_npm;
            $this->all_build_sections[] = $this->config_qa_report;
        }
    }

    public function run_code_health_check() : void {
        #$p = ProcessMinifyJS::minify_file_to('a', 'b', true);

        #$output = RUN::run_cmd(['npm', 'run-script', 'build'], PATH::NODE_DIRECTORY);
        #var_dump($output);

        $this->ensure_config_data_loaded();
        $this->run_all_builds();
        $this->print_final_results();
    }

    private function run_all_builds() : void {
        /** @var BuildSection $build_section */
        foreach ($this->all_build_sections as $build_section) {
            $build_section->run_build();
        }
    }

    private function print_final_results() : void {
        $all_db_files = $this->repo_entity_files->get_all_entities();
        foreach ($all_db_files as $entity_file) {
            if (!$entity_file->hasParent()) {

                if ($entity_file->getFileType() === EntityFile::TYPE_HTML) {
                    var_dump($entity_file->getChild()->to_full_string($entity_file->get_child_recursively()));
                } else {
                    var_dump($entity_file->to_full_string($entity_file->get_child_recursively()));
                }
            }
        }

        $qa_results = new ProjectTestSuiteResult(PATH::QA_REPORT);
        var_dump($qa_results->get_qa_report());
    }

    public function set_services(EntityFileRepoService $repo_files, EntityQAReportRepoService $qa_report, EntityNPMLibraryRepoService $npm_libs) : void {
        $this->repo_entity_files = $repo_files->get_repo();
        $this->repo_qa_report    = $qa_report->get_repo();
        $this->repo_npm_libs     = $npm_libs->get_repo();
    }

    public function get_repo_entity_files() : EntityFileRepository {
        return $this->repo_entity_files;
    }

    public function get_repo_qa_report() : EntityQAReportRepository {
        return $this->repo_qa_report;
    }

    public function get_repo_npm_libs() : EntityNPMLibraryRepository {
        return $this->repo_npm_libs;
    }

}

