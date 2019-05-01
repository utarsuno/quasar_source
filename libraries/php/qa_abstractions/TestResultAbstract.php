<?php


namespace QuasarSource\QualityAssurance;


use QuasarSource\Utilities\Files\XMLElement;

abstract class TestResultAbstract {

    protected $name;
    protected $num_assertions;
    protected $time_taken;

    public function __construct(XMLElement $raw_data) {
        $this->name           = $raw_data->attributes['NAME'];
        $this->num_assertions = (int) $raw_data->attributes['ASSERTIONS'];
        $this->time_taken     = $raw_data->attributes['TIME'];
    }

    abstract public function get_header() : string;

}
