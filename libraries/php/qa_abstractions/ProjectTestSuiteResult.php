<?php

namespace QuasarSource\QualityAssurance;
use QuasarSource\Utilities\Files\XMLElement;

class ProjectTestSuiteResult extends TestResultAbstract {

    protected $num_errors;
    protected $num_tests;
    protected $num_skipped;
    protected $num_failures;
    protected $child_test_suites = [];

    public function __construct(XMLElement $raw_data) {
        parent::__construct($raw_data);
        $this->num_tests      = (int) $raw_data->attributes['TESTS'];
        $this->num_skipped    = (int) $raw_data->attributes['SKIPPED'];
        $this->num_failures   = (int) $raw_data->attributes['FAILURES'];
        $this->num_errors     = (int) $raw_data->attributes['ERRORS'];
        $this->process_children($raw_data->children);
    }

    public function get_header() : string {
        $header = '[' . $this->name . ']: {tests: ' . $this->num_tests;
        $header .= ', assertions: ' . $this->num_assertions;
        if ($this->num_errors > 0) {
            $header .= ', errors: ' . $this->num_errors;
        }
        if ($this->num_failures > 0) {
            $header .= ', failures: ' . $this->num_failures;
        }
        if ($this->num_skipped > 0) {
            $header .= ', skipped: ' . $this->num_skipped;
        }
        return $header . ', time: ' . $this->time_taken . '}';
    }

    public function get_qa_report() : string {
        $report = $this->get_header() . PHP_EOL;
        foreach ($this->child_test_suites as $child) {
            $report .= '____' . $child->get_header() . PHP_EOL;
            $children = $child->get_test_cases();
            foreach ($children as $c) {
                $report .= '________' . $c->get_header() . PHP_EOL;
            }
        }
        return $report;
    }

    protected function add_test_suite(XMLElement $test_suite_data) : void {
        $test_suite = new TestSuiteResult($test_suite_data);
        $this->child_test_suites[] = $test_suite;
    }

    public function process_children(array $children) : void {
        foreach ($children as $child) {
            $this->add_test_suite($child);
        }
    }

}
