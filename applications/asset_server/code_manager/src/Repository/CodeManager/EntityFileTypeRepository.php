<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Repository\Abstractions\AbstractRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping;
use QuasarSource\Utilities\Exception\LogicException;

/**
 * Class EntityFileTypeRepository
 * @package CodeManager\Repository\CodeManager
 */
class EntityFileTypeRepository extends AbstractRepository {

    protected $entity_class = EntityFileType::class;

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
