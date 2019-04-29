<?php


namespace QuasarSource\Utilities\Files;


class FileParserXMLQA extends FileParserXML {

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     * @param string $path
     * @return mixed
     */
    protected static function parse_content(string $path) {
        $nodes = parent::parse_content($path);

        foreach ($nodes->children as $key) {
            var_dump('--- K E Y ---');
            var_dump($key);
            #var_dump('V A L U E');
            #var_dump($value);
        }
    }
}
