<?php declare(strict_types=1);

namespace QuasarSource\CodeGeneration;

use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class CodeSpawnerHTML
 * @package QuasarSource\CodeGeneration
 */
final class CodeSpawnerHTML {

    /** @var array $html */
    private $html = [];

    /**
     * @return CodeSpawnerHTML
     */
    public static function spawn(): CodeSpawnerHTML {
        return new self();
    }

    /**
     * @return CodeSpawnerHTML
     */
    public function indent(): CodeSpawnerHTML {
        $num_lines = count($this->html);
        for ($c = 0; $c < $num_lines; $c++) {
            $this->html[$c] = "\t" . $this->html[$c];
        }
        return $this;
    }

    /**
     * @return array
     */
    public function get_contents(): array {
        return $this->html;
    }

    /**
     * @param  string $name
     * @param  string $content
     * @return CodeSpawnerHTML
     */
    public function meta(string $name, string $content): CodeSpawnerHTML {
        return $this->add('<meta name="' . $name . '" content="' . $content . '">');
    }

    /**
     * @param  string $manifest
     * @return CodeSpawnerHTML
     */
    public function manifest(string $manifest): CodeSpawnerHTML {
        return $this->add('<link rel="manifest" href=\'data:application/manifest+json,' . $manifest . '\'/>');
    }

    /**
     * @param  string $title
     * @return CodeSpawnerHTML
     */
    public function title(string $title): CodeSpawnerHTML {
        return $this->add('<title>' . $title . '</title>');
    }

    /**
     * @param  string $title
     * @return CodeSpawnerHTML
     */
    public function style(string $title): CodeSpawnerHTML {
        return $this->add('<style>' . $title . '</style>');
    }

    /**
     * @param  string $html_code
     * @return CodeSpawnerHTML
     */
    private function add(string $html_code): CodeSpawnerHTML {
        if (STR::ends_in($html_code, PHP_EOL)) {
            $this->html[] = $html_code;
        } else {
            $this->html[] = $html_code . PHP_EOL;
        }
        return $this;
    }

}
