<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use CodeManager\Entity\Abstractions\Traits\Number\Decimal\FieldDuration;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Relations\FieldHasPointerToEntityFile;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldNumErrors;
use CodeManager\Entity\Abstractions\Traits\Text\FieldJSONMetaData;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldNumElements;
use CodeManager\Entity\Abstractions\Traits\Time\FieldRanAt;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldNumFailed;
use CodeManager\Entity\Abstractions\Traits\Number\Whole\FieldNumSkipped;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructures\Cached;
use QuasarSource\DataStructures\TraitCached;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;


/**
 * Class EntityDirectory
 * @package CodeManager\Entity
 *
 * @Entity(repositoryClass="CodeManager\Repository\EntityQAReportRepository")
 * @Table(
 *     name="qa_report",
 *     indexes={
 *         @Index(
 *             name="search_entity_qa_report",
 *             columns={"ran_at", "num_errors"}
 *         )
 *     }
 * )
 */
class EntityQAReport extends EntityState implements EntityInterface, Cached {
    use TraitCached;

    use FieldID;
    // The DateTime that this test was ran at.
    use FieldRanAt;
    // The total time taken (in seconds) for all unit-tests.
    use FieldDuration;
    // The number of unit-tests that failed.
    use FieldNumFailed;
    // The number of unit-tests that had errors.
    use FieldNumErrors;
    // The number of unit-tests were skipped.
    use FieldNumSkipped;
    // The number of unit-tests overall.
    use FieldNumElements;
    // Raw output of QA run.
    use FieldJSONMetaData;
    // The reference to the physical file containing the QA report.
    use FieldHasPointerToEntityFile;

    public const TABLE_NAME      = 'qa_report';
    public const SORT_FIELD_TIME = 'ran_at';

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

    public function cache_set(string $key): void {
        if ($key === self::CACHE_KEY_QA_TEST_SUITE) {
            $this->cached_values[$key] = new ProjectTestSuiteResult($this->entity_file->getFullPath());
        }
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
            ->setRanAtNow()
            ->setJSONMetaData($qa_results->get_qa_report());
    }

    public function on_event_born($data): void {
        $this->setEntityFile($data);
        $this->cache_update();
    }
}
