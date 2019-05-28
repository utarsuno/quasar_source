<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance;
use QuasarSource\Utilities\CryptographyUtilities as HASH;
use QuasarSource\Utilities\DateTimeUtilities     as TIME;
use QuasarSource\Utilities\RequestsHTTP\AbstractRequest;


abstract class BinanceSecureRequest extends BinanceRequest {

    private const HEADER_ENDING = self::NEW_LINE . 'Content-type: application/x-www-form-urlencoded' . self::NEW_LINE;

    /** @var string */
    protected $api_key;
    /** @var string */
    protected $api_secret;
    /** @var string */
    private $secure_query_url;

    public function __construct(string $endpoint, string $api_key, string $api_secret, string $request_type=AbstractRequest::REQUEST_TYPE_GET) {
        parent::__construct($endpoint, $request_type);
        $this->api_secret = $api_secret;
        $this->api_key    = $api_key;
    }

    private function get_signature(string $text): string {
        return HASH::hmac_sha256($text, $this->api_secret);
    }

    /*    ___ ___  __      __   ___ ___ ___         __   __
     |__|  |   |  |__)    /__` |__   |   |  | |\ | / _` /__`
     |  |  |   |  |       .__/ |___  |   |  | | \| \__> .__/ */
    /**
     * @return array
     */
    protected function get_stream_context_settings(): array {
        $settings = parent::get_stream_context_settings();
        $settings['http']['ignore_errors'] = true;
        if ($this->is_post()) {
            $settings['http']['content'] = $this->secure_query_url;
        }
        return $settings;
    }

    /**
     * @return string
     */
    protected function get_header(): string {
        return parent::get_header() . 'X-MBX-APIKEY: ' . $this->api_key . self::HEADER_ENDING;
    }

    /*     __   __  ___  __        __  ___
      /\  |__) /__`  |  |__)  /\  /  `  |
     /~~\ |__) .__/  |  |  \ /~~\ \__,  |  */
    /**
     * @return string
     */
    protected function get_url_query(): string {
        return $this->secure_query_url;
    }

    /**
     * @param null $args
     * @return mixed|void
     */
    protected function parse_args($args = null) {
        $this->param_set('timestamp', TIME::unix_timestamp());
        $this->process_args($args);
        $query = $this->get_params_as_query();
        $this->secure_query_url = $query . '&signature=' . $this->get_signature($query);
    }

    /**
     * @param null $args
     */
    abstract protected function process_args($args=null): void;

}
