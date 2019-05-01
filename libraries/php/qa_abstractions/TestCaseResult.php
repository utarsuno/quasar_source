<?php


namespace QuasarSource\QualityAssurance;


use QuasarSource\Utilities\Files\XMLElement;

class TestCaseResult extends TestResultAbstract {

    protected $name_class;

    protected $name;
    protected $num_assertions;
    protected $time_taken;

    public function __construct(XMLElement $raw_data) {
        parent::__construct($raw_data);
        $this->name_class = $raw_data->attributes['CLASSNAME'];
    }

    public function get_header() : string {
        $header = '[' . $this->name_class . ']: {assertions: ' . $this->num_assertions;
        return $header . ', time: ' . $this->time_taken . '}';
    }
}
