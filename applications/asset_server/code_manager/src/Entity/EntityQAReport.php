<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\Abstractions\EntityState;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\DataStructures\Cached;
use QuasarSource\DataStructures\TraitCached;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Utilities\DateTimeUtilities             as TIME;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


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

    /**
     * @Id
     * @Column(type="integer", nullable=false, unique=true)
     * @GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var EntityFile
     * @ManyToOne(targetEntity="CodeManager\Entity\EntityFile")
     */
    private $entity_file;

    /**
     * @Column(name="ran_at", type="datetime", nullable=false, unique=false)
     */
    private $ran_at;

    /**
     * @var int
     * @Column(name="num_tests", type="integer", nullable=false, unique=false)
     */
    private $num_tests;

    /**
     * @var int
     * @Column(name="num_skipped", type="integer", nullable=false, unique=false)
     */
    private $num_skipped;

    /**
     * @var int
     * @Column(name="num_failed", type="integer", nullable=false, unique=false)
     */
    private $num_failed;

    /**
     * @var int
     * @Column(name="num_errors", type="integer", nullable=false, unique=false)
     */
    private $num_errors;

    /**
     * @var int
     * @Column(name="num_assertions", type="integer", nullable=false, unique=false)
     */
    private $num_assertions;

    /**
     * @var float
     * @Column(name="seconds_taken", type="float", nullable=false, unique=false)
     */
    private $seconds_taken;

    /**
     * @var string
     * @Column(name="raw_report", type="text", nullable=true, unique=false)
     */
    private $raw_report;

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
            ->setNumAssertions($qa_results->get_num_assertions())
            ->setNumErrors($qa_results->get_num_errors())
            ->setNumFailed($qa_results->get_num_failed())
            ->setSecondsTaken($qa_results->get_time_taken())
            ->setNumTests($qa_results->get_num_tests())
            ->setNumSkipped($qa_results->get_num_skipped())
            ->setRanAt(TIME::now())
            ->setRawReport($qa_results->get_qa_report());
    }

    public function on_event_born($data): void {
        $this->setEntityFile($data);
        $this->cache_update();
    }

    /**
     * @return string
     */
    public function getRawReport(): string {
        return $this->raw_report;
    }

    /**
     * @param string $raw_report
     * @return self
     */
    public function setRawReport(string $raw_report): self {
        $this->raw_report = $raw_report;
        return $this;
    }

    /**
     * @return float
     */
    public function getSecondsTaken(): float {
        return $this->seconds_taken;
    }

    /**
     * @param float $seconds_taken
     * @return self
     */
    public function setSecondsTaken(float $seconds_taken): self {
        $this->seconds_taken = $seconds_taken;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumAssertions(): int {
        return $this->num_assertions;
    }

    /**
     * @param int $num_assertions
     * @return self
     */
    public function setNumAssertions(int $num_assertions): self {
        $this->num_assertions = $num_assertions;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumErrors(): int {
        return $this->num_errors;
    }

    /**
     * @param int $num_errors
     * @return self
     */
    public function setNumErrors(int $num_errors): self {
        $this->num_errors = $num_errors;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumFailed(): int {
        return $this->num_failed;
    }

    /**
     * @param int $num_failed
     * @return self
     */
    public function setNumFailed(int $num_failed): self {
        $this->num_failed = $num_failed;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumSkipped(): int {
        return $this->num_skipped;
    }

    /**
     * @param int $num_skipped
     * @return self
     */
    public function setNumSkipped(int $num_skipped): self {
        $this->num_skipped = $num_skipped;
        return $this;
    }

    /**
     * @return int
     */
    public function getNumTests(): int {
        return $this->num_tests;
    }

    /**
     * @param int $num_tests
     * @return self
     */
    public function setNumTests(int $num_tests): self {
        $this->num_tests = $num_tests;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRanAt() {
        return $this->ran_at;
    }

    /**
     * @param mixed $ran_at
     * @return self
     */
    public function setRanAt($ran_at): self {
        $this->ran_at = $ran_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return self
     */
    public function setId($id): self {
        $this->id = $id;
        return $this;
    }

    /**
     * @param bool $raise_exception_if_null < If true, an exception will be thrown if there is no EntityFile set. >
     * @return EntityFile
     */
    public function getEntityFile(bool $raise_exception_if_null=false): EntityFile {
        if ($raise_exception_if_null && $this->entity_file === null) {
            DBG::throw_exception('EntityQAReport does not have {entity_file} set.');
        }
        return $this->entity_file;
    }

    /**
     * @param EntityFile $entity_file
     * @return self
     */
    public function setEntityFile(EntityFile $entity_file): self {
        $this->entity_file = $entity_file;
        return $this;
    }
}
