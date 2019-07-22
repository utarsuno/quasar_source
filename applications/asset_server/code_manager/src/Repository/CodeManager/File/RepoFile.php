<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Repository\Abstractions\AbstractRepo;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use QuasarSource\Utils\Exception\ParameterException;
use QuasarSource\Utils\File\Discrete\CSSUtilities;
use QuasarSource\Utils\File\Discrete\HTMLUtils;
use QuasarSource\Utils\File\UtilsFile as UFO;

/**
 * Class RepoFile
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoFile extends AbstractRepo {

    protected $default_search_attribute = 'full_path';
    public const ENTITY_CLASS           = EntityFile::class;
    protected $entity_class             = EntityFile::class;

    /**
     * @param EntityManagerInterface $em
     * @param ClassMetadata          $class
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        #$this->query_manager->set_table_name(TABLE::CODE_BUILDS);
        #$this->query_manager->set_sort_field(FIELD::TIME_END);
    }

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

    private function create_new_child_entity(EntityFile $file, string $path_to_child, array $options): EntityInterface {
        $child = $this->create_new_entity($path_to_child, false);
        $child->set_flags($options);
        $this->set_entity_file_child($file, $child);
        return $child;
    }

    /**
     * @param EntityFile $file
     * @param string $path_to_child
     * @param string $flag
     * @return EntityInterface
     * @throws ParameterException
     */
    public function ensure_file_has_child(EntityFile $file, string $path_to_child, string $flag): EntityInterface {
        if (!$this->does_child_file_exist_as_needed($file, $path_to_child)) {
            $options        = $file->get_flags();
            $options[$flag] = true;
            switch ($flag) {
                case EntityFile::FLAG_GZIP:
                    UFO::gzip($file->getFullPath(), $path_to_child);
                    return $this->create_new_child_entity($file, $path_to_child, $options);
                case EntityFile::FLAG_MINIFY:
                    switch ($file->getType()) {
                        case EntityFile::TYPE_HTML:
                            #UFO::minify_html($file->getFullPath(), $path_to_child);
                            HTMLUtils::minify($file->getFullPath(), $path_to_child);
                            break;
                        case EntityFile::TYPE_CSS:
                            #UFO::minify_css($file->getFullPath(), $path_to_child);
                            CSSUtilities::minify($file->getFullPath(), $path_to_child);
                            break;
                        default:
                            throw ParameterException::invalid_function_parameter('ensure_file_has_child', 'file type not supported {' . $path_to_child . '}');
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
