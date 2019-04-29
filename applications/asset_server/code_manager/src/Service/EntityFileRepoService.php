<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 03:01
 */

namespace CodeManager\Service;

use CodeManager\Entity\EntityFile;
use CodeManager\Repository\EntityFileRepository;
use Doctrine\ORM\EntityManagerInterface;
use mysql_xdevapi\Exception;
use Psr\Log\LoggerInterface;
use QuasarSource\Utilities\Files\FileUtilities as UFO;

class EntityFileRepoService extends BaseAbstractService {

    /** @var EntityFileRepository */
    private $repo;

    private const FILE_STATE_CREATED   = 'cache_created';
    private const FILE_STATE_UPDATED   = 'cache_updated';
    private const FILE_STATE_NO_CHANGE = 'cache_no_change';
    private $file_states               = [
        self::FILE_STATE_CREATED   => [],
        self::FILE_STATE_UPDATED   => [],
        self::FILE_STATE_NO_CHANGE => []
    ];

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($logger);
        $this->repo = $entity_manager->getRepository(EntityFile::class);
    }

    public function ensure_file_has_gzip_child(EntityFile $file, ?string $path_to_child=null) : EntityFile {
        if (!$file->hasChild()) {
            if ($path_to_child === null) {
                $path_to_child = $file->getFullPath() . '.gz';
            }

            $this->ensure_child_file_does_not_exist_physically($file, $path_to_child);

            $child_file_type = $file->getFileTypeGzipped();
            UFO::gzip($file->getFullPath(), $path_to_child);

            $this->log('Created gzipped file at {' . $path_to_child . '}');
            $child = $this->repo->create_entity_file_from_path($path_to_child, $child_file_type, $file);
            return $child;
        }
        return $file->getChild();
    }

    private function ensure_child_file_does_not_exist_physically(EntityFile $base_file, string $path_to_child) : void {
        if ($this->repo->has_file_by_path($path_to_child)) {
            $this->warn('EntityFile{' . $base_file->getName() . '} did not have a child ID but cached path{' . $path_to_child . '} exists as a DB record, deleting the record!');
            $this->repo->remove_file_by_path($path_to_child);
        }
    }

    public function ensure_file_has_minified_child(EntityFile $file, string $path_to_child) : EntityFile {
        if (!$file->hasChild()) {
            $this->ensure_child_file_does_not_exist_physically($file, $path_to_child);

            $child_file_type = $file->getFileTypeMinified();
            if ($child_file_type === EntityFile::FILE_TYPE_CSS_MINIFIED) {
                UFO::minify_css($file->getFullPath(), $path_to_child, $child_file_type);
            } else {
                throw new Exception('TODO: Handle minification for type{' . $child_file_type . '}');
            }

            $this->log('Creating child file at {' . $path_to_child . '}');
            $child = $this->repo->create_entity_file_from_path($path_to_child, $child_file_type, $file);
            return $child;
        }
        return $file->getChild();
    }

    public function get_all_entity_files() : array {
        return $this->repo->get_all();
    }

    public function ensure_file_is_cached(string $path, string $file_type) : EntityFile {
        $this->log('Ensuring file is cached{' . $path . '}');

        if (!$this->repo->has_file_by_path($path)) {
            return $this->cache_create_new($path, $file_type);
        }

        $entity_file = $this->repo->get_file_by_path($path);
        $this->cache_check_sha512sum($entity_file);
        $this->cache_ensure_valid_reference_child($entity_file);

        return $entity_file;
    }

    private function record_file_state(EntityFile $file, string $file_state) : void {
        $this->file_states[$file_state][] = $file;
    }

    /**
     * Create a new DB cache entry for a file.
     *
     * @param string $path       < The path to the file to cache for future code builds. >
     * @param string $file_type  < The type of the file pointed by $file_path.           >
     * @return EntityFile        < A EntityFile object freshly added to the DB.          >
     */
    private function cache_create_new(string $path, string $file_type) : EntityFile {
        $this->log('Caching path{' . $path . '}');
        $entity_file = $this->repo->create_entity_file_from_path($path, $file_type);
        $this->record_file_state($entity_file, self::FILE_STATE_CREATED);
        return $entity_file;
    }

    private function cache_ensure_valid_reference_child(EntityFile $file) : void {
        if ($file->hasChild()) {
            $child = $file->getChild();
            if (!UFO::is_valid($child->getFullPath())) {
                $this->warn('EntityFile{' . $file->getName() . '} has child ID but it does not point to an existing file. Deleting child records (recursively) cache for this file.');
                $this->repo->remove_file_by_entity($file);
            } else {
                $this->cache_check_sha512sum($child);
                $this->cache_ensure_valid_reference_child($child);
            }
        }
    }

    private function cache_check_sha512sum(EntityFile $file) : void {
        $this->log('File{' . $file->getFullPath() . '} was found in DB, checking if SHA512SUM changed.');
        if ($file->has_sha512sum_changed()) {
            $this->log('SHA512SUM changed, warming file cache values.');
            $file->cache_warm_up();
            $this->record_file_state($file, self::FILE_STATE_UPDATED);
        } else {
            $this->log('File has stayed the same =), no actions will be taken for it.');
            $this->record_file_state($file, self::FILE_STATE_NO_CHANGE);
        }
    }

}


