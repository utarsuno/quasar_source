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

    private const PATH_BASE           = '/quasar_source/var/quality_assurance/';

    private const PATH_GZIP_PRE       = self::PATH_BASE . 'pre_gzipped.css';
    private const PATH_GZIP_POST      = self::PATH_BASE . 'post_gzipped.css.gz';

    private const PATH_CSS_PRE        = self::PATH_BASE . 'pre_minified.css';
    private const PATH_CSS_POST       = self::PATH_BASE . 'post_minified.css';

    private const PATH_HTML_PRE       = self::PATH_BASE . 'pre_minified.html';
    private const PATH_HTML_POST      = self::PATH_BASE . 'post_minified.html';

    private const PATH_YAML           = self::PATH_BASE . 'simple.yml';

    private const EXPECTED_HASH_VALUE = '3b6b48176efe4725e6f069efc0926be0e4185a4f4e8a1e0702a5ebfe34d4031ac3f1489033f0a578c1e4759bfa90145431276d76e3d00ef66bffc2ecb03b6449';

    private function assert_compression(string $base_path, string $output_path, float $minimum_allowed_compression_achieved): void {
        $size_original = (float) UFO::get_size($base_path);
        $size_modified = (float) UFO::get_size($output_path);

        // Assert desired minimum compression ratio.
        $this->assertLessThan(1.0 - $minimum_allowed_compression_achieved, $size_modified / $size_original);

        // Clean-up.
        UFO::delete($output_path);
    }

    public function test_minify_html(): void {
        UFO::minify_html(self::PATH_HTML_PRE, self::PATH_HTML_POST);
        $this->assert_compression(self::PATH_HTML_PRE, self::PATH_HTML_POST, 0.30);
    }

    public function test_minify_css(): void {
        UFO::minify_css(self::PATH_CSS_PRE, self::PATH_CSS_POST);
        $this->assert_compression(self::PATH_CSS_PRE, self::PATH_CSS_POST, 0.60);
    }

    public function test_gzip(): void {
        UFO::gzip(self::PATH_GZIP_PRE, self::PATH_GZIP_POST);
        $this->assert_compression(self::PATH_GZIP_PRE, self::PATH_GZIP_POST, 0.35);
    }

    public function test_get_sha512sum(): void {
        $this->assertSame(self::EXPECTED_HASH_VALUE, UFO::get_sha512sum(self::PATH_CSS_PRE));
    }

    public function test_matches_sha512sum(): void {
        $this->assertTrue(UFO::matches_sha512sum(self::PATH_CSS_PRE, self::EXPECTED_HASH_VALUE));
    }

    public function test_get_size(): void {
        $this->assertSame(
            2107,
            UFO::get_size(self::PATH_CSS_PRE)
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
            UFO::get_yaml_contents(self::PATH_YAML)
        );
    }

}
