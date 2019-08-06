<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Doctrine\Entity\Field\Time\TraitUnixTime0;


/**
 * Class EntityBinanceBalance
 * @package CodeManager\Entity\Finance\Binance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\Binance\RepoBinanceBalance")
 * @Table(name="binance_balance")
 */
class EntityBinanceBalance extends AbstractEntity {
    // JSON data containing balances of all coins greater than zero.
    use TraitText0;
    // The time instance that the balance was checked at.
    use TraitUnixTime0;

    /** @var string $db_table_name */
    public static $db_table_name = 'binance_balance';
}
