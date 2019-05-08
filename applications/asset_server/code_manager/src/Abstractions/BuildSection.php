<?php

namespace CodeManager\Abstractions;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Traits\TraitPatternName;
use QuasarSource\Utilities\SimpleTimer;


abstract class BuildSection {
    use TraitPatternName;

    /** @var SimpleTimer */
    protected $build_time;
    /** @var CodeBuilderService */
    protected $code_builder;

    public function __construct(string $name, array $data, CodeBuilderService $code_builder) {
        $this->set_name($name);
        $this->build_time   = new SimpleTimer(false);
        $this->code_builder = $code_builder;
    }

    public function run_build() : void {
        $this->build_time->start();
        $this->code_builder->log('--- Build Start {' . $this->name . '} ---');
        $this->run_section_build();
        $this->build_time->stop();
        $this->code_builder->log('--- Build Completed {' . $this->name . '} in {' . $this->build_time->get_delta() . '}---');
    }

    abstract protected function run_section_build() : void;
}