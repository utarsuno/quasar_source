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
use RuntimeException;

class EntityFileRepoService extends BaseAbstractRepoService {

    private const FILE_STATE_CREATED   = 'cache_created';
    private const FILE_STATE_UPDATED   = 'cache_updated';
    private const FILE_STATE_NO_CHANGE = 'cache_no_change';
    private $file_states               = [
        self::FILE_STATE_CREATED   => [],
        self::FILE_STATE_UPDATED   => [],
        self::FILE_STATE_NO_CHANGE => []
    ];

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityFile::class);
    }

    public function did_file_cache_update(EntityFile $file) : bool {
        return array_key_exists($file->getFullPath(), $this->file_states[self::FILE_STATE_UPDATED]) || array_key_exists($file->getFullPath(), $this->file_states[self::FILE_STATE_CREATED]);
    }

    public function ensure_file_has_gzip_child(EntityFile $file, ?string $path_to_child=null) : EntityFile {
        if (!$file->hasChild()) {
            if ($path_to_child === null) {
                $path_to_child = $file->getFullPath() . '.gz';
            }

            $this->ensure_child_file_does_not_exist_physically($file, $path_to_child);

            UFO::gzip($file->getFullPath(), $path_to_child);

            $this->log('Created gzipped file at {' . $path_to_child . '}');

            $options                        = $file->get_current_options();
            $options[EntityFile::FLAG_GZIP] = true;

            $child = $this->repo->create_entity_file_from_path($path_to_child, $file->getFileType(), $options, $file);
            return $child;
        }
        return $file->getChild();
    }

    private function ensure_child_file_does_not_exist_physically(EntityFile $base_file, string $path_to_child) : void {
        if ($this->has_file_by_path($path_to_child)) {
            $this->warn('EntityFile{' . $base_file->getName() . '} did not have a child ID but cached path{' . $path_to_child . '} exists as a DB record, deleting the record!');
            $this->repo->remove_file_by_path($path_to_child);
        }
    }

    public function ensure_file_has_minified_child(EntityFile $file, string $path_to_child) : EntityFile {
        if (!$file->hasChild()) {
            $this->ensure_child_file_does_not_exist_physically($file, $path_to_child);

            if ($file->getFileType() === EntityFile::TYPE_CSS) {

                $options           = $file->get_current_options();
                $options[EntityFile::FLAG_MINIFY] = true;

                $this->log('Creating child file at {' . $path_to_child . '}');
                UFO::minify_css($file->getFullPath(), $path_to_child);
                return $this->repo->create_entity_file_from_path($path_to_child, $file->getFileType(), $options, $file);
            }
            throw new RuntimeException('TODO: Handle minification for type{' . $path_to_child . '}');
        }
        return $file->getChild();
    }

    public function ensure_file_is_cached(string $path) : EntityFile {
        $this->log('Ensuring file is cached{' . $path . '}');

        if (!$this->has_file_by_path($path)) {
            return $this->cache_create_new($path);
        }

        $entity_file = $this->repo->get_file_by_path($path);
        $this->cache_check_sha512sum($entity_file);
        $this->cache_ensure_valid_reference_child($entity_file);

        return $entity_file;
    }

    private function record_file_state(EntityFile $file, string $file_state) : void {
        $this->file_states[$file_state][$file->getFullPath()] = $file;
    }

    /**
     * Create a new DB cache entry for a file.
     *
     * @param string $path       < The path to the file to cache for future code builds. >
     * @return EntityFile        < A EntityFile object freshly added to the DB.          >
     */
    private function cache_create_new(string $path) : EntityFile {
        $this->log('Caching path{' . $path . '}');
        $entity_file = $this->repo->create_entity_file_from_path($path, EntityFile::get_file_type_from_path($path), [
            EntityFile::FLAG_MINIFY => false,
            EntityFile::FLAG_GZIP => false,
            EntityFile::FLAG_PRE_PROCESS => false
        ]);
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

    private function has_file_by_path(string $path) : bool {
        return $this->repo->get_file_by_path($path) !== null;
    }

}


