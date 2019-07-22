<?php declare(strict_types=1);

namespace QuasarSource\Utils\Process;

use CodeManager\Enum\ProjectParameterKeys\Path;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\DataType\UtilsString    as STR;
use QuasarSource\Utils\DataType\UtilsArray     as ARY;
use QuasarSource\Utils\SystemOS\UtilsSystem    as SYS;

/**
 * Class ProcessDoctrine
 * @package QuasarSource\Utils\Process\Doctrine
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
        $mapping_okay = TEXT_LINES::does_line_after_pattern_contain_text($output, ['Mapping', '-------'], '[OK]');
        if ($mapping_okay) {
            $schema_okay = TEXT_LINES::does_line_after_pattern_contain_text($output, ['Database', '--------'], '[OK]');
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
        $p = new ProcessDoctrine(self::ROUTINE_SCHEMA_UPDATE, true);
        return $p->get_output();
    }

    /**
     * @return ProcessDoctrine
     */
    public static function execute_update_and_return_object(): ProcessDoctrine {
        return new ProcessDoctrine(self::ROUTINE_SCHEMA_UPDATE, true);
    }

    /**
     * @return array
     */
    public static function execute_create(): array {
        $p = new ProcessDoctrine(self::ROUTINE_SCHEMA_CREATE, true);
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
        } else if ($command === self::ROUTINE_SCHEMA_UPDATE || $command === self::ROUTINE_SCHEMA_CREATE) {
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
