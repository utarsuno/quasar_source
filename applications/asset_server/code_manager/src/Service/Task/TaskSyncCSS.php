<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use Exception;

/**
 * Class TaskSyncCSS
 * @package CodeManager\Service\Task
 */
final class TaskSyncCSS extends TaskFile {
    # -------------------------------------------------- T R A I T S ---------------------------------------------------
    # -------------------------------------------------- F I E L D S ---------------------------------------------------
    # --------------------------------------------------- M A G I C ----------------------------------------------------
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @throws Exception
     */
    public function task_execute(): void {
        $assets    = $this->get_directory_assets($this->project);
        $files_css = $assets->get_files_with_extension_name('.css');

        foreach ($files_css as $file) {
            $this->logger->log('Syncing{' . $file . '}');
            $this->repo_file->ensure_file_has_minified_child($file, $this->project->getPathVar());
        }
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------
    # ------------------------------------------------- P R I V A T E --------------------------------------------------
}
