<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityBinanceTrade
 * @package CodeManager\Entity\Finance\Binance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\Binance\RepoBinanceTrade")
 * @Table(name="binance_trade")
 */
class EntityBinanceTrade extends AbstractEntity {
    // Represents the coin trade pair ex: {BATBTC} which is BAT to BTC.
    use FieldText;
    // A pointer to the parent EntityBinanceOrder.
    use FieldEntityPointer;

    /** @var string $db_table_name */
    public static $db_table_name = 'binance_trade';
}
