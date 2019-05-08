<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityNPMLibrary;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


class EntityNPMLibraryRepoService extends BaseAbstractRepoService {

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityNPMLibrary::class);
    }

    public function has_npm_lib_by_name(string $lib_name) : bool {
        return $this->repo->get_lib_by_name($lib_name) !== null;
    }

    public function get_lib(string $lib_name) : EntityNPMLibrary {
        return $this->repo->get_lib_by_name($lib_name);
    }

    public function cache_create_new(string $lib_name) : EntityNPMLibrary {
        $this->log('Creating NPM Library entry{' . $lib_name . '}');
        $entity = $this->repo->create_npm_library_from_name($lib_name);
        return $entity;
    }

    public function check_version_latest(EntityNPMLibrary $entity) : void {
        $this->repo->check_version_latest($entity);
    }

}


