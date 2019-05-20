<?php

namespace QuasarSource\BuildProcess\Abstractions;
use CodeManager\Service\CodeBuilderService;
use QuasarSource\Traits\TraitPatternName;
use QuasarSource\Traits\TraitPatternTimer;


abstract class UnitOfWork {
    use TraitPatternName;
    use TraitPatternTimer;

    /** @var CodeBuilderService */
    protected $code_builder;

    protected function __construct(string $name, CodeBuilderService $code_builder) {
        $this->set_name_and_label($name, 'Step');
        $this->init_trait_timer(false);
        $this->code_builder = $code_builder;
    }

    public function run_unit_of_work(): void {
        $this->code_builder->log('--- ' . $this->name . ' Start ---');
        $this->timer->start();
        $this->pre_work();
        $this->perform_work();
        $this->post_work();
        $this->timer->stop();
        $this->code_builder->log('--- ' . $this->name . ' completed in {' . $this->timer->get_delta() . '}---');
    }

    abstract protected function pre_work(): void;

    abstract protected function perform_work(): void;

    abstract protected function post_work(): void;

}