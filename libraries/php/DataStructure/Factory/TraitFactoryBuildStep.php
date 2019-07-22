<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\Factory;

use QuasarSource\DataStructure\BuildStep\BuildStep;
use QuasarSource\Utils\DataType\Object\UtilsObject;
use QuasarSource\Utils\DataType\UtilsArray  as ARY;
use QuasarSource\Utils\DataType\UtilsString as STR;
use RuntimeException;
use Throwable;

/**
 * Trait TraitFactoryBuildStep
 * @package QuasarSource\DataStructure\Factory
 */
trait TraitFactoryBuildStep {

    /** @var BuildStep $build_step */
    protected $build_step;

    /**
     * @param  string $name
     * @return BuildStep
     */
    public function generate_build_step(string $name): BuildStep {
        $step             = new BuildStep($name);
        $function_names   = UtilsObject::get_functions($this, 'build_step');
        $build_steps_data = [];
        $callback_types   = ['on_passed', 'on_failed'];
        foreach ($function_names as $name) {
            $step_num = STR::remove($name, 'build_step');
            if (STR::has_underscore($step_num)) {
                [$step_num, $description] = STR::remove_char_and_split($step_num, '_');
            } else {
                throw new RuntimeException('Invalid build step function naming syntax! {' . $name . '}');
            }
            if (ARY::is_key_missing($build_steps_data, $step_num)) {
                $build_steps_data[$step_num] = [null, null, null, $description];
            }
            // 0 --> callback, 1 --> callback_on_passed, 2 --> callback_on_failed
            $build_steps_data[$step_num][STR::get_match_index($description, $callback_types)] = [$this, $name];
        }
        // TODO: Only perform the out of order safety checks in DEV and QA, not in PROD.
        $index = null;
        foreach ($build_steps_data as $step_num => $callbacks) {
            $current_index = (int) $step_num;
            if ($index !== null && $index > $current_index) {
                throw new RuntimeException('Build steps are not in the correct order!');
            }
            $index = $current_index;
            // $callbacks[3] --> the description
            $step->add_sub_step($callbacks[0], $callbacks[3], $callbacks[1], $callbacks[2]);
        }
        $callback_types   = null;
        $build_steps_data = null;
        $function_names   = null;
        $this->build_step = $step;
        return $this->build_step;
    }

    /**
     * @param  int $n
     * @throws Throwable
     */
    public function run_build_step_n(int $n): void {
        if ($this->build_step === null) {
            $this->generate_build_step(static::class);
        }
        $this->build_step->run_step($n);
    }
}
