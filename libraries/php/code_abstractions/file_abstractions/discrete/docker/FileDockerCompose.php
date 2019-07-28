<?php declare(strict_types=1);

namespace QuasarSource\CodeAbstractions\File\Discrete\Docker;

use QuasarSource\CodeAbstractions\CodeAbstractions\CodeSegments\CodeSegments;
use QuasarSource\CodeAbstractions\File\Discrete\ConfigAndText\FileYAML;
use QuasarSource\Utils\DataType\UtilsString as STR;
use QuasarSource\Utils\File\UtilsFile       as UFO;

class FileDockerCompose extends FileYAML {

    protected function load_contents() {
        return 'TODO!!!!!';
        #return Yaml::parseFile($this->getFullPath());
    }

    private function temp_get_parsed_lines(array $file_lines) : CodeSegments {
        $segments = new CodeSegments();
        foreach ($file_lines as $line) {
            if (trim($line) === '') {
                $segments->add_empty_line();
            } else if (STR::starts_with(trim($line), '#')) {
                $segments->add_comment($line);
            } else {
                $segments->add_line($line);
            }
        }
        return $segments;
    }

    private function perform_clean(CodeSegments $segments): void {
        $version  = $segments->get_line_with_text("version: '3.7'");
        $services = $segments->get_line_with_text('services:');

        $segments->remove_all_before($services);
        $segments->add_comment('# Services collectively make up a distributed application. (0x1)', true);
        $segments->add_empty_line(true);
        $segments->add_line("version: '3.7'", true);
        $segments->add_comment("# {'Compose file format': 3.7, 'Docker Engine release': 18.06.0*} (0x0)", true);
        
        $lines     = $segments->get_segments();
        $file_text = '';
        foreach ($lines as $line) {
            $file_text .= $line;
        }
        #echo $file_text;

        UFO::set($this->get_path_full(), $file_text);
    }

    public function clean(): void {
        var_dump('TODO: CLEAN DOCKER FILE!');
        #var_dump($this);

        $lines = $this->get_lines();

        $code_segments = $this->temp_get_parsed_lines($lines);
        $this->perform_clean($code_segments);

        //die();
    }
}
