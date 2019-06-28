<?php declare(strict_types=1);

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;


trait ParameterSymbol {

    public function param_set_symbol(string $ticker): void {
        $this->param_set('symbol', $ticker);
    }

}
