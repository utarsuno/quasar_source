<?php declare(strict_types=1);

namespace QuasarSource\Utils\RequestsHTTP\Binance\Traits\Params;

trait ParameterStartFromID {

    public function param_set_from_id(int $from_id): void {
        $this->param_set('fromId', $from_id);
    }

}
