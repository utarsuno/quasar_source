<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:46
 */
namespace CodeManager\Command;

use CodeManager\Service\CodeBuilderService;
use CodeManager\Service\DBService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Class CodeHealthCheckCommand
 * @package CodeManager\Command
 */
class CodeHealthCheckCommand extends Command {

    public const COMMAND_NAME = 'code:health_check';

    /** @var CodeBuilderService */
    private $code_builder;

    /**
     * CodeHealthCheckCommand constructor.
     * @param CodeBuilderService $code_builder
     */
    public function __construct(CodeBuilderService $code_builder) {
        parent::__construct();
        $this->code_builder = $code_builder;
    }

    protected function configure(): void {
        $this->setName(self::COMMAND_NAME)
            ->setDescription('Runs a code health check.')
            ->setHelp('Runs a health check across all files and settings for the all local code files in this project.');
    }

    /**
     * Executes the current command.
     *
     * This method is not abstract because you can use this class
     * as a concrete class. In this case, instead of defining the
     * execute() method, you set the code to execute by passing
     * a Closure to the setCode() method.
     *
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null null or 0 if everything went fine, or an error code
     *
     * @see setCode()
     */
    protected function execute(InputInterface $input, OutputInterface $output): ?int {
        $this->code_builder->run_code_health_check();

        #var_dump('TODO: run_composer_self_update');
        #$c = RUN::run_composer_self_update();
        #var_dump($c);

        return 0;
    }
}
