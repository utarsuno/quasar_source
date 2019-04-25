<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 21:56
 */

namespace CodeManager\Service;


use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\FileUtilities;

class CodeBuilderService extends BaseAbstractService {

    private const BUILD_STEP_MINIFY = 1;
    private const BUILD_STEP_GZIP   = 2;

    private $config;
    private $css_builds = [];

    private $service_repo_files;

    public function __construct(LoggerInterface $logger) {
        parent::__construct($logger);
        // TODO: Get rid of hard-coded paths.
        $this->config = (FileUtilities::file_get_yaml_contents('/quasar_source/documentation_and_settings/builds.yml'))['assets'];
    }

    public function run_code_health_check() : void {
        if (array_key_exists('css', $this->config)) {
            $this->log('Ensuring CSS files exist');
            $this->process_assets_css($this->config['css']['files'], $this->config['css']['output_directory']);
        }
    }

    public function set_service_repo_files(EntityFileRepoService $repo_files) : void {
        $this->service_repo_files = $repo_files;
    }

    private function process_assets_css(array $files, string $output_directory) : void {
        foreach ($files as $key => $value) {
            $file_path = '/quasar_source/assets/css/' . $key . '.css';
            $this->css_builds[$file_path] = $value;
        }

        foreach ($this->css_builds as $file => $steps) {
            $this->service_repo_files->ensure_file_is_cached($file);

            foreach ($steps as $step) {
                $this->log('Need to run the following step{' . $step . '}');
            }

        }
    }

}

