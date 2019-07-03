<?php declare(strict_types=1);

namespace QuasarSource\Utilities\FTP;

use QuasarSource\DataStructure\ConnectionState\TraitConnectionState;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\Utilities\UtilsArray  as ARY;
use QuasarSource\Utilities\UtilsSystem as SYS;

/**
 * Class FTPInstance
 * @package QuasarSource\Utilities\FTP
 * @method nlist(string $directory)
 * @method systype()
 */
class FTPInstance {
    use TraitFlagTable;
    use TraitConnectionState;

    private const FLAG_PASSIVE_MODE_ON = 'pasv_mode_on';

    public const FTP_FUNCTIONS = [
        'alloc', 'append', 'cdup', 'chdir', 'chmod', UtilsFTP::FTP_FUNC_CLOSE, UtilsFTP::FTP_FUNC_CONNECT,
        'delete', 'exec', 'fget', 'fput', 'get_option', 'get', UtilsFTP::FTP_FUNC_LOGIN, 'mdtm', 'mkdir', 'mlsd',
        'nb_continue', 'nb_fget', 'nb_fput', 'nb_get', 'nb_put', 'nlist', UtilsFTP::FTP_FUNC_PASV, 'put', 'pwd',
        UtilsFTP::FTP_FUNC_QUIT, 'raw', 'rawlist', 'rename', 'rmdir', 'set_option', 'site', 'size', 'ssl_connect',
        'systype'
    ];

    public const FTP_FUNCTIONS_FORBIDDEN = [
        UtilsFTP::FTP_FUNC_CLOSE, UtilsFTP::FTP_FUNC_QUIT, UtilsFTP::FTP_FUNC_LOGIN, UtilsFTP::FTP_FUNC_CONNECT,
        UtilsFTP::FTP_FUNC_PASV
    ];

    /** @var resource $connection_stream */
    public $connection_stream;

    /** @var string $env_host */
    private $env_host;

    /** @var string $env_host */
    private $env_user;

    /** @var string $env_host */
    private $env_pass;

    /** @var int $env_host */
    private $env_port    = 21;

    /** @var int $env_host */
    private $env_timeout = 5;

    /**
     * FTPInstance constructor.
     * @param bool $auto_connect
     */
    public function __construct(bool $auto_connect=true) {
        [$this->env_host, $this->env_user, $this->env_pass] = SYS::get_envs(['FTP_HOST', 'FTP_USER', 'FTP_PASS']);
        $this->env_port    = SYS::env_exists('FTP_PORT') ? SYS::get_env_as_int('FTP_PORT') : $this->env_port;
        $this->env_timeout = SYS::env_exists('FTP_TIMEOUT') ? SYS::get_env_as_int('FTP_TIMEOUT') : $this->env_timeout;

        if ($auto_connect) {
            $this->custom_ftp_connect();
            $this->custom_ftp_login();
            $this->custom_ftp_pasv(true);
        }
    }

    public function __destruct() {
        $this->custom_ftp_close();
    }

    /**
     * @param $func
     * @param $a
     * @return mixed
     */
    public function __call($func, $a) {
        $func = 'ftp_' . $func;
        if(function_exists($func) && ARY::is_missing(self::FTP_FUNCTIONS_FORBIDDEN, $func)) {
            array_unshift($a, $this->connection_stream);
            return call_user_func_array($func, $a);
        }
        die("$func is not a valid FTP function (some are not_allowed to be ran manually)");
    }

    /**
     * @param bool $pasv_on
     * @return bool
     */
    private function custom_ftp_pasv(bool $pasv_on=true): bool {
        ftp_pasv($this->connection_stream, $pasv_on);
        return true;
    }

    /**
     * @return bool
     */
    private function custom_ftp_close(): bool {
        if ($this->is_connected()) {
            return ftp_close($this->connection_stream);
        }
        return true;
    }

    /**
     * @return bool
     */
    private function custom_ftp_login(): bool {
        return ftp_login($this->connection_stream, $this->env_user, $this->env_pass);
    }

    /**
     * @return bool
     */
    private function custom_ftp_connect(): bool {
        $this->connection_stream = ftp_connect($this->env_host, $this->env_port, $this->env_timeout);
        if ($this->is_connected()) {
            return true;
        }
        return false;
    }

    /**
     * @return bool
     */
    private function is_connected(): bool {
        return UtilsFTP::is_resource_a_connected_ftp_stream($this->connection_stream);
    }

}
