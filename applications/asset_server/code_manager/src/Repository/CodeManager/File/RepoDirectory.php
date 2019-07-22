<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\CodeManager\File\EntityDirectory;
use CodeManager\Repository\Abstractions\QueryableRepo;
use QuasarSource\Utils\File\UtilsDirectory;

/**
 * Class RepoDirectory
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoDirectory extends QueryableRepo {

    public const ENTITY_CLASS = EntityDirectory::class;

    /** @var RepoFile $repo_files */
    private $repo_files;

    /**
     * @param  string $path_to_directory
     * @return EntityDirectory
     */
    public function get_real(string $path_to_directory): EntityDirectory {
        /** @var EntityDirectory $entity */
        $entity = $this->findOneBy(['text0' => $path_to_directory]);
        if ($entity === null) {
            var_dump('DIRECTORY ENTITY DOES NOT EXIST! CREATE IT!');
            return $this->create_real_directory($path_to_directory);
        }
        return $entity;
    }

    /**
     * @param  string $path
     * @return EntityDirectory
     */
    private function create_real_directory(string $path): EntityDirectory {
        $directory = new EntityDirectory();
        UtilsDirectory::is_valid($path, true);
        $directory->set_full_path($path)
            ->set_last_checked(-1)
            ->set_last_modified(-1);
        return $directory;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    public function set_needed_repos(): void {
        $this->repo_files = $this->db_service->get_repo(RepoFile::class);
    }
}
