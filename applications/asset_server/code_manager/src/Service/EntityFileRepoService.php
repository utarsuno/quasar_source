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
use QuasarSource\Utilities\FileUtilities;

class EntityFileRepoService {

    private $repo;

    public function __construct(EntityManagerInterface $entity_manager) {
        $this->repo = $entity_manager->getRepository(EntityFile::class);
    }

    public function ensure_file_is_cached(string $path) : void {
        echo 'Ensuring file is cached{' . $path . '}' . PHP_EOL;

        $has_file = $this->repo->has_file_by_name($path);
        if (!$has_file) {
            echo 'Caching a file!!' . PHP_EOL;
            $this->repo->cache_file($path);
        } else {

            # TODO: ENSURE UP TO DATE!

            $entity_file = $this->repo->get_file_by_name($path);

            $current_sha512sum = FileUtilities::file_get_sha512sum($path);
            $file_sha512sum    = $entity_file->getSha512sum();

            var_dump($current_sha512sum);
            var_dump($file_sha512sum);

            $f = $this->repo->get_file_by_name($path);
            echo 'ensure up to date{' . $f . PHP_EOL;
        }
    }



}


