<?php

namespace CodeManager\Repository\CodeManager;

use CodeManager\Entity\Abstractions\EntityInterface;
use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Repository\Abstractions\AbstractRepository;
use CodeManager\Repository\Abstractions\QueryableRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping;


class EntityCodeBuildRepository extends QueryableRepository {

    protected $entity_class = EntityCodeBuild::class;
    #protected $default_search_attribute = 'username';

    public function __construct(EntityManagerInterface $em, Mapping\ClassMetadata $class) {
        parent::__construct($em, $class);
        $this->set_table_name(EntityCodeBuild::TABLE_NAME);
        $this->set_sort_field_time(EntityCodeBuild::SORT_FIELD_TIME);
    }

    public function get_datetime_of_last_successful_build(): ?DateTime {
        #$results = $this->execute_query(QueryGenerator::get_db_size('postgres', false), true);
        #var_dump('Here are query results!');
        #var_dump($results);

        #var_dump($this->get_table_size());
        #var_dump($this->get_newest_entity());
        #var_dump($this->get_oldest_entity());

        $entity = $this->get_newest_entity();
        #var_dump('The newest entity is:');
        #ar_dump($entity);

        return $entity;
    }

    protected function event_before_remove_entity(EntityInterface $entity): void {

    }
}



