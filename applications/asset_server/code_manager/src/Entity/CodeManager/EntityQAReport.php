<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldFloat;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntFour;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use CodeManager\Entity\Abstractions\Traits\Time\FieldUnixTime;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityQAReportRepository")
 * @Table(name="_Code_Manager___Entity___Code_Manager___Entity_Q_A_Report")
 */
class EntityQAReport extends EntityState implements EntityInterface, CacheTableInterface {
    use TraitCacheTable;

    use FieldID;
    // The time instance that this test was ran at.
    use FieldUnixTime;
    // The total time taken (in seconds) for all unit-tests.
    use FieldFloat;
    // Num unit-tests failed, errored, skipped, overall.
    use FieldIntFour;
    // Raw output of QA run.
    use FieldText;
    // A pointer to the EntityFile (the reference to the physical file containing the QA report).
    use FieldEntityPointer;

    private const CACHE_KEY_QA_TEST_SUITE = 'cache_qa_test_suite';

    public function cache_needs_update(bool $trigger_update): bool {
        if ($this->getEntityFile(true)->cache_needs_update(false)) {
            if ($trigger_update) {
                $this->cache_update();
            }
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     */
    public function cache_calculate(string $key) {
        if ($key === self::CACHE_KEY_QA_TEST_SUITE) {
            return new ProjectTestSuiteResult($this->entity_file->getFullPath());
        }
        return null;
    }

    public function cache_update(bool $update_state=true) : void {
        /** @var ProjectTestSuiteResult $qa_results */
        $qa_results = $this->cache_get(self::CACHE_KEY_QA_TEST_SUITE);
        $this
            ->setNumElements($qa_results->get_num_assertions())
            ->setNumErrors($qa_results->get_num_errors())
            ->setNumFailed($qa_results->get_num_failed())
            ->setDuration($qa_results->get_time_taken())
            ->setNumElements($qa_results->get_num_tests())
            ->setNumSkipped($qa_results->get_num_skipped())
            ->setUnixTimestamp(-1)
            ->setJSONMetaData($qa_results->get_qa_report());
    }

    public function on_event_born($data): void {
        $this->setEntityFile($data);
        $this->cache_update();
    }
}
