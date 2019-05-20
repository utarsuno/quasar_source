<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\EntityFile;
use CodeManager\Repository\Abstractions\AbstractRepository;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;
use QuasarSource\Utilities\Files\FileUtilities           as UFO;


class EntityFileRepository extends AbstractRepository {

    protected $default_search_attribute = 'full_path';
    protected $entity_class             = EntityFile::class;

    public function does_child_file_exist_as_needed(EntityFile $file, string $path_to_child) : bool {
        if (!$file->hasChild()) {
            if ($this->has_entity($path_to_child)) {
                var_dump($file->getFullName());
                var_dump('EntityFile{' . $file->getFullName() . '} did not have a child ID but cached path{' . $path_to_child . '} exists as a DB record, deleting the record!');
                exit();
                $this->remove_entity($this->get_entity($path_to_child));
            }
            return false;
        }
        return true;
    }

    protected function set_entity_file_child(EntityFile $parent, EntityFile $child): void {
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
        $child->set_flags($options);
        $this->set_entity_file_child($file, $child);
        return $child;
    }

    public function ensure_file_has_child(EntityFile $file, string $path_to_child, string $flag) : EntityInterface {
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
            $file->set_state(EntityState::STATE_UPDATED);
            $file->getChild()->set_state(EntityState::STATE_CREATED);
        } else {
            // TODO: probably wrong logic here
            $file->getChild()->set_state(EntityState::STATE_NO_CHANGE);
        }
        return $file->getChild();
    }

    protected function event_before_remove_entity(EntityInterface $entity): void {
        var_dump('REMOVING CHILD!');
        var_dump($entity->getName());
        #var_dump($entity);
        if ($entity->hasParent()) {
            $parent = $entity->getParent();
            $parent->remove_child();
            $entity->remove_parent();
            $this->save_entity($parent);
            $this->save_entity($entity);
        }
        if ($entity->hasChild()) {
            $this->remove_entity($entity->getChild());
        }
    }
}
