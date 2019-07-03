<?php declare(strict_types=1);

namespace CodeManager\Entity\Finance\Binance;

use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Table;


/**
 * Class EntityBinanceBalance
 * @package CodeManager\Entity\Finance\Binance
 *
 * @ORM\Entity(repositoryClass="CodeManager\Repository\Finance\Binance\EntityBinanceBalanceRepository")
 * @Table(name="_Code_Manager___Entity___Finance___Binance___Entity_Binance_Balance")
 */
class EntityBinanceBalance {
    use FieldID;
    // JSON data containing balances of all coins greater than zero.
    use FieldText;
    // The time instance that the balance was checked at.
    use FieldUnixTime;
}
