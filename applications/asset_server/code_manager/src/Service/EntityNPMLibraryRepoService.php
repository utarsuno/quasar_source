<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityNPMLibrary;
use CodeManager\Repository\EntityNPMLibraryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


class EntityNPMLibraryRepoService extends BaseAbstractRepoService {
    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityNPMLibrary::class);
    }
    public function get_repo() : EntityNPMLibraryRepository {
        return $this->repo;
    }
}


