<?php

namespace QuasarSource\Finance\Binance;
use QuasarSource\Finance\Binance\Enum\BinanceEnumOrderTypes     as ORDER_TYPES;
use QuasarSource\Finance\Binance\Enum\BinanceEnumSymbolsToTrack as COINS;
use QuasarSource\Finance\Binance\Enum\BinanceEnumTimeInForce    as TIME_IN_FORCE;
use QuasarSource\Utilities\StringUtilities                      as STR;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccount;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountAllOrders;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountOpenOrders;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountTradeHistory;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceBuy;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceBuyTest;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceSell;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceSellTest;


/**
 * An extension of {BinanceAPI} to include account calls.
 *
 * Class BinanceAccountAPI
 * @package QuasarSource\Finance\Binance
 */
class BinanceAccountAPI extends BinanceAPI {

    /** @var BinanceAccount */
    protected $request_account;
    /** @var BinanceAccountTradeHistory */
    protected $request_account_trades;
    /** @var BinanceAccountOpenOrders */
    protected $request_account_open_orders;
    /** @var BinanceAccountAllOrders */
    protected $request_account_all_orders;
    /** @var BinanceBuyTest */
    protected $request_test_buy;
    /** @var BinanceSellTest */
    protected $request_test_sell;
    /** @var BinanceSell */
    protected $request_sell;
    /** @var BinanceBuy */
    protected $request_buy;

    public function __construct(string $path_configs) {
        parent::__construct($path_configs);
        $this->request_account             = new BinanceAccount($this->api_key, $this->api_secret);
        $this->request_account_trades      = new BinanceAccountTradeHistory($this->api_key, $this->api_secret);
        $this->request_account_open_orders = new BinanceAccountOpenOrders($this->api_key, $this->api_secret);
        $this->request_account_all_orders  = new BinanceAccountAllOrders($this->api_key, $this->api_secret);
        $this->request_test_buy            = new BinanceBuyTest($this->api_key, $this->api_secret);
        $this->request_test_sell           = new BinanceSellTest($this->api_key, $this->api_secret);
        $this->request_sell                = new BinanceSell($this->api_key, $this->api_secret);
        $this->request_buy                 = new BinanceBuy($this->api_key, $this->api_secret);
    }

    public function print_balance(): void {
        var_dump('----------- Printing balances! -----------');
        $account  = $this->account();
        $balances = $account['balances'];
        foreach ($balances as $b) {
            $asset  = $b['asset'];
            $free   = $b['free'];
            $locked = $b['locked'];
            $zero   = '0.00000000';
            if ($free !== $zero || $locked !== $zero) {
                var_dump('{' . $asset . '}, {' . $free . '}, {' . $locked . '}');
            }
        }
        var_dump(PHP_EOL);
    }

    public function test_buy(string $ticker): bool {
        $this->request_test_buy->param_set_symbol($ticker);
        $this->request_test_buy->param_set_order_type(ORDER_TYPES::LIMIT);
        $this->request_test_buy->param_set_order_time_in_force(TIME_IN_FORCE::GTC);
        $this->request_test_buy->param_set_order_quantity(100);
        $this->request_test_buy->param_set_order_price('0.00009000');
        return $this->request_test_buy->execute();
    }

    public function buy(string $ticker, int $quantity, string $price): array {
        $this->request_buy->param_set_symbol($ticker);
        $this->request_buy->param_set_order_type(ORDER_TYPES::LIMIT);
        $this->request_buy->param_set_order_time_in_force(TIME_IN_FORCE::GTC);
        $this->request_buy->param_set_order_quantity($quantity);
        $this->request_buy->param_set_order_price($price);
        return $this->request_buy->execute();
    }

    public function sell(string $ticker, int $quantity, string $price): array {
        $this->request_sell->param_set_symbol($ticker);
        $this->request_sell->param_set_order_type(ORDER_TYPES::LIMIT);
        $this->request_sell->param_set_order_time_in_force(TIME_IN_FORCE::GTC);
        $this->request_sell->param_set_order_quantity($quantity);
        $this->request_sell->param_set_order_price($price);
        return $this->request_sell->execute();
    }

    public function test_sell(string $ticker, int $quantity, string $price): bool {
        $this->request_test_sell->param_set_symbol($ticker);
        $this->request_test_sell->param_set_order_type(ORDER_TYPES::LIMIT);
        $this->request_test_sell->param_set_order_time_in_force(TIME_IN_FORCE::GTC);
        $this->request_test_sell->param_set_order_quantity($quantity);
        $this->request_test_sell->param_set_order_price($price);
        return $this->request_test_sell->execute();
    }

    public function account(): array {
        return $this->request_account->execute();
    }

    public function account_trade_history(string $ticker): array {
        $this->request_account_trades->param_set_from_id(17961482);
        $this->request_account_trades->param_set_limit(32);
        $this->request_account_trades->param_set_symbol($ticker);
        return $this->request_account_trades->execute();
    }

    public function account_all_orders(string $ticker): array {
        $this->request_account_all_orders->param_set_start_order_id(98090971);
        $this->request_account_all_orders->param_set_limit(16);
        $this->request_account_all_orders->param_set_symbol($ticker);
        return $this->request_account_all_orders->execute();
    }

    public function account_open_orders(string $ticker): array {
        $this->request_account_open_orders->param_set_symbol($ticker);
        return $this->request_account_open_orders->execute();
    }

}
