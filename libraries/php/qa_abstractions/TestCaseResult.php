<?php


namespace QuasarSource\QualityAssurance;


use QuasarSource\Utilities\Files\XMLElement;

class TestCaseResult extends TestResultAbstract {

    protected $name_class;
    protected $parent;

    public function __construct(XMLElement $raw_data, TestSuiteResult $parent) {
        parent::__construct($raw_data);
        $this->parent     = $parent;
        $this->name_class = $raw_data->attributes['CLASSNAME'];
        $this->parent->add_test_case($this);
    }

    public function get_header() : string {
        return '        [' . $this->name . ']: {assertions: ' . $this->num_assertions . ', time: ' . $this->time_taken . '}' . PHP_EOL;
    }
}
