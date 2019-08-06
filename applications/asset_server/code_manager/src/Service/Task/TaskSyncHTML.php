<?php declare(strict_types=1);

namespace CodeManager\Service\Task;

use CodeManager\Entity\File\EntityFile;
use Exception;
use QuasarSource\CodeGeneration\CodeSpawnerHTML;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\File\UtilsFile          as UFO;

/**
 * Class TaskSyncHTML
 * @package CodeManager\Service\Task
 */
final class TaskSyncHTML extends TaskFile {

    private const PATTERN_START = '{A U T O   G E N E R A T E D   C O D E}:';
    private const PATTERN_END   = '{E N D}:';

    # https://drafts.csswg.org/css-color/#typedef-color

    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @throws Exception
     */
    public function task_execute(): void {
        $assets     = $this->get_directory_assets($this->project);
        $files_html = $assets->get_files_with_extension_name('.html');

        /** @var EntityFile $file */
        foreach ($files_html as $file) {
            $this->logger->log('Syncing{' . $file . '}');

            if (!$file->hasChild()) {
                $needed_type     = $this->repo_file_type->get_type_as_processed($file);
                $output_path     = $this->project->getPathVar() . $file->get_name_as_type($needed_type);
                $processed_child = $this->process_html_file($file, $output_path);
            } else {
                $processed_child = $file->getChild();
            }

            $minified_child = $this->repo_file->ensure_file_has_minified_child($processed_child, $this->project->getPathVar());
            $this->repo_file->ensure_file_has_gzipped_child($minified_child, $this->project->getPathVar());
        }
    }

    # ----------------------------------------------- P R O T E C T E D ------------------------------------------------

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  EntityFile $file
     * @param  string     $output_path
     * @return EntityFile
     */
    private function process_html_file(EntityFile $file, string $output_path): EntityFile {
        $file_css = $this->repo_file->find_matching_file_with_alt_extension($file, '.css');
        $html     = CodeSpawnerHTML::spawn()
            ->title($this->project->getNameFull())
            ->manifest($this->project->get_web_manifest(true))
            ->style($file_css->getChild()->get_contents(true))
            ->indent()
            ->get_contents();

        $modified_lines = TEXT_LINES::insert_lines_inbetween($file->get_contents(), self::PATTERN_START, self::PATTERN_END, $html);

        UFO::set($output_path, $modified_lines, true);

        return $this->repo_file->create_new_fully_cached_entity_child($file, $this->repo_file_type->get_type_as_processed($file), $output_path);
    }
}
