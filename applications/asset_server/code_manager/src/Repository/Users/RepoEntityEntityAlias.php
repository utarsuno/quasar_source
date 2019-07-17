<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:15
 */

namespace CodeManager\Repository\Users;

use CodeManager\Entity\Users\EntityEntityEntityAlias;
use CodeManager\Repository\Abstractions\QueryableRepository;
use CodeManager\Service\DBService;

/**
 * Class RepoEntityEntityAlias
 * @package CodeManager\Repository\Users
 */
class RepoEntityEntityAlias extends QueryableRepository {

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
        $this->ensure_db_table_exists($db_service);
        $aliases = [];
        $data    = $this->execute_custom_query(
            'SELECT entity_pointer0, text0, bool0 FROM entity_entity_alias;'
        );
        foreach ($data as $alias) {
            $aliases[$alias[1]] = [$alias[0], $alias[2]];
        }
        return $aliases;
    }

    private function ensure_db_table_exists(DBService $db_service): void {
        if ($this->db_table === null) {
            $this->set_db_table($db_service, EntityEntityEntityAlias::class);
        }
    }

}
