<?php declare(strict_types=1); /** @noinspection PhpUndefinedFieldInspection */

namespace QuasarSource\Utilities\RequestsHTTP\Binance\Traits\Params;
use QuasarSource\Utilities\Exception\ParameterException;


trait ParameterOptionalLimit {

    protected $allowed_parameter_limit_values;

    /**
     * Note: default limit is 500
     * @param int $limit
     * @throws ParameterException
     */
    public function param_set_limit(int $limit): void {
        $this->param_set('limit', $this->validated_limit_value($limit));
    }

    /**
     * @param int $limit
     * @return int
     * @throws ParameterException
     */
    private function validated_limit_value(int $limit): int {
        if ($this->allowed_parameter_limit_values !== null && count($this->allowed_parameter_limit_values) !== 0) {
            if (!in_array($limit, $this->allowed_parameter_limit_values, false)) {
                throw ParameterException::invalid_function_parameter('validated_limit_value', $limit);
            }
            return $limit;
        }
        if ($limit <= 0) {
            $limit = 1;
        } else if ($limit > 1000) {
            $limit = 1000;
        }
        return $limit;
    }

}
