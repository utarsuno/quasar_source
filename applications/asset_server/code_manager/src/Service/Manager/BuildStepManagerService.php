<?php

namespace CodeManager\Service\Manager;

use CodeManager\Service\Abstractions\BaseAbstractService;
use CodeManager\Service\CodeBuilderService;
use Psr\Log\LoggerInterface;
use QuasarSource\BuildProcess\CSSBuildSection;
use QuasarSource\BuildProcess\DBBuildSection;
use QuasarSource\BuildProcess\HTMLBuildSection;
use QuasarSource\BuildProcess\JSONBuildSection;
use QuasarSource\BuildProcess\NPMLibBuildSection;
use QuasarSource\BuildProcess\QAReportBuildSection;


class BuildStepManagerService extends BaseAbstractService {

    /**
     * @var array < N O T E : the order will dictate order ran in >
     */
    private const BUILD_STEPS = [
        DBBuildSection::class,
        CSSBuildSection::class,
        HTMLBuildSection::class,
        JSONBuildSection::class,
        NPMLibBuildSection::class,
        QAReportBuildSection::class
    ];

    /** @var CodeBuilderService */
    private $code_builder;

    /** @var array */
    private $all_build_sections = [];

    #public function __construct(LoggerInterface $logger) {
    #    parent::__construct($logger);
    #}

    public function set_code_builder(CodeBuilderService $code_builder): void {
        $this->code_builder = $code_builder;
    }

    public function initialize_builds(): void {
        foreach (self::BUILD_STEPS as $build_section_class) {
            $this->all_build_sections[] = new $build_section_class($this->code_builder);
        }
    }

    public function run_all_builds(): void {
        foreach ($this->all_build_sections as $build_section) {
            $build_section->run_unit_of_work();
        }
    }

}
