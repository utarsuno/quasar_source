<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure;

use QuasarSource\Utils\RequestsHTTP\Binance\BinanceSecureRequest;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\NoArgs;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params\ParameterSymbol;
use QuasarSource\Utils\RequestsHTTP\Binance\Traits\Output\ReturnResultAsIs;

/**
 * Class BinanceAccountOpenOrders
 * @package QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure
 */
class BinanceAccountOpenOrders extends BinanceSecureRequest {
    use ReturnResultAsIs;
    use ParameterSymbol;
    // No processing of args needed.
    use NoArgs;

    /**
     * BinanceAccountOpenOrders constructor.
     * @param string $api_key
     * @param string $api_secret
     */
    public function __construct(string $api_key, string $api_secret) {
        parent::__construct('openOrders', $api_key, $api_secret);
    }
}
/*
Name	    Type	Mandatory	Description
symbol	    STRING	NO
recvWindow	LONG	NO
timestamp	LONG	YES

 */