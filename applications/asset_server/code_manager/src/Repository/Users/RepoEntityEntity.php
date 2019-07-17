<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;

use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Entity\Users\EntityEntityEntityAlias;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Service\DBService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use QuasarSource\Utilities\DataType\UtilsString as STR;

/**
 * Class RepoUser
 * @package CodeManager\Repository\Users
 */
class RepoEntityEntity extends AbstractRepository {

    public const ENTITY_CLASS = EntityEntity::class;
    protected $entity_class   = EntityEntity::class;

    /** @var RepoEntityEntityAlias $repo_entity_entity_aliases */
    protected $repo_entity_entity_aliases;

    private $cache_aliases;

    /**
     * @param EntityManagerInterface $em
     * @param ClassMetadata          $class
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->repo_entity_entity_aliases = $this->get_repo(EntityEntityEntityAlias::class);
    }

    /**
     * @param  EntityEntity $user
     * @return array
     */
    public function get_entity_entity_aliases(EntityEntity $user): array {
        return [];
        #return $this->repo_user_aliases->get_aliases_for_user($user);
    }

    /**
     * @param  DBService $db_service
     * @param  string $search_text
     * @return object|null
     */
    public function find_user_match(DBService $db_service, string $search_text) {
        if ($this->cache_aliases === null) {
            $this->cache_aliases = $this->repo_entity_entity_aliases->get_all_aliases($db_service);
        }
        foreach ($this->cache_aliases as $alias => $data) {
            if (STR::has($search_text, $alias, $data[1])) {
                return $this->get_entity_by_id($data[0]);
            }
        }
        return null;
    }
}
