<?php declare(strict_types=1);


namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output;


trait BooleanResponse {

    protected function get_parsed_results($results): bool {
        return is_array($results) && count($results) === 0;
    }

}