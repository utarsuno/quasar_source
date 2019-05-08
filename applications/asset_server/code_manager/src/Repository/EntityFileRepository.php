<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Abstractions\EntityInterface;
use CodeManager\Entity\EntityFile;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping;
use Doctrine\ORM\ORMException;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;


class EntityFileRepository extends AbstractRepository {

    protected $default_search_attribute = 'full_path';
    protected $entity_class             = EntityFile::class;

    private const FILE_STATE_CREATED   = 'cache_created';
    private const FILE_STATE_UPDATED   = 'cache_updated';
    private const FILE_STATE_NO_CHANGE = 'cache_no_change';
    private $files_created             = [];
    private $files_updated             = [];
    private $files_no_delta            = [];

    public function does_child_file_exist_as_needed(EntityFile $file, string $path_to_child) : bool {
        if (!$file->hasChild()) {
            if ($this->has_entity($path_to_child)) {
                //$this->warn('EntityFile{' . $base_file->getName() . '} did not have a child ID but cached path{' . $path_to_child . '} exists as a DB record, deleting the record!');
                $this->remove_entity($this->get_entity($path_to_child));
            }
            return false;
        }
        return true;
    }

    protected function set_entity_file_child(EntityFile $parent, EntityFile $child) : void {
        if ($parent->getChild() === null) {
            $parent->setChild($child);
        }
        if ($child->getParent() === null) {
            $child->setParent($parent);
        }
        $this->save_entity($parent);
        $this->save_entity($child, true);
    }

    private function create_new_child_entity(EntityFile $file, string $path_to_child, array $options) : EntityInterface {
        $child = $this->create_new_entity($path_to_child, false);
        foreach ($options as $key => $value) {
            $child->set_flag($key, $value);
        }
        $this->set_entity_file_child($file, $child);
        return $child;
    }

    public function ensure_file_have_child(EntityFile $file, string $path_to_child, string $flag) : EntityInterface {
        if (!$this->does_child_file_exist_as_needed($file, $path_to_child)) {
            $options        = $file->get_flags();
            $options[$flag] = true;
            switch ($flag) {
                case EntityFile::FLAG_GZIP:
                    UFO::gzip($file->getFullPath(), $path_to_child);
                    return $this->create_new_child_entity($file, $path_to_child, $options);
                case EntityFile::FLAG_MINIFY:
                    switch ($file->getFileType()) {
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
                    return $this->create_new_child_entity($file, $path_to_child, $options);
                case EntityFile::FLAG_PRE_PROCESS:
                    return $this->create_new_child_entity($file, $path_to_child, $options);
            }
        }
        return $file->getChild();
    }

    protected function event_entity_created(EntityInterface $entity, $data): void {
        $this->record_file_state($entity, self::FILE_STATE_CREATED);
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
        if ($this->has_entity($file_path)) {
            $file = $this->get_entity($file_path);
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

    protected function event_before_remove_entity(EntityInterface $entity): void {
        if ($entity->hasChild()) {
            $this->remove_entity($entity->getChild());
        }
    }
}
