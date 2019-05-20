<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-24
 * Time: 16:16
 */

namespace QuasarSource\Utilities\Files;
use Exception;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\PathUtilities           as UPO;
use QuasarSource\Utilities\Processes\ProcessUtilities    as RUN;
use Symfony\Component\Yaml\Yaml;


abstract class FileUtilities {

    public const EXTENSION_JS              = '.js';
    public const EXTENSION_C               = '.c';
    public const EXTENSION_CPP             = '.cpp';
    public const EXTENSION_HEADER          = '.h';
    public const EXTENSION_WEB_MANIFEST    = '.webmanifest';
    public const EXTENSION_YAML            = '.yml';
    public const EXTENSION_SHADER_VERTEX   = '.vert';
    public const EXTENSION_SHADER_FRAGMENT = '.frag';
    public const EXTENSION_JSON            = '.json';
    public const EXTENSION_CSS             = '.css';
    public const EXTENSION_XML             = '.xml';
    public const EXTENSION_HTML            = '.html';
    public const EXTENSION_MINIFIED        = '.min';
    public const EXTENSION_GZIPPED         = '.gz';

    private const HASH_ALGORITHM           = 'sha512';

    public static function is_valid(string $path) : bool {
        return is_file($path);
    }

    /**
     * Return a boolean indicating if the file's sha512sum matches the provided one to check against.
     *
     * @param string $path      < The path to the file to get a sha512sum from. >
     * @param string $sha512sum < A provided hash value to check against.       >
     * @return bool             < True if matched.                              >
     * @throws Exception
     */
    public static function matches_sha512sum(string $path, string $sha512sum) : bool {
        UPO::is_valid($path, true);
        return hash_file(self::HASH_ALGORITHM, $path) === $sha512sum;
    }

    /**
     * Return the sha512sum of a file as a string hex number.
     *
     * @param string $path < The path to the file to get a hash value for. >
     * @return string      < Hex digits.                                   >
     * @throws Exception
     */
    public static function get_sha512sum(string $path): string {
        UPO::is_valid($path, true);
        return hash_file(self::HASH_ALGORITHM, $path);
    }

    /**
     * Return the size (in bytes) of the file provided.
     *
     * @param string $path < The path to the file to get size of. >
     * @return int         < The number of bytes used by file.    >
     * @throws Exception
     */
    public static function get_size(string $path): int {
        UPO::is_valid($path, true);
        return filesize($path);
    }

    /**
     * Take the contents of the provided CSS file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified CSS file at.   >
     * @throws Exception
     */
    public static function minify_css(string $path_base, string $path_output): void {
        UPO::is_valid($path_base, true);
        RUN::minify_file_css_to($path_base, $path_output);
    }

    /**
     * Take the contents of the provided HTML file and create a minified version at provided output path.
     *
     * @param string $path_base   < The path to the CSS file to get contents of. >
     * @param string $path_output < The path to create a minified HTML file at.  >
     * @throws Exception
     */
    public static function minify_html(string $path_base, string $path_output): void {
        UPO::is_valid($path_base, true);
        RUN::minify_file_html_to($path_base, $path_output);
    }

    /**
     * Take the contents of the provided file and create a gzipped version at provided output path.
     *
     * @param string $path_base   < The path to the file to get contents of. >
     * @param string $path_output < The path to create a gzipped file at.    >
     * @throws Exception
     */
    public static function gzip(string $path_base, string $path_output): void {
        UPO::is_valid($path_base, true);
        RUN::gzip_file_to($path_base, $path_output);
    }

    public static function delete(string $path): void {
        if (UPO::is_valid($path)) {
            unlink($path);
        }
    }

    /**
     * Returns the contents of a YAML file as an association array.
     *
     * @param string $path < The path to the (yml/yaml) file to get contents of. >
     * @return array       < An association array of the file's contents.        >
     * @throws Exception
     */
    public static function get_yaml_contents(string $path): array {
        UPO::is_valid($path, true);
        return Yaml::parseFile($path);
    }

    public static function get_json_contents(string $path) {
        UPO::is_valid($path, true);
        return json_decode(file_get_contents($path));
    }

    public static function get_css_minified_contents(string $path): string {
        $contents  = self::get_contents_as_list($path);
        $num_lines = count($contents);
        if ($num_lines > 1) {
            DBG::throw_exception('File{' . $path . '} has more than 1 line of code!');
        } else if ($num_lines === 0) {
            DBG::throw_exception('File{' . $path . '} has no contents!');
        }
        return $contents[0];
    }

    public static function create_or_overwrite_file(string $path, string $contents): void {
        $f = fopen($path, 'wb');
        fwrite($f, $contents);
        fclose($f);
    }

    public static function set_contents(string $path, string $contents): void {
        UPO::is_valid($path, true);
        file_put_contents($path, $contents, LOCK_EX);
    }

    public static function get_contents_as_list(string $path): array {
        UPO::is_valid($path, true);
        $file_lines = [];
        $lines      = file($path);
        foreach ($lines as $line) {
            $file_lines[] = $line;
        }
        return $file_lines;
    }

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     * @param string $path
     * @return mixed
     * @throws Exception
     */
    public static function parse_xml_contents(string $path) {
        UPO::is_valid($path, true);

        $elements = array();  // the currently filling [child] XmlElement array
        $stack    = array();
        $values   = [];
        $index    = [];
        $parser   = xml_parser_create();
        # xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
        xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
        xml_parse_into_struct($parser, file_get_contents($path), $values, $index);
        xml_parser_free($parser);

        foreach ($values as $tag) {
            $index            = count($elements);
            $tag_type         = $tag['type'];
            $tag_type_is_open = $tag_type === 'open';

            if ($tag_type === 'complete' || $tag_type_is_open) {
                $elements[$index] = new XMLElement();
                $elements[$index]->name = $tag['tag'];
                if (isset($tag['attributes'])) {
                    $elements[$index]->attributes = $tag['attributes'];
                }
                if (isset($tag['value'])) {
                    $elements[$index]->content = $tag['value'];
                }
                if ($tag_type_is_open) {  // push
                    $elements[$index]->children = array();
                    $stack[count($stack)] = &$elements;
                    $elements = &$elements[$index]->children;
                }
            }
            if ($tag_type === 'close') {  // pop
                $elements = &$stack[count($stack) - 1];
                unset($stack[count($stack) - 1]);
            }
        }

        return $elements[0];  // the single top-level element
    }

}

