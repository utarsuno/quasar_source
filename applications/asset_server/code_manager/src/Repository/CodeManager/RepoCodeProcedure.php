<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityCodeProcedure;
use CodeManager\Repository\Abstractions\QueryableRepo;

/**
 * Class RepoCodeProcedure
 * @package CodeManager\Repository\CodeManager
 */
class RepoCodeProcedure extends QueryableRepo {

    /**
     * @param  int $project_id
     * @return array
     */
    public function get_all_procedures_for_project(int $project_id): array {
        $entities   = $this->findByAscendingBy('code_project', $project_id, 'smallint0');
        $procedures = [];
        /** @var EntityCodeProcedure $entity */
        foreach ($entities as $entity) {
            $class        = $entity->getTaskClass();
            $task         = new $class();
            $procedures[] = $task;
        }
        return $procedures;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
