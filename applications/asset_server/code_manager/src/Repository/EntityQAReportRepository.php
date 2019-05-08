<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\EntityFile;
use CodeManager\Entity\EntityQAReport;

class EntityQAReportRepository extends AbstractRepository {

    public function get_qa_report_by_entity_file(EntityFile $entity_file) : EntityQAReport {
        return $this->get_entity_by_attribute('entity_file_id', $entity_file->getId());
    }

    protected function event_before_remove_entity($entity): void {}

    protected function event_after_remove_entity($entity): void {}
}
