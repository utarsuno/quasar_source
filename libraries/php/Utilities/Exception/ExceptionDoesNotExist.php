<?php declare(strict_types=1);

namespace QuasarSource\Utilities\Exception;
use Symfony\Component\Console\Exception\RuntimeException;

/**
 * Class InvalidValueProvidedException
 * @package QuasarSource\Utilities\Exception
 */
class ExceptionDoesNotExist extends RuntimeException {

    /**
     * @param string $function_name
     * @param string $reason
     * @return ExceptionDoesNotExist
     */
    public static function exception(string $function_name, string $reason): ExceptionDoesNotExist {
        return new self(sprintf('Function{%s} had error{%s}.', $function_name, $reason));
    }

}