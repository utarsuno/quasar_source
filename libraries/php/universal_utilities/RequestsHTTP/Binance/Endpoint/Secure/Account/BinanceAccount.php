<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceAccount extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use NoArgs;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct('account', $api_key, $api_secret);
        $this->cache_the_response();
    }
}
