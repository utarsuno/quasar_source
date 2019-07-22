<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure;

use QuasarSource\Utils\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterOptionalLimit;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterStartOrderID;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceAccountAllOrders
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure
 */
class BinanceAccountAllOrders extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterOptionalLimit;
    use ParameterStartOrderID;
    use ParameterSymbol;
    // No processing of args needed.
    use NoArgs;

    /**
     * BinanceAccountAllOrders constructor.
     * @param string $api_key
     * @param string $api_secret
     */
    public function __construct(string $api_key, string $api_secret) {
        parent::__construct('allOrders', $api_key, $api_secret);
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
