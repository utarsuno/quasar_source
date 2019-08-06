<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Entity\CodeManager\EntityCodeProject;
use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Repository\File\RepoDirectory;
use CodeManager\Repository\File\RepoFile;
use CodeManager\Repository\File\RepoFileType;
use CodeManager\Service\CodeBuilderService;
use Exception;

/**
 * Class TaskFile
 * @package CodeManager\Service\Task
 */
abstract class TaskFile extends TaskAbstract {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------
    # -------------------------------------------------- F I E L D S ---------------------------------------------------
    /** @var RepoDirectory $repo_directory */
    protected $repo_directory;

    /** @var RepoFile $repo_file */
    protected $repo_file;

    /** @var RepoFileType $repo_file_type */
    protected $repo_file_type;

    /** @var EntityDirectory $directory_assets */
    protected $directory_assets;

    # --------------------------------------------------- M A G I C ----------------------------------------------------

    public function __destruct() {
        $this->repo_directory   = null;
        $this->repo_file        = null;
        $this->repo_file_type   = null;
        $this->directory_assets = null;
        parent::__destruct();
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------

    /**
     * @throws Exception
     */
    protected function task_prepare(): void {
        $this->repo_directory   = $this->code_builder->get_repo(EntityDirectory::class);
        $this->repo_file        = $this->code_builder->get_repo(EntityFile::class);
        $this->repo_file_type   = $this->code_builder->get_repo(EntityFileType::class);
        $this->directory_assets = $this->repo_directory->get_real($this->project->getPathAssets());
    }

    /**
     * @param  EntityCodeProject $code_project
     * @return EntityDirectory
     * @throws Exception
     */
    protected function get_directory_assets(EntityCodeProject $code_project): EntityDirectory {
        return $this->repo_directory->get_real($code_project->getPathAssets());
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

}
