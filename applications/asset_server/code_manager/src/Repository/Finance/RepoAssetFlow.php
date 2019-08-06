<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance;

use CodeManager\Entity\Finance\EntityAssetFlow;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\QueryableRepo;
use CodeManager\Repository\Users\RepoEntityEntity;
use QuasarSource\Utils\DataType\UtilsString   as STR;

/**
 * Class RepoAssetFlow
 * @package CodeManager\Repository\Finance
 */
class RepoAssetFlow extends QueryableRepo {

    protected $entity_class = EntityAssetFlow::class;

    public const TYPE_QUICK_PAY = 2;

    /** @var RepoEntityEntity $repo_users */
    private $repo_users;

    /**
     * @param  int $unix_timestamp
     * @param  int $amount
     * @param  int $from_id
     * @param  int $to_id
     * @param  int $transaction_type
     * @return bool
     */
    public function does_transaction_already_exist(
        int $unix_timestamp,
        int $amount,
        int $from_id,
        int $to_id,
        int $transaction_type
    ): bool {
        return false;
    }

    /**
     * @param  EntityEntity $user
     * @param  string       $csv_path
     * @return void
     */
    public function parse_bank_transactions_for(EntityEntity $user, string $csv_path): void {
        // see var
    }

    /**
     * @param  string $user_key
     * @return EntityEntity
     */
    private function get_user(string $user_key): EntityEntity {
        if ($this->cached_users[$user_key] === null) {
            $this->cached_users[$user_key] = $this->repo_users->find_user_match($this->db_service, $user_key);
        }
        return $this->cached_users[$user_key];
    }

    /**
     * @param  EntityEntity $user
     * @param  string       $user_to_key
     * @param  array        $data
     * @return void
     */
    private function handle_personal_expense(EntityEntity $user, string $user_to_key, array $data): void {
        $entity = new EntityAssetFlow();
        $to     = $this->get_user($user_to_key);

        $entity->set_raw_timestamp($data[1])
            ->set_transaction_type(3)
            ->set_from_to_dynamically($user, $to, $data[3]);

        $this->save($entity, true);
    }

    /**
     * @param  EntityEntity $user
     * @param  array        $data
     * @return void
     */
    private function handle_quick_pay(EntityEntity $user, array $data): void {
        $match  = $this->get_user_match(STR::remove($data[2], ' with Zelle payment'));
        $entity = new EntityAssetFlow();

        $entity->set_raw_timestamp($data[1])
            ->set_transaction_type(2)
            ->set_from_to_dynamically($user, $match, $data[3]);

        $this->save($entity, true);
    }

    /**
     * @param  string $search_text
     * @return EntityEntity
     */
    private function get_user_match(string $search_text): EntityEntity {
        /** @var EntityEntity $entity */
        $entity = $this->repo_users->find_user_match($this->db_service, $search_text);
        return $entity;
    }

    # ------------------------------------ A B S T R A C T I O N   C O N T R A C T  ------------------------------------

    public function set_needed_repos(): void {
        $this->repo_users = $this->db_service->get_repo(EntityEntity::class);
    }
}
