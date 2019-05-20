<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:29
 */

namespace QuasarSource\Utilities\Exceptions;
use Symfony\Component\Console\Exception\RuntimeException;

abstract class ExceptionUtilities {

    /**
     * @param string $message
     * @param null $exception
     * @throws RuntimeException
     */
    public static function throw_exception(string $message, $exception=null): void {
        throw new RuntimeException($message, 0, $exception);
    }

    /**
     * @param string $missing_section
     * @throws ExceptionInvalidConfigurationFile
     */
    public static function throw_exception_config_file(string $missing_section): void {
        throw new ExceptionInvalidConfigurationFile('Section' . $missing_section. '} missing from config file');
    }

}