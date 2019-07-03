<?php declare(strict_types=1);

namespace CodeManager\Command\Prepared;
use QuasarSource\Utilities\Exception\LogicException;
use Symfony\Component\Console\Command\Command;
use QuasarSource\Utilities\UtilsString as STR;

/**
 * Class DBSchemaValidate
 * @package CodeManager\Command\Prepared
 */
class DBSchemaValidate extends PreparedCommand {

    /** @var bool */
    private $is_healthy_mapping;
    /** @var bool */
    private $is_healthy_schema;

    /**
     * @param Command $command
     */
    public function __construct(Command $command) {
        parent::__construct($command);
    }

    /**
     * @throws LogicException
     */
    protected function on_command_completed(): void {
        #if ($this->exit_code !== 0) {
        #    DBG::throw_exception('DB Health CMD had non 0 exit code{' . $this->exit_code . '} with output {' . $this->results . '}');
        #}

        $output = STR::split_into_non_empty_lines($this->results);

        if (count($output) !== 6) {
            throw LogicException::invalid_function_call('on_command_completed', 'DB Check has invalid output<<' . json_encode($output) . '>>');
        }

        $this->is_healthy_mapping = STR::has($output[2], '[OK]');
        $this->is_healthy_schema  = STR::has($output[5], '[OK]');
    }

    public function is_healthy_schema(): bool {
        return $this->is_healthy_schema;
    }

    public function is_healthy_mapping(): bool {
        return $this->is_healthy_mapping;
    }
}
