<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\CodeManager\EntityQAReport;
use CodeManager\Repository\Abstractions\AbstractRepository;

class EntityQAReportRepository extends AbstractRepository {

    //protected $default_search_attribute = 'name';
    protected $entity_class = EntityQAReport::class;

}
