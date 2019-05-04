<?php


namespace QuasarSource\Utilities\Files;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;


class FileParserXMLQA extends FileParserXML {

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     * @param string $path
     * @return mixed
     */
    protected static function parse_content(string $path) {
        $nodes      = parent::parse_content($path);
        $test_suite = new ProjectTestSuiteResult($nodes->children[0]);
        return $test_suite;
    }
}
