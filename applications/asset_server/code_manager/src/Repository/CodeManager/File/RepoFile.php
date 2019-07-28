<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\CodeManager\File\EntityDirectory;
use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Entity\CodeManager\File\EntityFileType;
use CodeManager\Repository\Abstractions\QueryableRepo;
use RuntimeException;
use QuasarSource\SQL\Doctrine\Fields\EnumFields as FIELD;
use QuasarSource\Utils\File\UtilsFile           as UFO;
use QuasarSource\Utils\DataType\UtilsString     as STR;
use QuasarSource\Utils\File\UtilsPath           as PATH;

/**
 * Class RepoFile
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoFile extends QueryableRepo {

    protected $default_search_attribute = FIELD::FULL_PATH_AS_SQL;
    public const ENTITY_CLASS           = EntityFile::class;
    protected $entity_class             = EntityFile::class;

    /** @var RepoFileType $repo_file_types */
    private $repo_file_types;

    /**
     * @param  string          $path
     * @param  EntityDirectory $directory
     * @return bool
     */
    public function sync(string $path, EntityDirectory $directory): bool {
        /** @var EntityFile $file */
        $file        = $this->findOneBy([FIELD::FULL_PATH_AS_SQL => $path]);
        $out_of_date = false;
        if ($file->has_sha512sum_changed()) {
            $out_of_date = true;
            $file->sync();
            $this->save_entity($file, true);
        }
        return $out_of_date;
    }

    /**
     * @param  string $path
     * @return bool
     */
    public function does_entity_exist(string $path): bool {
        return $this->findOneBy([FIELD::FULL_PATH_AS_SQL => $path]) !== null;
    }

    /**
     * @param  string          $path
     * @param  EntityDirectory $parent_directory
     * @return EntityFile
     */
    public function create_new_fully_cached_entity(string $path, EntityDirectory $parent_directory): EntityFile {
        var_dump('create_new_fully_cached_entity');
        $entity = $this->create_new_file_entity($path);
        $parent_directory->addFile($entity);
        $entity->sync();
        $entity->setDirectory($parent_directory);
        if (!$entity->hasParent()) {
            $entity->set_rank(0);
        }
        return $this->fully_save_entity($entity, $this->repo_file_types->get_entity_needed_file_type($entity));
    }

    /**
     * @param  EntityFile      $parent_file
     * @param  EntityFileType  $child_file_type
     * @param  string          $child_path
     * @param  EntityDirectory $parent_directory
     * @return EntityFile
     */
    public function create_new_fully_cached_entity_child(
        EntityFile      $parent_file,
        EntityFileType  $child_file_type,
        string          $child_path,
        EntityDirectory $parent_directory=null
    ): EntityFile {
        var_dump('create_new_fully_cached_child_entity');
        if ($this->does_entity_exist($child_path)) {
            throw new RuntimeException('Trying to create EntityFile for path{' . $child_path . '} which already exists in the DB!');
        }
        $entity = $this->create_new_file_entity($child_path);
        if ($parent_directory !== null) {
            $parent_directory->addFile($entity);
        }
        $entity->sync();
        if ($parent_directory !== null) {
            $entity->setDirectory($parent_directory);
        }
        $entity = $this->fully_save_entity($entity, $child_file_type);
        if ($parent_file !== null) {
            $this->set_parent_and_child($parent_file, $entity);
        }
        return $entity;
    }

    /**
     * @param  EntityFile $file
     * @param  string     $output_directory
     * @return EntityFile
     */
    public function ensure_file_has_gzipped_child(EntityFile $file, string $output_directory): EntityFile {
        if (!$file->hasChild()) {
            $needed_type = $this->repo_file_types->get_type_as_gzipped($file);
            $output_path = $output_directory . STR::replace(PATH::get_file_full_name($file->getFullPath()), $file->getFileTypeString(), $needed_type->getAsString());
            UFO::gzip($file->getFullPath(), $output_path);
            return $this->create_new_fully_cached_entity_child($file, $needed_type, $output_path);
        }
        return $file->getChild();
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  EntityFile $parent
     * @param  EntityFile $child
     * @return void
     */
    private function set_parent_and_child(EntityFile $parent, EntityFile $child): void {
        $parent->setChild($child);
        $child->setParent($parent);
        $this->save_entity($parent, false);
        $this->save_entity($child, true);
    }

    /**
     * @param  string $path
     * @return EntityFile
     */
    private function create_new_file_entity(string $path): EntityFile {
        $file = new EntityFile();
        $file->setFullPath($path);
        return $file;
    }

    /**
     * @param  EntityFile     $file
     * @param  EntityFileType $file_type
     * @return EntityFile
     */
    private function fully_save_entity(EntityFile $file, EntityFileType $file_type): EntityFile {
        $file_type->mark_entity_file($file);
        $this->save_entity($file, true);
        $this->repo_file_types->save_entity($file_type);
        return $file;
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------
    public function set_needed_repos(): void {
        $this->repo_file_types = $this->db_service->get_repo(RepoFileType::class);
    }
}
