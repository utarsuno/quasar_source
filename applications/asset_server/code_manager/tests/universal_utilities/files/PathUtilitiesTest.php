<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-27
 * Time: 22:21
 */

namespace CodeManager\Tests;
use QuasarSource\QualityAssurance\FileTestSuite;
use QuasarSource\Utilities\File\UtilsPath       as PATH;
use QuasarSource\Utilities\DataType\UtilsString as STR;


class PathUtilitiesTest extends FileTestSuite {

    private const DATA          = '/a/b/c';
    private const RELATIVE_TEST = 'tests/universal_utilities/files/PathUtilitiesTest.php';
    private const RELATIVE_BASE = 'applications/asset_server/code_manager/';

    private $app;
    private $relative_path;

    public function setUp() {
        /*
        $kernel = new AppKernel('test', true);
        $kernel->boot();
        $this->app = new Application();
        $this->app->setAutoExit(false);

        $this->relative_path = $this->app->getKernel()
        */

        $a = static::$kernel->getContainer()->getParameter('PATH_RELATIVE_PROJECT_CONFIGS');
        var_dump('PATH RELATIVE PROJECT CONFIGS IS {' . $a . '}');
    }

    /*
    public function test_remove_layer(): void {
        // Positive cases.
        $this->assertSame('/a/b/', PATH::remove_layer(self::DATA));
        $this->assertSame('/a/b/', PATH::remove_layer(self::DATA . '/'));
        $this->assertSame('/', PATH::remove_layer('/a'));
        $this->assertSame('/', PATH::remove_layer('/'));
    }

    public function test_get(): void {
        $dir_base         = STR::remove(__FILE__, self::RELATIVE_BASE . self::RELATIVE_TEST);
        $dir_asset        = $dir_base  . 'applications/asset_server/';
        $dir_node         = $dir_asset . 'js/';
        $dir_code_manager = $dir_asset . 'code_manager/';

        // Positive cases.
        $this->sub_test_get($dir_base, PATH::PROJECT_BASE);
        $this->sub_test_get($dir_base . 'configs/code_manager.yml', PATH::PROJECT_CONFIG);
        $this->sub_test_get($dir_asset, PATH::ASSET_DIR);
        $this->sub_test_get($dir_node, PATH::NODE_DIR);
        $this->sub_test_get($dir_node . 'minify_html_file.js', getenv('PATH_RELATIVE_NODE_MINIFY_HTML'));
        $this->sub_test_get($dir_node . 'minify_css_file.js', getenv('PATH_RELATIVE_NODE_MINIFY_CSS'));
        $this->sub_test_get($dir_node . 'minify_js_file.js', getenv('PATH_RELATIVE_NODE_MINIFY_CSS'));
        $this->sub_test_get($dir_code_manager, PATH::CODE_MANAGER);
        $this->sub_test_get($dir_code_manager . 'composer.phar', PATH::COMPOSER);
        $this->sub_test_get($dir_code_manager . 'report.xml', PATH::QA_REPORT);
        $this->sub_test_get($dir_code_manager . self::RELATIVE_TEST, PATH::TEST_PATH_UTILITIES);
    }

    private function sub_test_get(string $expected, int $key): void {
        $this->assertSame($expected, PATH::get($key));
    }*/

}

