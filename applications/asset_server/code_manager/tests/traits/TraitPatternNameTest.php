<?php

namespace CodeManager\Traits;

use PHPUnit\Framework\TestCase;
use QuasarSource\CommonFeatures\TraitName;


class TraitPatternNameTest extends TestCase {
    use TraitName;

    public function test_trait_pattern_name(): void {
        $name = 'hello world';
        $this->set_name($name);
        $this->assertSame($name, $this->get_name());
        $this->assertSame($name, strval($this));
    }

}
