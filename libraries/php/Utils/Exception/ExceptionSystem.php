<?php declare(strict_types=1);

namespace QuasarSource\Utils\Exception;

use Symfony\Component\Console\Exception\RuntimeException;

class ExceptionSystem extends RuntimeException {

    /**
     * @param string $function_name
     * @param string $error
     * @return ExceptionSystem
     */
    public static function file_exception(string $function_name, string $error): ExceptionSystem {
        return new self(sprintf('Function{%s} had error {%s}', $function_name, $error));
    }

}