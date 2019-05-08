<?php


namespace QuasarSource\QualityAssurance;


use QuasarSource\Utilities\Files\XMLElement;
use QuasarSource\Utilities\StringUtilities as STR;

class TestSuiteResult extends TestResultAbstract {

    protected $file;
    protected $child_test_cases = [];
    protected $parent;

    public function __construct(XMLElement $raw_data, ProjectTestSuiteResult $parent) {
        parent::__construct($raw_data);
        $this->parent         = $parent;
        $this->name           = STR::get_matches_removed($this->name, 'CodeManager\\Tests\\');
        $this->name           = STR::get_matches_removed($this->name, 'Command\\');
        $this->name           = STR::get_matches_removed($this->name, 'CodeManager\\Traits\\');
        $this->file           = $raw_data->attributes['FILE'] ?? null;
        $this->parent->add_test_suite($this);
        foreach ($raw_data->children as $child) {
            new TestCaseResult($child, $this);
        }
    }

    public function get_test_cases() : array {
        return $this->child_test_cases;
    }

    public function add_test_case(TestCaseResult $test_case_result) : void {
        $this->child_test_cases[] = $test_case_result;
    }

    public function get_header() : string {
        return '    [' . $this->name . ']: {assertions: ' . $this->num_assertions . ', time: ' . $this->time_taken . '}' . PHP_EOL;
    }
}
