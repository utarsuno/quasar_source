<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure;

use QuasarSource\Utils\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceAccount
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure
 */
class BinanceAccount extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use NoArgs;

    /**
     * BinanceAccount constructor.
     * @param string $api_key
     * @param string $api_secret
     */
    public function __construct(string $api_key, string $api_secret) {
        parent::__construct('account', $api_key, $api_secret);
        $this->cache_the_response();
    }
}
