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
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;


class EntityFileRepoService extends BaseAbstractRepoService {

    private const FILE_STATE_CREATED   = 'cache_created';
    private const FILE_STATE_UPDATED   = 'cache_updated';
    private const FILE_STATE_NO_CHANGE = 'cache_no_change';
    private $files_created             = [];
    private $files_updated             = [];
    private $files_no_delta            = [];

    public function __construct(EntityManagerInterface $entity_manager, LoggerInterface $logger) {
        parent::__construct($entity_manager, $logger, EntityFile::class);
    }

    private function ensure_child_file_does_not_exist_physically(EntityFile $base_file, string $path_to_child) : void {
        if ($this->has_file_by_path($path_to_child)) {
            $this->warn('EntityFile{' . $base_file->getName() . '} did not have a child ID but cached path{' . $path_to_child . '} exists as a DB record, deleting the record!');
            $this->repo->remove_entity($this->repo->get_file_by_path($path_to_child));
        }
    }

    public function does_child_file_exist_as_needed(EntityFile $file, string $path_to_child) : bool {
        if (!$file->hasChild()) {
            $this->ensure_child_file_does_not_exist_physically($file, $path_to_child);
            $this->log('Creating child file at {' . $path_to_child . '}');
            return false;
        }
        return true;
    }

    public function ensure_file_has_flagged_child(EntityFile $file, string $path_to_child, string $flag) : EntityFile {
        if (!$this->does_child_file_exist_as_needed($file, $path_to_child)) {

            $options        = $file->get_flags();
            $options[$flag] = true;

            switch ($flag) {
                case EntityFile::FLAG_GZIP:
                    return $this->create_gzipped_child($file, $path_to_child, $options);
                case EntityFile::FLAG_MINIFY:
                    return $this->create_minified_child($file, $path_to_child, $options);
            }
        }
        return $file->getChild();
    }

    private function create_gzipped_child(EntityFile $file, string $path_to_child, array $options) : EntityFile {
        UFO::gzip($file->getFullPath(), $path_to_child);
        return $this->repo->create_entity_file_from_path($path_to_child, $file->getFileType(), $options, $file);
    }

    public function create_processed_child(EntityFile $file, string $path_to_child, string $file_type, array $options) : EntityFile {
        return $this->repo->create_entity_file_from_path($path_to_child, $file_type, $options, $file);
    }

    private function create_minified_child(EntityFile $file, string $path_to_child, array $options) : EntityFile {
        $file_type = $file->getFileType();
        switch ($file_type) {
            case EntityFile::TYPE_HTML:
                UFO::minify_html($file->getFullPath(), $path_to_child);
                break;
            case EntityFile::TYPE_CSS:
                UFO::minify_css($file->getFullPath(), $path_to_child);
                break;
            default:
                DBG::throw_exception('TODO: Handle minification for type{' . $path_to_child . '}');
                break;
        }
        return $this->repo->create_entity_file_from_path($path_to_child, $file_type, $options, $file);
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

    /**
     * Create a new DB cache entry for a file.
     *
     * @param string $path       < The path to the file to cache for future code builds. >
     * @return EntityFile        < A EntityFile object freshly added to the DB.          >
     */
    private function cache_create_new(string $path) : EntityFile {
        $this->log('Caching path{' . $path . '}');
        $entity_file = $this->repo->create_entity_file_from_path($path, EntityFile::get_file_type_from_path($path), [
            EntityFile::FLAG_MINIFY      => false,
            EntityFile::FLAG_GZIP        => false,
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
                $this->repo->remove_entity($file, true);
            } else {
                $this->cache_check_sha512sum($child);
                $this->cache_ensure_valid_reference_child($child);
            }
        }
    }

    private function cache_check_sha512sum(EntityFile $file) : void {
        #$this->log('File{' . $file->getFullPath() . '} was found in DB, checking if SHA512SUM changed.');
        if ($file->has_sha512sum_changed()) {
            #$this->log('SHA512SUM changed, warming file cache values.');
            $file->cache_warm_up();
            $this->record_file_state($file, self::FILE_STATE_UPDATED);
        } else {
            #$this->log('File has stayed the same =), no actions will be taken for it.');
            $this->record_file_state($file, self::FILE_STATE_NO_CHANGE);
        }
    }

    public function has_file_by_path(string $path) : bool {
        // TODO: Potentially do a check first if the path exists in cached file states, to avoid potentially slowly Doctrine search (even if it won't hit DB).
        return $this->repo->get_file_by_path($path) !== null;
    }

    private function record_file_state(EntityFile $file, string $file_state) : void {
        $file_path = $file->getFullPath();
        switch ($file_state) {
            case self::FILE_STATE_CREATED:
                $this->files_created[$file_path] = $file;
                break;
            case self::FILE_STATE_UPDATED:
                $this->files_updated[$file_path] = $file;
                break;
            case self::FILE_STATE_NO_CHANGE:
                $this->files_no_delta[$file_path] = $file;
                break;
        }
    }

    public function has_checked_file_by_path(string $file_path) : bool {
        if ($this->has_file_by_path($file_path)) {
            $file = $this->repo->get_file_by_path($file_path);
            return $this->file_has_state($file, self::FILE_STATE_NO_CHANGE) || $this->did_file_cache_update($file);
        }
        return false;
    }

    public function did_file_cache_update(EntityFile $file) : bool {
        return $this->file_has_state($file, self::FILE_STATE_UPDATED) || $this->file_has_state($file, self::FILE_STATE_CREATED);
    }

    private function file_has_state(EntityFile $file, string $file_state) : bool {
        $file_path = $file->getFullPath();
        switch ($file_state) {
            case self::FILE_STATE_CREATED:
                return array_key_exists($file_path, $this->files_created);
            case self::FILE_STATE_UPDATED:
                return array_key_exists($file_path, $this->files_updated);
            case self::FILE_STATE_NO_CHANGE:
                return array_key_exists($file_path, $this->files_no_delta);
        }
        return false;
    }

}

