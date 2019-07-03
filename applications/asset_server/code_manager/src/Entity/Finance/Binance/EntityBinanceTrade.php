<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBinanceTrade
 * @package CodeManager\Entity\Finance\Binance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\Binance\EntityBinanceTradeRepository")
 * @Table(name="_Code_Manager___Entity___Finance___Binance___Entity_Binance_Trade")
 */
class EntityBinanceTrade {
    use FieldID;
    // Represents the coin trade pair ex: {BATBTC} which is BAT to BTC.
    use FieldText;
    // A pointer to the parent EntityBinanceOrder.
    use FieldEntityPointer;
}
