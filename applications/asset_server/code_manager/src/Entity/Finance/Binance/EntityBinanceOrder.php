<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBinanceOrder
 * @package CodeManager\Entity\Finance\Binance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\EntityCashFlowRepository")
 * @Table(name="binance_order")
 */
class EntityBinanceOrder {
    use FieldID;
    // Represents the coin trade pair ex: {BATBTC} which is BAT to BTC.
    use FieldText;
}
