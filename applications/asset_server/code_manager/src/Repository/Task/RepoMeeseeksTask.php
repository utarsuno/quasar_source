<?php declare(strict_types=1);

namespace CodeManager\Repository\Task;

use CodeManager\Entity\Task\EntityMeeseeksTask;
use CodeManager\Repository\Abstractions\QueryableRepo;

/**
 * Class RepoMeeseeksTask
 * @package CodeManager\Repository\CodeManager
 */
class RepoMeeseeksTask extends QueryableRepo {

    /**
     * @param  string $description
     * @param  int    $num_hours_from_now
     * @return EntityMeeseeksTask
     */
    public function create_new_task(string $description, int $num_hours_from_now): EntityMeeseeksTask {
        $task = EntityMeeseeksTask::spawn($description)
            ->set_iteration(0)
            ->set_iterations_needed(1);
        $task->set_to_due_in_delta_time(60 * 60 * $num_hours_from_now);
        return $task;
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
