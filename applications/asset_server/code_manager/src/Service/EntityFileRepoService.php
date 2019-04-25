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
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\FileUtilities;

class EntityFileRepoService extends BaseAbstractService {

    private $repo;

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($logger);
        $this->repo = $entity_manager->getRepository(EntityFile::class);
    }

    public function ensure_file_is_cached(string $path) : void {
        $this->log('Ensuring file is cached{' . $path . '}');

        if (!$this->repo->has_file_by_name($path)) {
            $this->log('Caching path{' . $path . '}');
            $this->repo->cache_file($path);
        } else {
            $this->log('File{' . $path . '} was found in DB, checking if SHA512SUM changed.');
            $entity_file = $this->repo->get_file_by_name($path);
            if ($entity_file->has_sha512sum_changed()) {
                $entity_file->cache_warm_up();
                $this->log('SHA512SUM changed, warming file cache values.');
            } else {
                $this->log('File has stayed the same =)');
            }
        }
    }

}


