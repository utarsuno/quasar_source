<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntTwo;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointerTwo;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Users\EntityEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Finance\UtilsFinance;
use QuasarSource\SQL\Doctrine\Entity\Field\Time\TraitUnixTime0;
use QuasarSource\Utils\Time\UtilsUnixTime as TIME;

/**
 * Class EntityAssetFlow
 * @package CodeManager\Entity\Finance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\RepoAssetFlow")
 * @Table(name="asset_flow")
 */
class EntityAssetFlow extends AbstractEntity {
    // Description
    use FieldText;
    // Type, Amount.
    use FieldIntTwo;
    // A pointer from Entity and pointer to Entity.
    use FieldEntityPointerTwo;
    // Optional, time of transaction.
    use TraitUnixTime0;

    // TODO: TRANSACTION TYPE

    /** @var string $db_table_name */
    public static $db_table_name = 'asset_flow';

    /** @var string $cache_amount_as_cash */
    private $cache_amount_as_cash;

    /** @var string $cache_raw_timestamp */
    private $cache_raw_timestamp;

    /**
     * @param  mixed $from
     * @param  mixed $to
     * @param  mixed $amount
     * @return EntityAssetFlow
     */
    public function set_from_to_dynamically($from, $to, $amount): self {
        if (is_string($amount)) {
            $amount = UtilsFinance::parse_cash_to_pennies($amount);
        }
        if ($amount < 0) {
            return $this->set_from_to($from, $to)->set_amount($amount * -1)->generate_description($from, $to);
        }
        return $this->set_from_to($to, $from)->set_amount($amount)->generate_description($to, $from);
    }

    /**
     * @param  mixed $from
     * @param  mixed $to
     * @return EntityAssetFlow
     */
    public function set_from_to($from, $to): self {
        return $this->setEntityPointer0($from)->setEntityPointer1($to);
    }

    /**
     * @param  EntityEntity $e0
     * @param  EntityEntity $e1
     * @return EntityAssetFlow
     */
    public function generate_description(EntityEntity $e0, EntityEntity $e1): self {
        return $this->setText0('[' . $this->cache_raw_timestamp . ']-{' . $e0->get_username() . '}->{' . $e1->get_username() . '[' . $this->get_amount_as_cash() . ']');
    }

    /**
     * @param  string $timestamp
     * @return EntityAssetFlow
     */
    public function set_raw_timestamp(string $timestamp): self {
        $this->cache_raw_timestamp = $timestamp;
        return $this->set_timestamp(TIME::parse_string_date($timestamp));
    }

    /**
     * @param  int $amount
     * @return EntityAssetFlow
     */
    public function set_amount(int $amount): self {
        return $this->setInt1($amount);
    }

    /**
     * @return int
     */
    public function get_amount(): int {
        return $this->getInt1();
    }

    /**
     * @return string
     */
    public function get_amount_as_cash(): string {
        if ($this->cache_amount_as_cash === null) {
            $this->cache_amount_as_cash = UtilsFinance::parse_pennies_to_cash($this->get_amount());
        }
        return $this->cache_amount_as_cash;
    }

    /**
     * @param  int $type
     * @return EntityAssetFlow
     */
    public function set_transaction_type(int $type): self {
        return $this->setInt0($type);
    }

    /**
     * @return string
     */
    public function get_summary(): string {
        return '[DATE]-{NAME0}->{NAME1}-[' . $this->get_amount_as_cash() . ']';
    }

    /**
     * @return string
     */
    public function get_info(): string {
        return gmdate("Y-m-d\TH:i:s\Z", (int) $this->getUnixTime0()) . "\t" . $this->getEntityPointer0() . '->' . $this->getEntityPointer1() . "\t" . $this->get_amount() . "\t" . $this->text0;
    }
}
