<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Repository\Abstractions\AbstractRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use CodeManager\Entity\Abstractions\Traits\Enum\EntityTableNames as TABLE;
use CodeManager\Entity\Abstractions\Traits\Enum\EntityFields     as FIELD;
use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * Class EntityCodeBuildRepository
 * @package CodeManager\Repository\CodeManager
 */
class EntityCodeBuildRepository extends AbstractRepository {

    protected $entity_class = EntityCodeBuild::class;
    #protected $default_search_attribute = 'username';

    /**
     * EntityCodeBuildRepository constructor.
     * @param EntityManagerInterface $em
     * @param ClassMetadata          $class
     */
    public function __construct(EntityManagerInterface $em, ClassMetadata $class) {
        parent::__construct($em, $class);
        #$this->query_manager->set_table_name(TABLE::CODE_BUILDS);
        #$this->query_manager->set_sort_field(FIELD::TIME_START);
    }

    public function fetch_or_generate_last_build(): EntityCodeBuild {
        var_dump($this->get_table_size());

        exit(3);

        #var_dump($this->get_table_num_rows());

        var_dump($this->analyze_table());

        $table_rows = $this->get_table_num_rows();
        if ($table_rows === 0) {
            return new EntityCodeBuild();
        }
        var_dump('ELSE, HANDLE THIS!');
        exit(2);
    }

    public function get_datetime_of_last_successful_build(): ?DateTime {
        #$results = $this->execute_query(QueryGenerator::get_db_size('postgres', false), true);
        #var_dump('Here are query results!');
        #var_dump($results);

        #var_dump($this->get_table_size());
        #var_dump($this->get_table_num_rows());
        return null;
        #var_dump($this->get_newest_entity());
        #var_dump($this->get_oldest_entity());

        #$entity = $this->get_newest_entity();
        #var_dump('The newest entity is:');
        #var_dump($entity);

        #return $entity;
    }

    protected function event_before_remove_entity(EntityInterface $entity): void {

    }
}



