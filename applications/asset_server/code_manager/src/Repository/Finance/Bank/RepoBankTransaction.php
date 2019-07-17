<?php declare(strict_types=1);

namespace CodeManager\Repository\Finance\Bank;
use CodeManager\Entity\Finance\Bank\EntityBankTransaction;
use CodeManager\Entity\Users\EntityEntity;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Repository\Finance\RepoCashFlow;
use CodeManager\Repository\Users\RepoEntityEntity;
use CodeManager\Service\DBService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use QuasarSource\CommonFeatures\TraitEnvironmentVariablesAsFields;
use QuasarSource\Utilities\DataType\UtilsString   as STR;
use QuasarSource\Utilities\File\Discrete\UtilsCSV as CSV;

/**
 * Class RepoBankTransaction
 * @package CodeManager\Repository\Finance\Bank
 */
class RepoBankTransaction extends AbstractRepository {
    use TraitEnvironmentVariablesAsFields;

    protected $entity_class   = EntityBankTransaction::class;
    public const ENTITY_CLASS = EntityBankTransaction::class;

    /** @var string $env_path_transactions_file */
    private $env_path_transactions_file;

    /**
     * @param EntityManagerInterface $em
     * @param ClassMetadata  $class
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->env_set_as_str('DB_DATA_CSV', 'env_path_transactions_file');
    }

    #@param EntityUser $user
    #EntityUser $user

    /**
     * @param DBService        $db_service
     * @param EntityEntity     $base_user
     * @param RepoEntityEntity $repo_users
     * @param RepoCashFlow     $repo_cash_flow
     */
    public function parse_transactions_file(
        DBService        $db_service,
        EntityEntity     $base_user,
        RepoEntityEntity $repo_users,
        RepoCashFlow     $repo_cash_flow
    ): void {

        $csv = CSV::get($this->env_path_transactions_file);
        #var_dump($csv[0]);
        #var_dump($csv[1]);

        $data = [];

        $index = 1;
        $total = count($csv);
        while ($index < $total) {
            $line    = $csv[$index];
            $date    = strtotime($line[1]);
            $content = $line[2];

            if (STR::has($content, 'QuickPay')) {
                STR::ref_remove($content, ' with Zelle payment');
                /** @var EntityEntity $match */
                $match = $repo_users->find_user_match($db_service, $content);
                if ($match !== null) {
                    $datetime = $line[1];
                    $repo_cash_flow->add_quick_pay_transaction(
                        $base_user,
                        $match,
                        $date,
                        (int) ((float) $line[3] * 100.0),
                        $datetime
                    );
                }
            }
            #exit();

            ++$index;
        }
        exit();
    }

    private function parse_transaction_quick_pay() {

    }

}
