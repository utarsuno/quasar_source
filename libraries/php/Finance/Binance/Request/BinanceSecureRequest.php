<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance;
use QuasarSource\Utilities\HTTP\UtilsHTTP;
use QuasarSource\Utilities\Math\UtilsCryptography as HASH;
use QuasarSource\Utilities\Time\UtilsUnixTime     as UNIX;

/**
 * Class BinanceSecureRequest
 * @package QuasarSource\Utilities\RequestsHTTP\Binance
 */
abstract class BinanceSecureRequest extends BinanceHTTPRequest {

    /** @var string */
    protected $api_key;
    /** @var string */
    protected $api_secret;
    /** @var string */
    private $secure_query_url;

    /**
     * BinanceSecureRequest constructor.
     * @param string $endpoint
     * @param string $api_key
     * @param string $api_secret
     * @param string $request_type
     */
    public function __construct(string $endpoint, string $api_key, string $api_secret, string $request_type=UtilsHTTP::REQUEST_TYPE_GET) {
        parent::__construct(
            self::API_V3 . $endpoint,
            [UtilsHTTP::HEADER_DEFAULT, 'X-MBX-APIKEY: ' . $api_key, 'Content-type: application/x-www-form-urlencoded'],
            $request_type
        );
        $this->api_secret = $api_secret;
        $this->api_key    = $api_key;
    }

    /*     __   __  ___  __        __  ___
      /\  |__) /__`  |  |__)  /\  /  `  |
     /~~\ |__) .__/  |  |  \ /~~\ \__,  |  */

    protected function finalize_stream_context_settings(): void {
        $this->context_settings_add('ignore_errors', true);
        if ($this->request_type === UtilsHTTP::REQUEST_TYPE_POST || $this->request_type === UtilsHTTP::REQUEST_TYPE_DELETE) {
            $this->context_settings_add('content', $this->secure_query_url);
        }
    }

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
        $this->param_set('timestamp', UNIX::now_as_string());
        $this->process_args($args);
        $query                  = $this->get_params_as_query();
        $this->secure_query_url = $query . '&signature=' . HASH::hmac_sha256($query, $this->api_secret);
    }

    /**
     * @param null $args
     */
    abstract protected function process_args($args=null): void;

}
