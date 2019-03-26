<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:29
 */

namespace QuasarSource\Utilities;

use Exception;

abstract class ExceptionUtilities {

    /**
     * @param string $message
     * @param null $exception
     * @throws Exception
     */
    public static function throw_exception(string $message, $exception=null) : void {
        echo 'Exception{' . $message . '}' . PHP_EOL;
        if ($exception !== null) {
            echo $exception . PHP_EOL;
        }
        throw new Exception($message);
    }

}