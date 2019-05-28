<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\CodeManager\EntityQAReport;
use CodeManager\Repository\Abstractions\AbstractRepository;

class EntityQAReportRepository extends AbstractRepository {

    //protected $default_search_attribute = 'name';
    protected $entity_class = EntityQAReport::class;

    protected function event_before_remove_entity(EntityInterface $entity): void {}

}
