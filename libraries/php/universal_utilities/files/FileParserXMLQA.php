<?php


namespace QuasarSource\Utilities\Files;


use QuasarSource\QualityAssurance\TestSuiteResult;

class FileParserXMLQA extends FileParserXML {

    /**
     * @reference: https://www.php.net/manual/en/function.xml-parse-into-struct.php
     * @param string $path
     * @return mixed
     */
    protected static function parse_content(string $path) {
        $nodes = parent::parse_content($path);

        $test_suite = new TestSuiteResult($nodes->children[0], true);

        $qa_report  = $test_suite->get_qa_report();

        var_dump($qa_report);

    }
}
