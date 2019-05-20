<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\Files\FileUtilities as UFO;


class FileUtilitiesTest extends FileTestSuite {

    private const PATH_TEST_FILE      = '/quasar_source/var/quality_assurance/pre_minified.css';
    private const PATH_TEST_FILE_YAML = '/quasar_source/var/quality_assurance/simple.yml';

    private const EXPECTED_HASH_VALUE = '3b6b48176efe4725e6f069efc0926be0e4185a4f4e8a1e0702a5ebfe34d4031ac3f1489033f0a578c1e4759bfa90145431276d76e3d00ef66bffc2ecb03b6449';

    public function test_get_sha512sum(): void {
        $this->assertSame(self::EXPECTED_HASH_VALUE, UFO::get_sha512sum(self::PATH_TEST_FILE));
    }

    public function test_matches_sha512sum(): void {
        $this->assertTrue(UFO::matches_sha512sum(self::PATH_TEST_FILE, self::EXPECTED_HASH_VALUE));
    }

    public function test_get_size(): void {
        $this->assertSame(
            2107,
            UFO::get_size(self::PATH_TEST_FILE)
        );
    }

    public function test_get_yaml_contents(): void {
        $test_file_contents = [
            'section_a' => ['a', 'b', 'c'],
            'section_b' => ['hello' => ['world' => [
                ['more' => 'contents', 'are' => 'here'],
                ['sample' => 'text']
            ]]]
        ];

        $this->assertSame(
            $test_file_contents,
            UFO::get_yaml_contents(self::PATH_TEST_FILE_YAML)
        );
    }

}
