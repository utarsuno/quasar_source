<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

use function count;
use Exception;
use QuasarSource\Utils\Exception\ExceptionSystem;
use QuasarSource\Utils\File\UtilsFile;

/**
 * Class XMLUtilities
 * @package QuasarSource\Utils\File\Discrete
 */
final class XMLUtils extends UtilsFile {

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     *
     * @param  string $path [The path of the xml file to get contents of.]
     * @return mixed
     * @throws ExceptionSystem
     */
    public static function get(string $path): array {
        try {
            self::is_valid($path);

            $elements = []; // the currently filling [child] XmlElement array
            $stack    = [];
            $values   = [];
            $index    = [];
            $parser   = xml_parser_create();
            # xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
            xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
            xml_parse_into_struct($parser, file_get_contents($path), $values, $index);
            xml_parser_free($parser);

            foreach ($values as $tag) {
                $index = count($elements);
                $tag_type = $tag['type'];
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
                        $elements[$index]->children = [];
                        $stack[count($stack)] = &$elements;
                        $elements = &$elements[$index]->children;
                    }
                }
                if ($tag_type === 'close') {  // pop
                    $elements = &$stack[count($stack) - 1];
                    unset($stack[count($stack) - 1]);
                }
            }

            return $elements[0]; // the single top-level element
        } catch (Exception $e) {
            throw self::exception('parse_xml_contents', $e->getMessage());
        }
    }
}
