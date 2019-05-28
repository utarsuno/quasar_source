<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance;
use QuasarSource\Utilities\RequestsHTTP\AbstractRequest;
use QuasarSource\Utilities\StringUtilities as STR;


abstract class BinanceRequest extends AbstractRequest {

    protected const URL_API_BASE = 'https://api.binance.com/api/';
    protected const API_V1       = self::URL_API_BASE . 'v1/';
    protected const API_V3       = self::URL_API_BASE . 'v3/';
    protected const TICKER       = 'ticker/';

    public function __construct(string $endpoint, string $request_type=AbstractRequest::REQUEST_TYPE_GET) {
        parent::__construct($endpoint, $request_type);
    }

    /*     __   __  ___  __        __  ___
      /\  |__) /__`  |  |__)  /\  /  `  |
     /~~\ |__) .__/  |  |  \ /~~\ \__,  |  */
    /**
     * @param $response
     * @return mixed
     */
    protected function parse_response($response) {
        return $this->get_parsed_results(STR::to_associative($response));
    }

    /**
     * @param null $args
     * @return mixed|void
     */
    protected function parse_args($args = null) {
        $this->process_args($args);
    }

    /**
     * @param $results
     * @return mixed
     */
    abstract protected function get_parsed_results($results);

    /**
     * @param null $args
     */
    abstract protected function process_args($args=null): void;
}
