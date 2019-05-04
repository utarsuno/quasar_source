<?php


namespace CodeManager\Abstractions;
use CodeManager\Service\EntityFileRepoService;
use QuasarSource\Utilities\SimpleTimer;


abstract class AssetBuildSection {

    /** @var string */
    protected $name;

    /** @var string */
    protected $directory_output;

    /** @var string */
    protected $directory_data;

    /** @var array */
    protected $files;

    /** @var SimpleTimer */
    protected $build_time;

    /** @var array */
    protected $file_builds = [];

    public function __construct(string $name, string $directory_data, string $directory_output, array $files) {
        $this->name             = $name;
        $this->directory_output = $directory_output;
        $this->directory_data   = $directory_data;
        $this->files            = $files;
        $this->build_time       = new SimpleTimer(false);

        foreach ($this->files as $key => $value) {
            $file_path                     = $this->directory_data . $key;
            $this->file_builds[$file_path] = $value;
        }
    }

    public function run_build(EntityFileRepoService $repo_service) : void {
        $this->build_time->start();
        $this->process_build_section($repo_service);
        $this->build_time->stop();
    }

    abstract protected function process_build_section(EntityFileRepoService $repo_service) : void;

}