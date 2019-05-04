<?php

namespace QuasarSource\QualityAssurance;
use QuasarSource\Utilities\Files\XMLElement;

class ProjectTestSuiteResult extends TestResultAbstract {

    protected $num_errors;
    protected $num_tests;
    protected $num_skipped;
    protected $num_failures;
    protected $child_test_suites = [];

    public function get_num_errors() : int {
        return $this->num_errors;
    }

    public function get_num_skipped() : int {
        return $this->num_skipped;
    }

    public function get_num_tests() : int {
        return $this->num_tests;
    }

    public function get_num_failed() : int {
        return $this->num_failures;
    }

    public function __construct(XMLElement $raw_data) {
        parent::__construct($raw_data);
        $this->num_tests      = (int) $raw_data->attributes['TESTS'];
        $this->num_skipped    = (int) $raw_data->attributes['SKIPPED'];
        $this->num_failures   = (int) $raw_data->attributes['FAILURES'];
        $this->num_errors     = (int) $raw_data->attributes['ERRORS'];
        foreach ($raw_data->children as $child) {
            new TestSuiteResult($child, $this);
        }
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
        return $header . ', time: ' . $this->time_taken . '}' . PHP_EOL;
    }

    public function get_qa_report() : string {
        $report = $this->get_header();
        foreach ($this->child_test_suites as $child) {
            $report .= $child->get_header();
            foreach ($child->get_test_cases() as $c) {
                $report .= $c->get_header();
            }
        }
        return $report;
    }

    public function add_test_suite(TestSuiteResult $test_suite_result) : void {
        $this->child_test_suites[] = $test_suite_result;
    }

}
