<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityFile;
use CodeManager\Repository\EntityFileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


class EntityFileRepoService extends BaseAbstractRepoService {
    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityFile::class);
    }
    public function get_repo() : EntityFileRepository {
        return $this->repo;
    }
}

