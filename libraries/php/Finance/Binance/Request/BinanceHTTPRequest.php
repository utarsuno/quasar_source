<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance;

use QuasarSource\Utils\HTTP\UtilsHTTP;
use QuasarSource\Utils\HTTP\AbstractHTTPRequest;
use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class BinanceRequest
 * @package QuasarSource\Utils\RequestsHTTP\Binance
 */
abstract class BinanceHTTPRequest extends AbstractHTTPRequest {

    protected const TICKER = 'ticker/';
    protected const API_V1 = 'v1/';
    protected const API_V3 = 'v3/';

    /**
     * BinanceRequest constructor.
     * @param string       $endpoint
     * @param string|array $header
     * @param string       $request_type
     */
    public function __construct(string $endpoint, $header=UtilsHTTP::HEADER_DEFAULT, string $request_type=UtilsHTTP::REQUEST_TYPE_GET) {
        parent::__construct('https://api.binance.com/api/' . $endpoint, $header, $request_type);
    }

    /*     __   __  ___  __        __  ___
      /\  |__) /__`  |  |__)  /\  /  `  |
     /~~\ |__) .__/  |  |  \ /~~\ \__,  |  */

    protected function finalize_stream_context_settings(): void {}

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
