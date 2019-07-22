<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\CodeManager\File\EntityFileType;
use CodeManager\Repository\Abstractions\AbstractRepo;
use QuasarSource\Utils\Exception\LogicException;

/**
 * Class RepoFileType
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoFileType extends AbstractRepo {

    public const ENTITY_CLASS = EntityFileType::class;
    protected $entity_class   = EntityFileType::class;

    public function populate_enum_if_empty(): void {
        // TODO: query abstraction/table abstraction to see if table is empty
    }

    /**
     * @param EntityInterface $entity
     * @throws LogicException
     */
    protected function event_before_remove_entity(EntityInterface $entity): void{
        throw LogicException::invalid_function_call('event_before_remove_entity', 'EntityFileType is a read only enum!');
    }
}
