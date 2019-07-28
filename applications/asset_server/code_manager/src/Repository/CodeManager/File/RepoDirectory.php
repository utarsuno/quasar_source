<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\CodeManager\File\EntityDirectory;
use CodeManager\Repository\Abstractions\QueryableRepo;
use Exception;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;
use QuasarSource\Utils\File\UtilsDirectory      as DIR;

/**
 * Class RepoDirectory
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoDirectory extends QueryableRepo {

    public const ENTITY_CLASS = EntityDirectory::class;

    /** @var RepoFile $repo_files */
    private $repo_files;

    /** @var RepoFileType $repo_file_types */
    private $repo_file_types;

    /**
     * @param  string $path_to_directory
     * @return EntityDirectory
     * @throws Exception
     */
    public function get_real(string $path_to_directory): EntityDirectory {
        $entity = $this->find_by_path($path_to_directory);
        if ($entity === null) {
            $entity = $this->create_real_directory($path_to_directory);
            return $this->sync_directory_contents($entity, true);
        }
        return $this->sync_directory_contents($entity, false);
    }

    /**
     * @param  string $path
     * @return EntityDirectory
     */
    protected function find_by_path(string $path): ?EntityDirectory {
        /** @var EntityDirectory $entity */
        $entity = $this->findOneBy([FIELD::FULL_PATH_AS_SQL => $path]);
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
                var_dump('Path{' . $path . '} does not exist in the DB, creating it.');
                $already_synced = false;
                $file           = $this->repo_files->create_new_fully_cached_entity($path, $directory);
            } else {
                $updated = $this->repo_files->sync($path, $directory);
                if ($updated) {
                    var_dump('Path{' . $path . '} already exists but was not up to date.');
                    $already_synced = false;
                } else {
                    var_dump('Path{' . $path . '} already exists and is up to date.');
                }
            }
        }
        if (!$already_synced || $force_sha512sum_sync) {
            $directory->setSHA512Sum(DIR::get_sha512sum($directory->getFullPath(), true));
        } else {
            var_dump('Directory{' . $directory->getFullPath() . '} is up to date.');
        }
        return $directory;
    }

    /**
     * @param  string $path
     * @return EntityDirectory
     * @throws Exception
     */
    private function create_real_directory(string $path): EntityDirectory {
        $this->logger->log('Creating Directory Entity for path{' . $path . '}');
        $directory = new EntityDirectory();
        $directory->setFullPath($path)->set_cache_last_updated(-1);
        $this->save_entity($directory, true);
        return $directory;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    public function set_needed_repos(): void {
        $this->repo_files      = $this->db_service->get_repo(RepoFile::class);
        $this->repo_file_types = $this->db_service->get_repo(RepoFileType::class);
    }
}
