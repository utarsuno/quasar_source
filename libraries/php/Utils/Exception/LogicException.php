<?php declare(strict_types=1);

namespace QuasarSource\Utils\Exception;
use Symfony\Component\Console\Exception\RuntimeException;

class LogicException extends RuntimeException {

    /**
     * @param string $function_name
     * @param string $reason
     * @return LogicException
     */
    public static function invalid_function_call(string $function_name, string $reason): LogicException {
        return new self(sprintf('Function{%s} should not have been called because{%s}.', $function_name, $reason));
    }

}