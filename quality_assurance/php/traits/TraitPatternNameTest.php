<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-14
 * Time: 23:27
 */

namespace QuasarSource\Traits;

use PHPUnit\Framework\TestCase;
require_once '/quasar_source/libraries/php/autoload.php';


class TraitPatternNameTest extends TestCase {
    use TraitPatternName;

    public function test_trait_pattern_name() : void {
        $name = 'hello world';
        $this->set_name($name);
        $this->assertSame($name, $this->get_name());
        $this->assertSame($name, strval($this));
    }

}
