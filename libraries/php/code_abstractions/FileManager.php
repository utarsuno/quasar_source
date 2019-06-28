<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 15:58
 */

namespace QuasarSource\CodeAbstractions;

use QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText\FileLicense;
use QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText\FileMarkDown;
use QuasarSource\CodeAbstractions\File\Discrete\Docker\FileDockerCompose;
use QuasarSource\CodeAbstractions\File\Discrete\Docker\FileDockerIgnore;
use QuasarSource\CodeAbstractions\File\Discrete\GIT\FileGITIgnore;
use QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText\FileYAML;
use QuasarSource\CodeAbstractions\File\Discrete\JS\FileESLint;
use QuasarSource\CodeAbstractions\File\Discrete\JS\FileJavascript;
use QuasarSource\CodeAbstractions\File\Discrete\PHP\FilePHP;
use QuasarSource\CodeAbstractions\File\Discrete\System\FileDS_Store;
use QuasarSource\CodeAbstractions\File\FileText;
use QuasarSource\Utilities\File\PathUtilities as UPO;
use QuasarSource\Utilities\StringUtilities    as STR;
use QuasarSource\CodeAbstractions\Directory\DirectoryInstance;


class FileManager {

    private static $manager;
    private $base_dir;

    private function __construct() {
        $this->base_dir = new DirectoryInstance('quasar_source');
    }

    private static function get_instance() : FileManager {
        if (self::$manager === null) {
            self::$manager = new FileManager();
        }
        return self::$manager;
    }

    public static function get_file_contents(string $todo) {
        $manager = self::get_instance();

        $file = $manager->base_dir->get_file($todo);

        #L::ll('TODO: get contents for', $todo);

        #echo gettype($file) . PHP_EOL;

        return $file->get_contents();
    }

    public static function get_file_instance(string $path) {

    }

    public function get_root_directory() : DirectoryInstance {
        return $this->base_dir;
    }

    public static function get_base_directory() : DirectoryInstance {
        $manager = self::get_instance();
        return $manager->get_root_directory();
    }

    public static function get_needed_file_class_type(string $file_path, DirectoryInstance $parent_directory) : ?FileAbstraction {
        $extension = UPO::get_ending_extension($file_path);
        $path      = STR::remove($file_path, $extension);

        if ($path === null || $path === '') {
            // --------------------------------------------------------------------------------------------------
            switch ($extension) {
                case '.dockerignore':
                    return new FileDockerIgnore($path, $extension, $parent_directory);
                case '.gitignore':
                    return new FileGITIgnore($path, $extension, $parent_directory);
                case '.DS_Store':
                    return new FileDS_Store($path, $extension, $parent_directory);
            }
            if ($extension !== '.dockerenv') {
                return new FileText($path, $extension, $parent_directory);
            }
            // --------------------------------------------------------------------------------------------------
        } else if ($extension === '.yml' || $extension === '.yaml') {
            // --------------------------------------------------------------------------------------------------
            if (STR::has($path, 'docker-compose')) {
                return new FileDockerCompose($path, $extension, $parent_directory);
            }
            return new FileYAML($path, $extension, $parent_directory);
            // --------------------------------------------------------------------------------------------------
        } else if ($extension === '.js') {
            // --------------------------------------------------------------------------------------------------
            if (STR::has($path, 'eslintrc')) {
                return new FileESLint($path, $extension, $parent_directory);
            }
            return new FileJavascript($path, $extension, $parent_directory);
            // --------------------------------------------------------------------------------------------------
        } else if ($extension === '.php') {
            // --------------------------------------------------------------------------------------------------
            return new FilePHP($path, $extension, $parent_directory);
            // --------------------------------------------------------------------------------------------------
        } else if ($extension === '.md') {
            // --------------------------------------------------------------------------------------------------
            return new FileMarkDown($path, $extension, $parent_directory);
            // --------------------------------------------------------------------------------------------------
        } else if ($extension === null || $extension === '') {
            // --------------------------------------------------------------------------------------------------
            if ($path === 'LICENSE') {
                return new FileLicense($path, $extension, $parent_directory);
            }
            return new FileLicense($path, $extension, $parent_directory);
            // --------------------------------------------------------------------------------------------------
        }

        return null;
    }
}
