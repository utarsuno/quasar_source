<?php declare(strict_types=1);

namespace CodeManager\Repository\File;

use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Repository\Abstractions\QueryableRepo;
use InvalidArgumentException;
use QuasarSource\CommonFeatures\TraitEnvVarsAsFields;
use QuasarSource\Utils\Process\UtilsProcess;
use RuntimeException;
use QuasarSource\Doctrine\Fields\EnumFields as FIELD;
use QuasarSource\Utils\File\UtilsFile       as UFO;
use QuasarSource\Utils\DataType\UtilsString as STR;

/**
 * Class RepoFile
 * @package CodeManager\Repository\File
 */
final class RepoFile extends QueryableRepo {
    use TraitEnvVarsAsFields;

    protected $entity_class = EntityFile::class;

    /** @var RepoFileType $repo_file_types */
    private $repo_file_types;

    /** @var string $env_node_file_minifier */
    private $env_node_file_minifier;

    # --------------------------------------------------- M A G I C ----------------------------------------------------
    public function __destruct() {
        unset($this->repo_file_types, $this->env_node_file_minifier);
        parent::__destruct();
    }
    # -------------------------------------------------- P U B L I C ---------------------------------------------------

    /**
     * @param  string          $path
     * @param  EntityDirectory $directory
     * @return bool
     */
    public function sync(string $path, EntityDirectory $directory): bool {
        /** @var EntityFile $file */
        $file = $this->findOneBy([FIELD::PATH_AS_SQL => $path]);
        if ($file->sync()) {
            $this->save($file, true);
            return true;
        }
        return false;
    }

    /**
     * @param  string $path
     * @return EntityFile|null
     */
    public function find_by_path(string $path): ?EntityFile {
        /** @var EntityFile $entity */
        $entity = $this->findOneBy([FIELD::PATH_AS_SQL => $path]);
        return $entity;
    }

    /**
     * @param  string $path
     * @return bool
     */
    public function does_entity_exist(string $path): bool {
        return $this->findOneBy([FIELD::PATH_AS_SQL => $path]) !== null;
    }

    /**
     * @param  string          $path
     * @param  EntityDirectory $parent_directory
     * @return EntityFile
     */
    public function create_new_fully_cached_entity(string $path, EntityDirectory $parent_directory): EntityFile {
        $this->ensure_path_dne_in_db($path);
        $entity = EntityFile::spawn($path, $parent_directory);
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
        $this->ensure_path_dne_in_db($child_path);
        return $this->fully_save_entity(EntityFile::spawn($child_path, $parent_directory, $parent_file), $child_file_type);
    }

    /**
     * @param  EntityFile $file
     * @param  string     $extension
     * @return EntityFile|null
     */
    public function find_matching_file_with_alt_extension(EntityFile $file, string $extension): ?EntityFile {
        return $this->find_by_path(STR::replace($file->getPath(), $file->get_file_extensions(), $extension));
    }

    /**
     * @param  EntityFile $file
     * @param  string     $output_directory
     * @return EntityFile
     */
    public function ensure_file_has_gzipped_child(EntityFile $file, string $output_directory): EntityFile {
        return $this->ensure_file_has_child_file($file, RepoFileType::EXTENSION_TYPE_GZIPPED, $output_directory);
    }

    /**
     * @param  EntityFile $file
     * @param  string     $output_directory
     * @return EntityFile
     */
    public function ensure_file_has_minified_child(EntityFile $file, string $output_directory): EntityFile {
        return $this->ensure_file_has_child_file($file, RepoFileType::EXTENSION_TYPE_MINIFIED, $output_directory);
    }

    /**
     * @param  EntityFile $file
     * @param  string     $child_extension_type
     * @param  string     $output_directory
     * @return EntityFile
     */
    public function ensure_file_has_child_file(EntityFile $file, string $child_extension_type, string $output_directory): EntityFile {
        if (!$file->hasChild()) {
            $needed_type = $this->repo_file_types->get_type_as($file, $child_extension_type);
            $output_path = $output_directory . $file->get_name_as_type($needed_type);
            switch ($child_extension_type) {
                case RepoFileType::EXTENSION_TYPE_GZIPPED:
                    UFO::gzip($file->getPath(), $output_path);
                    return $this->create_new_fully_cached_entity_child($file, $needed_type, $output_path);
                case RepoFileType::EXTENSION_TYPE_MINIFIED:
                    if (!$file->getFileType()->can_be_minified()) {
                        throw new RuntimeException('Currently can only minify CSS and HTML files.');
                    }
                    UtilsProcess::run_cmd(['node', $this->env_node_file_minifier, '-i', $file->getPath(), '-o', $output_path]);
                    return $this->create_new_fully_cached_entity_child($file, $needed_type, $output_path);
                default:
                    throw new InvalidArgumentException('Unknown EntityFile extension type/group{' . $child_extension_type . '}');
            }
        }
        return $file->getChild();
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  EntityFile     $file
     * @param  EntityFileType $file_type
     * @return EntityFile
     */
    private function fully_save_entity(EntityFile $file, EntityFileType $file_type): EntityFile {
        $file->setFileType($file_type);
        $this->save($file, true);
        if ($file->hasParent()) {
            $this->save($file->getParent(), true);
        }
        $this->repo_file_types->save($file_type);
        return $file;
    }

    /**
     * @param string $path
     */
    private function ensure_path_dne_in_db(string $path): void {
        if ($this->does_entity_exist($path)) {
            throw new RuntimeException('The path{' . $path . '} already exists in the DB!');
        }
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------
    public function set_needed_repos(): void {
        $this->repo_file_types = $this->db_service->get_repo(EntityFileType::class);
        $this->envs_set_as_str(['PATH_NODE_MINIFY_FILE' => 'env_node_file_minifier']);
    }

}
