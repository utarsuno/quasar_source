<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceAccountOpenOrders extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterSymbol;
    // No processing of args needed.
    use NoArgs;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct(self::API_V3 . 'openOrders', $api_key, $api_secret);
    }
}
/*
Name	    Type	Mandatory	Description
symbol	    STRING	NO
recvWindow	LONG	NO
timestamp	LONG	YES

 */