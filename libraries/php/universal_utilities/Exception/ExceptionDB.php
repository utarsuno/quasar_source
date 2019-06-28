<?php declare(strict_types=1);


namespace QuasarSource\Utilities\Exception;

use Symfony\Component\Console\Exception\RuntimeException;


class ExceptionDB extends RuntimeException {

    /**
     * @param string $error
     * @return ExceptionDB
     */
    public static function doctrine_error(string $error): ExceptionDB {
        return new self('Doctrine error{' . $error . '}');
    }

}