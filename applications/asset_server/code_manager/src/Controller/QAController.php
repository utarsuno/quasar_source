<?php declare(strict_types=1);

namespace CodeManager\Controller;

use CodeManager\Service\CodeBuilderService;
use QuasarSource\Utils\Process\UtilsProcess;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;

class QAController {

    /*
    // In code builder.
    public function get_test_hi(): string {
        return 'wow, it freaking works :o';
    }
     */

    public function test_response(CodeBuilderService $code_builder) {
        return new Response('<html><body>' . $code_builder->get_test_hi() . '</body></html>');
    }

    public function run_unit_tests(KernelInterface $kernel) {
        $content = UtilsProcess::run_qa_tests();
        return new Response($content);
    }

}



/*
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;

public function test_response2(KernelInterface $kernel) {
$app = new Application($kernel);
$app->setAutoExit(false);

$input = new ArrayInput([
    #'command' => 'bin/phpunit',
    'command' => 'list',
]);


$input = new ArrayInput([
    #'command' => 'bin/phpunit',
    'command' => 'phpunit',
    // (optional) define the value of command arguments
    '--log-junit' => null,
    // (optional) pass options to the command
    'report.xml' => null,
]);

// You can use NullOutput() if you don't need the output
$output = new BufferedOutput();
$app->run($input, $output);

// return the output, don't use if you used NullOutput()
$content = $output->fetch();



#var_dump($content);

// return new Response(""), if you used NullOutput()
return new Response($content);


$content = ProcessUtilities::run_qa_tests();
return new Response($content);
}
*/