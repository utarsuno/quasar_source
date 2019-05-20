<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:46
 */

namespace CodeManager\Command;

use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utilities\ArrayUtilities;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities;
use QuasarSource\Utilities\StringUtilities;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;
use QuasarSource\Utilities\Processes\ProcessUtilities as RUN;
use QuasarSource\Utilities\Files\PathUtilities        as PATH;
use QuasarSource\Utilities\StringUtilities            as STR;


class CodeHealthCheckCommand extends Command {

    public const COMMAND_NAME     = 'code:health_check';
    protected static $defaultName = self::COMMAND_NAME;

    private $code_builder;

    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct();
        $this->code_builder = $code_builder;
    }

    protected function configure(): void {
        $this
            ->setDescription('Runs a code health check.')
            ->setHelp('Runs a health check across all files and settings for the all local code files in this project.');
    }

    protected function execute(InputInterface $input, OutputInterface $output) {
        //previous_execute
        $this->code_builder->set_code_builder_command($this);
        $this->code_builder->run_code_health_check();

        #var_dump('TODO: run_composer_self_update');
        #$c = RUN::run_composer_self_update(PATH::get(PATH::COMPOSER));
        #var_dump($c);

        return 0;
    }

    public function update_db_schema(): string {
        $command    = $this->getApplication()->find('doctrine:schema:update');
        $cmd_output = new BufferedOutput();
        $result     = $command->run(
            new ArrayInput(
                [
                    '-vvv'              => null,
                    '--no-interaction'  => null,
                    '--force'           => null
                ]
            ),
            $cmd_output
        );
        #var_dump($result);
        $output = $cmd_output->fetch();
        return $output;
        #$output = STR::split_into_non_empty_lines($output);
        #return $output;
    }

    public function check_db_health(bool & $mapping_healthy, bool & $schema_healthy): void {
        $command    = $this->getApplication()->find('doctrine:schema:validate');
        $cmd_output = new BufferedOutput();
        $result     = $command->run(new ArrayInput([]), $cmd_output);
        #var_dump($result);
        $output = $cmd_output->fetch();
        $output = STR::split_into_non_empty_lines($output);

        if (count($output) !== 6) {
            ExceptionUtilities::throw_exception('DB Check has invalid output<<' . json_encode($output) . '>>');
        }

        $mapping_healthy = STR::contains($output[2], '[OK]');
        $schema_healthy  = STR::contains($output[5], '[OK]');
    }

}
