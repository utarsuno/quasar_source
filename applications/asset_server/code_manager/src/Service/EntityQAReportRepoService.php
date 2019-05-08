<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityQAReport;
use CodeManager\Repository\EntityQAReportRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


class EntityQAReportRepoService extends BaseAbstractRepoService {
    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityQAReport::class);
    }
    public function get_repo() : EntityQAReportRepository {
        return $this->repo;
    }
}


