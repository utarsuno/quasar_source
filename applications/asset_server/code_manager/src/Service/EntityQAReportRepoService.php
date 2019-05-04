<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityFile;
use CodeManager\Entity\EntityQAReport;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityQAReportRepository;
use Doctrine\ORM\EntityManagerInterface;
use mysql_xdevapi\Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\DateTimeUtilities;
use QuasarSource\Utilities\Files\FileParserXMLQA;
use QuasarSource\Utilities\Files\FileUtilities as UFO;

class EntityQAReportRepoService extends BaseAbstractRepoService {

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityQAReport::class);
    }

    public function cache_new_report(EntityFile $file) : void {
        $this->log('Cache new QA Report for{' . $file->getFullPath() . '}');

        $content   = FileParserXMLQA::get_content($file->getFullPath());

        $qa_report = new EntityQAReport();
        $qa_report->setEntityFile($file);
        $qa_report->setNumAssertions($content->get_num_assertions());
        $qa_report->setNumErrors($content->get_num_errors());
        $qa_report->setNumFailed($content->get_num_failed());
        $qa_report->setSecondsTaken($content->get_time_taken());
        $qa_report->setNumTests($content->get_num_tests());
        $qa_report->setNumSkipped($content->get_num_skipped());
        $qa_report->setRanAt(DateTimeUtilities::now());
        $qa_report->setRawReport($content->get_qa_report());

        $this->save_entity($qa_report, true);
    }

}


