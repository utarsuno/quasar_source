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
use CodeManager\Repository\AbstractRepository;
use Exception;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Utilities\Files\FileUtilities        as UFO;
use QuasarSource\Utilities\Files\PathUtilities        as PATH;
use QuasarSource\Utilities\Processes\ProcessUtilities as RUN;


class CodeBuilderService extends BaseAbstractService {

    public const ENTITY_REPOSITORY_FILES     = 'EntityRepositoryFiles';
    public const ENTITY_REPOSITORY_QA_REPORT = 'EntityRepositoryQAReport';
    public const ENTITY_REPOSITORY_NPM_LIBS  = 'EntityRepositoryNPMLibs';

    public const BUILD_SECTION_CSS           = CSSBuildSection::class;
    public const BUILD_SECTION_HTML          = HTMLBuildSection::class;
    public const BUILD_SECTION_JSON          = JSONBuildSection::class;
    public const BUILD_SECTION_NPM_LIBS      = NPMLibraryBuildSection::class;
    public const BUILD_SECTION_QA_REPORT     = QAReportBuildSection::class;

    private const BUILD_SECTION_CLASSES      = [
        self::BUILD_SECTION_CSS, self::BUILD_SECTION_HTML, self::BUILD_SECTION_JSON, self::BUILD_SECTION_NPM_LIBS, self::BUILD_SECTION_QA_REPORT
    ];

    /** @var array */
    private $config;
    /** @var array */
    private $all_build_sections = [];
    /** @var array */
    private $entity_repos       = [];

    /**
     * @throws Exception
     */
    private function ensure_config_data_loaded() : void {
        if ($this->config === null) {
            $this->config = UFO::get_yaml_contents(PATH::YML_FILE_CODE_MANAGER);
            foreach (self::BUILD_SECTION_CLASSES as $build_section_class) {
                $this->all_build_sections[$build_section_class] = new $build_section_class($this);
            }
        }
    }

    public function run_code_health_check() : void {
        #$output = RUN::run_webpack_build();
        #var_dump($output);
        #exit();

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
        $repo_entity_files = $this->get_repo(self::ENTITY_REPOSITORY_FILES);
        $all_db_files      = $repo_entity_files->get_all_entities();

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
        $this->entity_repos[self::ENTITY_REPOSITORY_FILES]     = $repo_files->get_repo();
        $this->entity_repos[self::ENTITY_REPOSITORY_QA_REPORT] = $qa_report->get_repo();
        $this->entity_repos[self::ENTITY_REPOSITORY_NPM_LIBS]  = $npm_libs->get_repo();
    }

    public function get_config() : array {
        return $this->config;
    }

    public function get_repo(string $repo_key) : AbstractRepository {
        return $this->entity_repos[$repo_key];
    }

}

