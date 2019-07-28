<?php declare(strict_types=1);

namespace CodeManager\Repository\Users;

use CodeManager\Entity\Users\EntityEntityEntityAlias;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Service\DBService;

/**
 * Class RepoEntityEntityAlias
 * @package CodeManager\Repository\Users
 */
class RepoEntityEntityAlias extends QueryableRepo {

    public const ENTITY_CLASS = EntityEntityEntityAlias::class;

    /**
     * @param  int $user_id
     * @return array
     */
    public function get_aliases_for_user(int $user_id): array {
        $names = $this->execute_custom_query(
            'SELECT text0 FROM entity_entity WHERE id = ' . $user_id
        );
        var_dump('NAMES!');
        var_dump($names);
        return $names;
    }

    /**
     * @param  DBService $db_service
     * @return array
     */
    public function get_all_aliases(DBService $db_service): array {
        $aliases = [];
        $data    = $this->execute_custom_query(
            'SELECT entity_pointer0, text0, bool0 FROM entity_entity_alias;'
        );
        foreach ($data as $alias) {
            $aliases[$alias[1]] = [$alias[0], $alias[2]];
        }
        return $aliases;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------
    public function set_needed_repos(): void {}
}
