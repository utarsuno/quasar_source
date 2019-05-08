<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-24
 * Time: 22:00
 */

namespace CodeManager\Service;

use CodeManager\Abstractions\EntityDBStateInterface;
use CodeManager\Repository\AbstractRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;


abstract class BaseAbstractRepoService extends BaseAbstractService {

    /** @var AbstractRepository */
    protected $repo;

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger, $repo_class) {
        parent::__construct($logger);
        $this->repo = $entity_manager->getRepository($repo_class);
    }

}
