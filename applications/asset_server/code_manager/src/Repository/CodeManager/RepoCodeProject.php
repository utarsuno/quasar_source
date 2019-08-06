<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityCodeProcedure;
use CodeManager\Entity\CodeManager\EntityCodeProject;
use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Repository\File\RepoDirectory;
use QuasarSource\Utils\SystemOS\UtilsSystem as SYS;

/**
 * Class RepoCodeProject
 * @package CodeManager\Repository\CodeManager
 */
class RepoCodeProject extends QueryableRepo {

    /** @var array $projects_fetched */
    private $projects_fetched = [];

    /** @var RepoDirectory $repo_dir */
    private $repo_dir;

    /** @var RepoCodeProcedure */
    private $repo_procedure;

    /**
     * @return EntityCodeProject
     */
    public function get_current_build_project(): EntityCodeProject {
        return $this->get_project_by_name(SYS::get_env('BUILD_PROJECT'));
    }

    /**
     * @param  string $name
     * @return EntityCodeProject
     */
    public function get_project_by_name(string $name): EntityCodeProject {
        /** @var EntityCodeProject $project */
        $project = $this->findOneBy(['name_full' => $name]);

        if (!in_array($name, $this->projects_fetched, true)) {
            $this->projects_fetched[] = $name;
            $this->health_check_project_paths($project);
        }

        return $project;
    }

    /**
     * @param  EntityCodeProject $project
     * @return array
     */
    public function get_project_procedures(EntityCodeProject $project): array {
        return $this->repo_procedure->get_all_procedures_for_project($project->getID());
    }

    /**
     * @param EntityCodeProject $project
     */
    private function health_check_project_paths(EntityCodeProject $project): void {
        $project->cache_directories($this->repo_dir);
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {
        $this->repo_dir       = $this->db_service->get_repo(EntityDirectory::class);
        $this->repo_procedure = $this->db_service->get_repo(EntityCodeProcedure::class);
    }
}
