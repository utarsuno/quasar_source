<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Repository\Abstractions\QueryableRepo;
use QuasarSource\Utils\DataType\UtilsTextLines as TEXT_LINES;
use QuasarSource\Utils\DataType\UtilsString    as STR;
use QuasarSource\Utils\File\UtilsFile          as UFO;
use QuasarSource\Utils\Time\UtilsUnixTime      as TIME;

/**
 * Class RepoCodeBuild
 * @package CodeManager\Repository\CodeManager
 */
class RepoCodeBuild extends QueryableRepo {

    public function sync_to_logs(): void {
        var_dump('Syncing logs');

        $lines         = UFO::get_from_env_path('LOG_FILE');
        $sections      = TEXT_LINES::parse_into_sections($lines, 'CodeBuild start!');
        $section_times = [];

        foreach ($sections as $section) {
            $start_time      = STR::get_text_inbetween_chars($section[0], '[', ']');
            $section_times[] = TIME::parse_string_date($start_time);
        }

        // No CodeBuild entities exist so each build from the log file should be parsed in without extra checks on if duplicate.
        if ($this->is_empty()) {

            var_dump('IS EMPTY');

            $num_sections = count($section_times);
            var_dump('NUM SECTIONS');
            var_dump($num_sections);
            for ($c = 0; $c < $num_sections; $c++) {
                $entity = new EntityCodeBuild();
                $entity->set_timestamp($section_times[$c]);

                $entity->set_logs_session($sections[$c]);
                $this->save($entity, true);
            }
            $this->flush();
        } else {
            var_dump('HANDLE NOT BEING EMPTY!');
            exit();
        }
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
