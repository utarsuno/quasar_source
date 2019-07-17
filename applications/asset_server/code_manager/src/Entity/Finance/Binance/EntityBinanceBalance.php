<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBinanceBalance
 * @package CodeManager\Entity\Finance\Binance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\Binance\RepoBinanceBalance")
 * @Table(name="binance_balance")
 */
class EntityBinanceBalance extends AbstractEntity {
    // JSON data containing balances of all coins greater than zero.
    use FieldText;
    // The time instance that the balance was checked at.
    use FieldUnixTime;

    /** @var string $db_table_name */
    public static $db_table_name = 'binance_balance';
}
