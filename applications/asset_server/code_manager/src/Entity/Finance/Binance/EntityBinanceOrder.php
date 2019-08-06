<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\AbstractEntity;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityBinanceOrder
 * @package CodeManager\Entity\Finance\Binance
 *
 * @Entity(repositoryClass="CodeManager\Repository\Finance\Binance\RepoBinanceOrder")
 * @Table(name="binance_order")
 */
class EntityBinanceOrder extends AbstractEntity {
    // Represents the coin trade pair ex: {BATBTC} which is BAT to BTC.
    use TraitText0;

    /** @var string $db_table_name */
    public static $db_table_name = 'binance_order';
}
