<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterStartOrderID;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceAccountAllOrders extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterOptionalLimit;
    use ParameterStartOrderID;
    use ParameterSymbol;
    // No processing of args needed.
    use NoArgs;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct(self::API_V3 . 'allOrders', $api_key, $api_secret);
        $this->cache_the_response();
    }
}
/*
Name	    Type	Mandatory	Description
symbol	    STRING	YES
orderId	    LONG	NO
startTime	LONG	NO
endTime	    LONG	NO
limit	    INT	    NO	        Default 500; max 1000.
recvWindow	LONG	NO
timestamp	LONG	YES
 */
