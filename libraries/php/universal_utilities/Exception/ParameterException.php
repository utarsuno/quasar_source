<?php declare(strict_types=1);


namespace QuasarSource\Utilities\Exception;
use Symfony\Component\Console\Exception\RuntimeException;


class ParameterException extends RuntimeException {

    /**
     * @param string $parameter_name
     * @param $value_provided
     * @return ParameterException
     */
    public static function invalid_function_parameter(string $parameter_name, $value_provided): ParameterException {
        return new self('Function parameter{' . $parameter_name . '} had invalid value passed to it: {' . $value_provided . '}');
    }

    /**
     * @param string $parameter_name
     * @return ParameterException
     */
    public static function missing_config_parameter(string $parameter_name): ParameterException {
        return new self('Config parameter{' . $parameter_name . '} was missing!');
    }
    
}