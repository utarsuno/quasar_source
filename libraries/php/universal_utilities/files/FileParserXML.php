<?php


namespace QuasarSource\Utilities\Files;


class FileParserXML extends AbstractFileParser {

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     * @param string $path
     * @return mixed
     */
    protected static function parse_content(string $path) {
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
            $index = count($elements);
            if ($tag['type'] === 'complete' || $tag['type'] === 'open') {
                $elements[$index] = new XMLElement();
                $elements[$index]->name = $tag['tag'];
                if (isset($tag['attributes'])) {
                    $elements[$index]->attributes = $tag['attributes'];
                }
                if (isset($tag['value'])) {
                    $elements[$index]->content = $tag['value'];
                }
                if ($tag['type'] === 'open') {  // push
                    $elements[$index]->children = array();
                    $stack[count($stack)] = &$elements;
                    $elements = &$elements[$index]->children;
                }
            }
            if ($tag['type'] === 'close') {  // pop
                $elements = &$stack[count($stack) - 1];
                unset($stack[count($stack) - 1]);
            }
        }

        return $elements[0];  // the single top-level element
    }
}
