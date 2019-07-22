<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterSymbol {

    public function param_set_symbol(string $ticker): void {
        $this->param_set('symbol', $ticker);
    }

}
