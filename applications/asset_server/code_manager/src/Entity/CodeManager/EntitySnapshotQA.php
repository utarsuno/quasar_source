<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldIntFour;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldEntityPointer;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructure\CacheTable\CacheTableInterface;
use QuasarSource\DataStructure\CacheTable\TraitCacheTable;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Doctrine\Entity\Field\Number\Float\TraitFloat0;
use QuasarSource\Doctrine\Entity\Field\Time\TraitUnixTime0;

/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoSnapshotQA")
 * @Table(name="snapshot_qa")
 */
class EntitySnapshotQA extends AbstractEntity implements CacheTableInterface {
    use TraitCacheTable;

    // The time instance that this test was ran at.
    use TraitUnixTime0;
    // {total time, in seconds, for all unit-tests}
    use TraitFloat0;
    // Num unit-tests failed, errored, skipped, overall.
    use FieldIntFour;
    // Raw output of QA run.
    use TraitText0;
    // A pointer to the EntityFile (the reference to the physical file containing the QA report).
    use FieldEntityPointer;

    /** @var string $db_table_name */
    public static $db_table_name = 'snapshot_qa';

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
            return new ProjectTestSuiteResult($this->entity_file->getPath());
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
}
