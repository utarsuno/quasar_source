<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 17:41
 */

namespace QuasarSource\Utilities\Process\Doctrine;

use CodeManager\Enum\ProjectParameterKeys\Path;
use QuasarSource\Utilities\DataType\UtilsTextLines;
use QuasarSource\Utilities\Process\ProcessRunner;
use QuasarSource\Utilities\DataType\UtilsString as STR;
use QuasarSource\Utilities\DataType\UtilsArray  as ARY;
use QuasarSource\Utilities\SystemOS\UtilsSystem as SYS;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

/**
 * Class ProcessDoctrine
 * @package QuasarSource\Utilities\Process\Doctrine
 */
final class ProcessDoctrine extends ProcessRunner {

    private const ROUTINE_SCHEMA_VALIDATE = 'doctrine:schema:validate';
    private const ROUTINE_SCHEMA_UPDATE   = 'doctrine:schema:update';
    private const ROUTINE_SCHEMA_CREATE   = 'doctrine:schema:create';

    private const CACHED_FLAGS            = ['--no-interaction', '--force', '-vvv', '--complete', '--dump-sql'];

    /**
     * @return array
     */
    public static function execute_validate(): array {
        $p = new ProcessDoctrine('doctrine:schema:validate', true);
        return $p->get_output();
    }

    /**
     * @return array
     */
    public static function execute_validate_checks(): array {
        $output       = self::execute_validate();
        $mapping_okay = UtilsTextLines::does_line_after_pattern_match_contain_sub_text($output, ['Mapping', '-------'], '[OK]');
        if ($mapping_okay) {
            $schema_okay = UtilsTextLines::does_line_after_pattern_match_contain_sub_text($output, ['Database', '--------'], '[OK]');
            if ($schema_okay) {
                return [true, true];
            }
            var_dump('Fix DB schema {' . json_encode($output) . '}');
            return [true, false];
        }
        var_dump('Fix DB mapping {' . json_encode($output) . '}');
        return [false, false];
    }

    /**
     * @return array
     */
    public static function execute_update(): array {
        $p = new ProcessDoctrine('doctrine:schema:update', true);
        return $p->get_output();
    }

    /**
     * @return array
     */
    public static function execute_create(): array {
        $p = new ProcessDoctrine('doctrine:schema:create', true);
        return $p->get_output();
    }

    /** @var string $cmd_cwd */
    private static $cmd_cwd;

    /**
     * ProcessDoctrine constructor.
     * @param string $command
     * @param bool   $auto_run
     */
    private function __construct(string $command, bool $auto_run=false) {
        if (self::$cmd_cwd === null) {
            self::$cmd_cwd = SYS::get_env(Path::DIRECTORY_CODE_MANAGER);
        }
        $cmd = ['php', './bin/console', $command];
        if ($command === self::ROUTINE_SCHEMA_VALIDATE) {
            $cmd[] = '-vvv';
        } else if ($command === self::ROUTINE_SCHEMA_UPDATE) {
            $cmd = ARY::append_values($cmd, self::CACHED_FLAGS);
        } else if ($command === self::ROUTINE_SCHEMA_CREATE) {
            $cmd = ARY::append_values($cmd, self::CACHED_FLAGS);
        }
        parent::__construct($cmd, false, 20, self::$cmd_cwd);
        if ($auto_run) {
            $this->run();
        }
        $err = $this->get_error_output();
        if (count($err) !== 0) {
            throw new \RuntimeException('TODO: investigate{' . json_encode($err) . '}');
        }
    }

    /**
     * @return string|array
     */
    public function get_output() {
        $output = parent::get_output();
        return STR::split_clean($output);
    }

    /**
     * @return string|array
     */
    public function get_error_output() {
        $error = parent::get_error_output();
        return STR::split_clean($error);
    }

}
