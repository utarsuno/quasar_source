<?php declare(strict_types=1);

namespace QuasarSource\Finance\Binance;
use QuasarSource\Finance\Binance\Enum\BinanceEnumAPIKeys as KEYS;
use CodeManager\Service\Feature\Config\FeatureConfigYAMLTrait;
use QuasarSource\Utilities\File\Discrete\YAMLUtilities   as YAML;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceOrderBook;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceAveragePrice;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceExchangeInfo;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinancePing;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinancePrice;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceStatistics;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceTime;
use QuasarSource\Utilities\RequestsHTTP\Binance\Endpoint\BinanceTrades;

/**
 * Class BinanceAPI
 * @package QuasarSource\Finance\Binance
 */
abstract class BinanceAPI {
    use FeatureConfigYAMLTrait;

    /** @var string */
    protected $api_key;
    /** @var string */
    protected $api_secret;

    /** @var BinancePing */
    protected $request_ping;
    /** @var BinanceTime */
    protected $request_time;
    /** @var BinanceExchangeInfo */
    protected $request_exchange_info;
    /** @var BinanceStatistics */
    protected $request_statistics;
    /** @var BinancePrice */
    protected $request_price;
    /** @var BinanceAveragePrice */
    protected $request_average_price;
    /** @var BinanceTrades */
    protected $request_trades;
    /** @var BinanceOrderBook */
    protected $request_order_book;

    /**
     * BinanceAPI constructor.
     * @param string $path_configs
     */
    public function __construct(string $path_configs) {
        #$this->config_initialize(['binance' => ['dd' => ['api_key' => null, 'api_secret' => null]]], UFO::get_yaml($path_configs));
        $this->config_initialize(['binance' => ['dd' => ['api_key' => null, 'api_secret' => null]]], YAML::get($path_configs));
        $this->api_key    = $this->config_yaml_get(['binance', 'dd', KEYS::API]);
        $this->api_secret = $this->config_yaml_get(['binance', 'dd', KEYS::SECRET]);

        // TODO: Don't create the objects until they are needed.
        $this->request_ping          = new BinancePing();
        $this->request_exchange_info = new BinanceExchangeInfo();
        $this->request_time          = new BinanceTime();
        $this->request_statistics    = new BinanceStatistics();
        $this->request_price         = new BinancePrice();
        $this->request_average_price = new BinanceAveragePrice();
        $this->request_trades        = new BinanceTrades();
        $this->request_order_book    = new BinanceOrderBook();
    }

    public function order_book(string $ticker): array {
        $this->request_order_book->param_set_symbol($ticker);
        $this->request_order_book->param_set_limit(5);
        return $this->request_order_book->execute();
    }

    public function recent_trades(string $ticker): array {
        $this->request_trades->param_set_limit(5);
        $this->request_trades->param_set_symbol($ticker);
        return $this->request_trades->execute();
    }

    public function price(string $ticker): string {
        $this->request_price->param_set_symbol($ticker);
        return $this->request_price->execute();
    }

    public function average_price(string $ticker): array {
        $this->request_average_price->param_set_symbol($ticker);
        return $this->request_average_price->execute();
    }

    public function statistics_24_hour(string $ticker): array {
        $this->request_statistics->param_set_symbol($ticker);
        return $this->request_statistics->execute();
    }

    public function exchange_info(): array {
        return $this->request_exchange_info->execute();
    }

    public function time(): int {
        return $this->request_time->execute();
    }

    public function ping(): bool {
        return $this->request_ping->execute();
    }

}
