<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityFile;
use Doctrine\ORM\EntityManagerInterface;

class EntityFileRepoService {

    private $entity_file_repo;

    public function __construct(EntityManagerInterface $entity_manager) {
        $this->entity_file_repo = $entity_manager->getRepository(EntityFile::class);
    }

    public function temp_run(string $path) {
        $has_file = $this->entity_file_repo->has_file_by_name($path);

        if (!$has_file) {
            echo 'TODO: load file!' . PHP_EOL;
            $this->entity_file_repo->cache_file($path);
        } else {
            $f = $this->entity_file_repo->get_file_by_name($path);
            echo $f . PHP_EOL;
        }
    }

}


