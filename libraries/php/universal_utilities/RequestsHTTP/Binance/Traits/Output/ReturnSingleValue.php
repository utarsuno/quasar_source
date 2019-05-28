<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output;


trait ReturnSingleValue {

    protected $return_key;

    protected function set_return_key(string $key): void {
        $this->return_key = $key;
    }

    /**
     * @param $results
     * @return mixed
     */
    protected function get_parsed_results($results) {
        return $results[$this->return_key];
    }

}
