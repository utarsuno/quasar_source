<?php declare(strict_types=1);

namespace CodeManager\Repository\File;

use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Repository\Abstractions\QueryableRepo;
use Exception;
use QuasarSource\Doctrine\Fields\EnumFields as FIELD;
use QuasarSource\Utils\File\UtilsDirectory      as DIR;

/**
 * Class RepoDirectory
 * @package CodeManager\Repository\File
 */
class RepoDirectory extends QueryableRepo {

    /** @var RepoFile $repo_files */
    private $repo_files;

    /** @var RepoFileType $repo_file_types */
    private $repo_file_types;

    /** @var array $cache_real_dirs */
    private $cache_real_dirs = [];

    /**
     * @param  string $path_to_directory
     * @return EntityDirectory
     * @throws Exception
     */
    public function get_real(string $path_to_directory): EntityDirectory {
        $force_sha512sum_sync = false;
        $entity               = $this->find_by_path($path_to_directory);
        if ($entity === null) {
            $this->logger->log('Creating EntityDir{' . $path_to_directory . '}');
            $entity               = $this->save_directory(EntityDirectory::spawn($path_to_directory));
            $force_sha512sum_sync = true;
        }
        if (!array_key_exists($path_to_directory, $this->cache_real_dirs)) {
            $dir_entity = $this->sync_directory_contents($entity, $force_sha512sum_sync);
            $this->cache_real_dirs[$path_to_directory] = $dir_entity;
        }
        return $this->cache_real_dirs[$path_to_directory];
    }

    /**
     * @param  string $path
     * @return EntityDirectory
     */
    protected function find_by_path(string $path): ?EntityDirectory {
        /** @var EntityDirectory $entity */
        $entity = $this->findOneBy([FIELD::PATH_AS_SQL => $path]);
        return $entity;
    }

    /**
     * @param  EntityDirectory $directory
     * @param  bool            $force_sha512sum_sync
     * @return EntityDirectory
     * @throws Exception
     */
    protected function sync_directory_contents(EntityDirectory $directory, bool $force_sha512sum_sync): EntityDirectory {
        $already_synced = true;
        $all_paths      = $directory->get_all_paths();
        foreach ($all_paths as $path) {
            if (!$this->repo_files->does_entity_exist($path)) {
                $this->logger->log('Entity[File|Dir]{' . $path . '} did not exist, creating it!');
                $already_synced = false;
                $file           = $this->repo_files->create_new_fully_cached_entity($path, $directory);
            } else {
                $updated = $this->repo_files->sync($path, $directory);
                if ($updated) {
                    $this->logger->log('Entity[File|Dir]{' . $path . '} exists but will be updated.');
                    $already_synced = false;
                } else {
                    $this->logger->log('Entity[File|Dir]{' . $path . '} is up to date.');
                }
            }
        }
        if (!$already_synced || $force_sha512sum_sync) {
            $directory->setSHA512Sum(DIR::get_sha512sum($directory->getPath(), true));
            return $this->save_directory($directory);
        }
        $this->logger->log('EntityDir{' . $directory->getPath() . '} is up to date.');
        return $directory;
    }

    /**
     * @param  EntityDirectory $directory
     * @return EntityDirectory
     */
    private function save_directory(EntityDirectory $directory): EntityDirectory {
        $this->save($directory, true);
        return $directory;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    public function set_needed_repos(): void {
        $this->repo_files      = $this->db_service->get_repo(EntityFile::class);
        $this->repo_file_types = $this->db_service->get_repo(EntityFileType::class);
    }
}
