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


/*
asset_server       |   array(16) {
asset_server       |     ["orderId"]=>
asset_server       |     int(82867589)
asset_server       |     ["clientOrderId"]=>
asset_server       |     string(22) "Sl9EcSrqAguN3fFRjpuVVh"
asset_server       |     ["price"]=>
asset_server       |     string(10) "0.00004155"
asset_server       |     ["origQty"]=>
asset_server       |     string(13) "2000.00000000"
asset_server       |     ["executedQty"]=>
asset_server       |     string(13) "2000.00000000"
asset_server       |     ["cummulativeQuoteQty"]=>
asset_server       |     string(10) "0.08310000"
asset_server       |     ["status"]=>
asset_server       |     string(6) "FILLED"
asset_server       |     ["timeInForce"]=>
asset_server       |     string(3) "GTC"
asset_server       |     ["type"]=>
asset_server       |     string(5) "LIMIT"
asset_server       |     ["side"]=>
asset_server       |     string(3) "BUY"
asset_server       |     ["stopPrice"]=>
asset_server       |     string(10) "0.00000000"
asset_server       |     ["icebergQty"]=>
asset_server       |     string(10) "0.00000000"
asset_server       |     ["time"]=>
asset_server       |     int(1559463867238)
asset_server       |     ["updateTime"]=>
asset_server       |     int(1559463873069)
asset_server       |     ["isWorking"]=>
asset_server       |     bool(true)
asset_server       |   }
 */