<?php


namespace QuasarSource\QualityAssurance;


use QuasarSource\Utilities\Files\XMLElement;

class TestSuiteResult extends ProjectTestSuiteResult {

    protected $file;
    protected $child_test_cases = [];

    public function __construct(XMLElement $raw_data) {
        parent::__construct($raw_data);
        $this->file           = $raw_data->attributes['FILE'] ?? null;
        $this->process_children($raw_data->children);
    }

    public function get_test_cases() : array {
        return $this->child_test_cases;
    }

    public function get_header() : string {
        return parent::get_header();
    }

    private function add_test_case(XMLElement $test_case_data) : void {
        $test_case = new TestCaseResult($test_case_data);
        $this->child_test_cases[] = $test_case;
    }

    public function process_children(array $children) : void {
        foreach ($children as $child) {
            if ($child->name === 'TESTSUITE') {
                $this->add_test_suite($child);
            } else {
                $this->add_test_case($child);
            }
        }
    }

}
