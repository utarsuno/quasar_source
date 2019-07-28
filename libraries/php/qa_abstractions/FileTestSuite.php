<?php declare(strict_types=1);

namespace QuasarSource\QualityAssurance;
#use PHPUnit\Framework\TestCase;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

#abstract class FileTestSuite extends TestCase {
abstract class FileTestSuite extends WebTestCase {

    protected $class_to_test;
    private $function_to_test;

    protected function set_function_to_test(string $function_name): void {
        $this->function_to_test = $this->class_to_test . '::' . $function_name;
    }

    protected function assert_positive_and_negative_scenarios(string $function_name, array $scenarios_positive, array $scenarios_negative): void {
        $this->set_function_to_test($function_name);
        $this->assert_positive_scenarios($scenarios_positive);
        $this->assert_negative_scenarios($scenarios_negative);
    }

    protected function assert_equals_scenarios(string $function_name, array $scenarios): void {
        $this->set_function_to_test($function_name);
        foreach ($scenarios as $scenario) {
            $expected = array_shift($scenario);
            $this->assertSame($expected, call_user_func_array($this->function_to_test, $scenario));
        }
    }

    protected function assert_positive_scenarios(array $scenarios): void {
        foreach ($scenarios as $scenario) {
            $this->assertTrue(call_user_func_array($this->function_to_test, $scenario));
        }
    }

    protected function assert_negative_scenarios(array $scenarios): void {
        foreach ($scenarios as $scenario) {
            $this->assertFalse(call_user_func_array($this->function_to_test, $scenario));
        }
    }

}
