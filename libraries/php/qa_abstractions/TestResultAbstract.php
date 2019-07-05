<?php declare(strict_types=1);


namespace QuasarSource\QualityAssurance;
use QuasarSource\CommonFeatures\TraitName;
use QuasarSource\Utilities\File\Discrete\XMLElement;


abstract class TestResultAbstract {
    use TraitName;

    protected $num_assertions;
    protected $time_taken;

    public function __construct(XMLElement $raw_data) {
        $this->name           = $raw_data->attributes['NAME'];
        $this->num_assertions = (int) $raw_data->attributes['ASSERTIONS'];
        $this->time_taken     = $raw_data->attributes['TIME'];
    }

    abstract public function get_header() : string;

    public function get_num_assertions() : int {
        return $this->num_assertions;
    }

    public function get_time_taken() : string {
        return $this->time_taken;
    }

}
