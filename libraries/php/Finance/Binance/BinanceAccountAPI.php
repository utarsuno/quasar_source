<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance;

use QuasarSource\Finance\Binance\Enum\BinanceEnumSymbolsToTrack as COINS;
use QuasarSource\Utils\Math\UtilsMath                       as MATH;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceCancelOrder;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccount;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountAllOrders;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountOpenOrders;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\BinanceAccountTradeHistory;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceBuy;
use QuasarSource\Utils\RequestsHTTP\Binance\Endpoint\Secure\Orders\BinanceSell;

/**
 * An extension of {BinanceAPI} to include account calls.
 *
 * Class BinanceAccountAPI
 * @package QuasarSource\Finance\Binance
 */
class BinanceAccountAPI extends BinanceAPI {

    // TODO: Create cached request object pool.

    /** @var BinanceAccount */
    protected $request_account;
    /** @var BinanceAccountTradeHistory */
    protected $request_account_trades;
    /** @var BinanceAccountOpenOrders */
    protected $request_account_open_orders;
    /** @var BinanceAccountAllOrders */
    protected $request_account_all_orders;
    /** @var BinanceSell */
    protected $request_sell;
    /** @var BinanceBuy */
    protected $request_buy;
    /** @var BinanceCancelOrder */
    protected $request_cancel_order;

    public function __construct(string $path_configs) {
        parent::__construct($path_configs);
        // TODO: Utilize table cache and dynamic creation (cache_calculate)
        $this->request_account             = new BinanceAccount($this->api_key, $this->api_secret);
        $this->request_account_trades      = new BinanceAccountTradeHistory($this->api_key, $this->api_secret);
        $this->request_account_open_orders = new BinanceAccountOpenOrders($this->api_key, $this->api_secret);
        $this->request_account_all_orders  = new BinanceAccountAllOrders($this->api_key, $this->api_secret);
        $this->request_sell                = new BinanceSell($this->api_key, $this->api_secret);
        $this->request_buy                 = new BinanceBuy($this->api_key, $this->api_secret);
        $this->request_cancel_order        = new BinanceCancelOrder($this->api_key, $this->api_secret);
    }

    public function calculate_net_result(string $ticker): void {
        #$orders = $this->account_open_orders($ticker);
        $trades = $this->account_trade_history($ticker);
        // TEMP
        $ratio_from = COINS::IOTA;
        $ratio_to   = COINS::BTC;
        $balances = [
            COINS::IOTA => 0,
            COINS::BTC  => 0,
            COINS::BNB  => 0,
        ];
        $order_mappings = [
            [98090971, 98098576],
            [98439791, 98447595, 98466851, 98473001],
        ];
        foreach ($trades as $trade) {
            $commission_coin = $trade['commissionAsset'];
            $commission      = (float) $trade['commission'];
            $quantity        = (float) $trade['qty'];
            $price           = (float) $trade['price'];
            $order_id        = (int) $trade['orderId'];
            $is_buy          = $trade['isBuyer'];
            $magnitude       = $price * $quantity;
            if (in_array($order_id, $order_mappings[0])) {
                if (!$is_buy) {
                    $balances[COINS::IOTA] -= $quantity;
                    $balances[COINS::BTC] += $magnitude;
                } else {
                    $balances[COINS::IOTA] += $quantity;
                    $balances[COINS::BTC] -= $magnitude;
                }
                $balances[$commission_coin] -= $commission;
            }
        }
        var_dump('----------- Transaction 0 -----------');
        $sum1 = 0.0;
        foreach ($balances as $coin => $amount) {
            $usd = '';
            if ($coin === COINS::BTC) {
                $usd = $amount * 8782.17;
            } else if ($coin === COINS::IOTA) {
                $usd = $amount * 0.42;
            } else if ($coin === COINS::BNB) {
                $usd = $amount * 33.97;
            }
            $sum1 += $usd;
            $amount_pretty = MATH::formatted($amount, 8);
            $usd_pretty    = MATH::formatted($usd, 8);
            var_dump('Coin{' . $coin . '} --> {' . $amount_pretty . '}, or {$' . $usd_pretty . '}');
        }
        var_dump('NET USD RESULT {$' . MATH::formatted($sum1, 8) . '}');
        var_dump(PHP_EOL);
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

    public function buy(string $ticker, int $quantity, string $price): array {
        $this->request_buy->param_set_symbol($ticker);
        $this->request_buy->param_set_order_quantity($quantity);
        $this->request_buy->param_set_order_price($price);
        return $this->request_buy->execute();
    }

    public function sell(string $ticker, int $quantity, string $price): array {
        $this->request_sell->param_set_symbol($ticker);
        $this->request_sell->param_set_order_quantity($quantity);
        $this->request_sell->param_set_order_price($price);
        return $this->request_sell->execute();
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
        if ($ticker === 'IOTABTC') {
            $this->request_account_all_orders->param_set_start_order_id(98090971);
        }
        $this->request_account_all_orders->param_set_limit(16);
        $this->request_account_all_orders->param_set_symbol($ticker);
        return $this->request_account_all_orders->execute();
    }

    public function account_open_orders(string $ticker): array {
        $this->request_account_open_orders->param_set_symbol($ticker);
        return $this->request_account_open_orders->execute();
    }

    public function account_cancel_order(string $ticker, $orderID): array {
        $this->request_cancel_order->param_set_symbol($ticker);
        $this->request_cancel_order->param_set_order_id($orderID);
        return $this->request_cancel_order->execute();
    }

}
