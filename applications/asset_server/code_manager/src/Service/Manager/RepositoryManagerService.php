<?php

namespace CodeManager\Service\Manager;

use CodeManager\Entity\EntityDirectory;
use CodeManager\Entity\EntityFile;
use CodeManager\Entity\EntityNPMLib;
use CodeManager\Entity\EntityQAReport;
use CodeManager\Entity\Users\EntityUser;
use CodeManager\Entity\Users\EntityUserRole;
use CodeManager\Repository\EntityDirectoryRepository;
use CodeManager\Repository\EntityFileRepository;
use CodeManager\Repository\EntityNPMLibRepository;
use CodeManager\Repository\EntityQAReportRepository;
use CodeManager\Repository\Users\EntityUserRepository;
use CodeManager\Repository\Users\EntityUserRoleRepository;
use CodeManager\Service\Abstractions\BaseAbstractService;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use CodeManager\Service\Abstractions\OwnsRepos;
use Psr\Log\LoggerInterface;


class RepositoryManagerService extends BaseAbstractService implements OwnsRepos {

    private const REPO_TO_ENTITY = [
        EntityFileRepository::class      => EntityFile::class,
        EntityDirectoryRepository::class => EntityDirectory::class,
        EntityQAReportRepository::class  => EntityQAReport::class,
        EntityNPMLibRepository::class    => EntityNPMLib::class,
        EntityUserRepository::class      => EntityUser::class,
        EntityUserRoleRepository::class  => EntityUserRole::class,
    ];

    /** @var EntityManagerInterface */
    private $entity_manager;
    /** @var array */
    private $entity_repos = [];

    public function __construct(LoggerInterface $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->entity_manager = $entity_manager;
    }

    public function get_repo(string $repo_key): ObjectRepository {
        if (!array_key_exists($repo_key, $this->entity_repos)) {
            $this->set_repo($repo_key, self::REPO_TO_ENTITY[$repo_key]);
        }
        return $this->entity_repos[$repo_key];
    }

    private function set_repo(string $repo_key, string $entity_class): void {
        $this->entity_repos[$repo_key] = $this->entity_manager->getRepository($entity_class);
    }

}
