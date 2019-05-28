<?php

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure;
use QuasarSource\Utilities\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterStartFromID;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;


class BinanceAccountTradeHistory extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterSymbol;
    use ParameterStartFromID;
    use ParameterOptionalLimit;
    // No processing of args needed.
    use NoArgs;

    public function __construct(string $api_key, string $api_secret) {
        parent::__construct(self::API_V3 . 'myTrades', $api_key, $api_secret);
    }
}
/*
Name	    Type	Mandatory	Description
symbol	    STRING	YES
startTime	LONG	NO
endTime	    LONG	NO
fromId	    LONG	NO	        TradeId to fetch from. Default gets most recent trades.
limit	    INT	    NO	        Default 500; max 1000.
recvWindow	LONG	NO
timestamp	LONG	YES
 */