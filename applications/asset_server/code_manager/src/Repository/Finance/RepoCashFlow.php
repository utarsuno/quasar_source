<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance;
use CodeManager\Entity\Finance\EntityCashFlow;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\AbstractRepository;

/**
 * Class RepoCashFlow
 * @package CodeManager\Repository\Finance
 */
class RepoCashFlow extends AbstractRepository {

    public const ENTITY_CLASS = EntityCashFlow::class;
    protected $entity_class   = EntityCashFlow::class;

    /**
     * @param EntityEntity $base_user
     * @param EntityEntity $to_user
     * @param int          $unix_timestamp
     * @param int          $amount
     * @param string       $description
     */
    public function add_quick_pay_transaction(
        EntityEntity $base_user,
        EntityEntity $to_user,
        int          $unix_timestamp,
        int          $amount,
        string       $description
    ): void {
        $entity = new EntityCashFlow();
        $entity->set_timestamp($unix_timestamp)
            ->set_amount($amount)
            ->setText0($description)
            ->set_transaction_type(2)
            ->setEntityPointer0($base_user->getId())
            ->setEntityPointer1($to_user->getId());
        $this->save_entity($entity, true);
    }

}
