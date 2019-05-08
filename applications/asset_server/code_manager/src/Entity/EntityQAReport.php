<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-21
 * Time: 00:06
 */

namespace CodeManager\Entity;

use CodeManager\Abstractions\EntityInterface;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\QualityAssurance\ProjectTestSuiteResult;
use QuasarSource\Utilities\DateTimeUtilities as TIME;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities;


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
class EntityQAReport implements EntityInterface {

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

    private $qa_test_suite;

    public function cache_needs_to_be_checked() : bool {
        if ($this->entity_file === null) {
            ExceptionUtilities::throw_exception('EntityQAReport does not have {entity_file} set.');
        }
        return $this->entity_file->has_sha512sum_changed();
    }

    public function cache_needs_to_be_updated(): bool {
        return $this->cache_needs_to_be_checked();
    }

    public function cache_set_to_checked(): void{}

    public function cache_update() : void {
        $this->qa_test_suite = new ProjectTestSuiteResult($this->entity_file->getFullPath());
        $qa_test_suite       = $this->qa_test_suite;
        $this->setNumAssertions($qa_test_suite->get_num_assertions());
        $this->setNumErrors($qa_test_suite->get_num_errors());
        $this->setNumFailed($qa_test_suite->get_num_failed());
        $this->setSecondsTaken($qa_test_suite->get_time_taken());
        $this->setNumTests($qa_test_suite->get_num_tests());
        $this->setNumSkipped($qa_test_suite->get_num_skipped());
        $this->setRanAt(TIME::now());
        $this->setRawReport($qa_test_suite->get_qa_report());
    }

    public function on_event_first_new_creation($data): void {
        #var_dump($data);
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
     */
    public function setRawReport(string $raw_report): void {
        $this->raw_report = $raw_report;
    }

    /**
     * @return float
     */
    public function getSecondsTaken(): float {
        return $this->seconds_taken;
    }

    /**
     * @param float $seconds_taken
     */
    public function setSecondsTaken(float $seconds_taken): void {
        $this->seconds_taken = $seconds_taken;
    }

    /**
     * @return int
     */
    public function getNumAssertions(): int {
        return $this->num_assertions;
    }

    /**
     * @param int $num_assertions
     */
    public function setNumAssertions(int $num_assertions): void {
        $this->num_assertions = $num_assertions;
    }

    /**
     * @return int
     */
    public function getNumErrors(): int {
        return $this->num_errors;
    }

    /**
     * @param int $num_errors
     */
    public function setNumErrors(int $num_errors): void {
        $this->num_errors = $num_errors;
    }

    /**
     * @return int
     */
    public function getNumFailed(): int {
        return $this->num_failed;
    }

    /**
     * @param int $num_failed
     */
    public function setNumFailed(int $num_failed): void {
        $this->num_failed = $num_failed;
    }

    /**
     * @return int
     */
    public function getNumSkipped(): int {
        return $this->num_skipped;
    }

    /**
     * @param int $num_skipped
     */
    public function setNumSkipped(int $num_skipped): void {
        $this->num_skipped = $num_skipped;
    }

    /**
     * @return int
     */
    public function getNumTests(): int {
        return $this->num_tests;
    }

    /**
     * @param int $num_tests
     */
    public function setNumTests(int $num_tests): void {
        $this->num_tests = $num_tests;
    }

    /**
     * @return mixed
     */
    public function getRanAt() {
        return $this->ran_at;
    }

    /**
     * @param mixed $ran_at
     */
    public function setRanAt($ran_at): void {
        $this->ran_at = $ran_at;
    }

    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id): void {
        $this->id = $id;
    }

    /**
     * @return EntityFile
     */
    public function getEntityFile(): EntityFile {
        return $this->entity_file;
    }

    /**
     * @param EntityFile $entity_file
     */
    public function setEntityFile(EntityFile $entity_file): void {
        $this->entity_file = $entity_file;
    }
}
