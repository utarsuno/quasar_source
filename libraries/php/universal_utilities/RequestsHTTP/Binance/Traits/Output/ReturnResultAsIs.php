<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output;


trait ReturnResultAsIs {
    /**
     * @param $results
     * @return mixed
     */
    protected function get_parsed_results($results): array {return $results;}
}
