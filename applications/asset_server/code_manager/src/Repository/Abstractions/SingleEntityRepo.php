<?php declare(strict_types=1);

namespace CodeManager\Repository\Abstractions;

use CodeManager\Entity\Abstractions\AbstractEntity;

/**
 * Class SingleEntityRepo
 * @package CodeManager\Repository\Abstractions
 */
abstract class SingleEntityRepo extends QueryableRepo {

    /** @var AbstractEntity $current_entity */
    protected $current_entity;

    /** @var string $entity_short_name */
    protected $entity_short_name;

    /** @var bool $current_entity_was_created */
    protected $current_entity_was_created;

    /** @var bool $current_entity_was_re_used */
    protected $current_entity_was_re_used;

    /**
     * @return AbstractEntity
     */
    public function get_current_entity(): AbstractEntity {
        if ($this->current_entity === null) {
            if ($this->is_empty()) {
                $this->current_entity = $this->set_current_entity(null);
            } else {
                $this->current_entity = $this->set_current_entity($this->get_latest());
            }
        }
        return $this->current_entity;
    }

    /**
     * @param AbstractEntity $entity
     */
    public function mark_current_entity_as_created(AbstractEntity $entity): void {
        $this->current_entity_was_re_used = false;
        $this->current_entity_was_created = true;
        $this->current_entity             = $entity;
    }

    /**
     * @param  int $previous_entity_id
     * @return AbstractEntity
     */
    public function re_use_previous_entity(int $previous_entity_id): AbstractEntity {
        $this->current_entity_was_created = false;
        $this->current_entity_was_re_used = true;
        /** @var AbstractEntity $previous_entity */
        $previous_entity                  = $this->find_by_id($previous_entity_id);
        #$this->current_entity             = $previous_entity;
        return $previous_entity;
    }

    /**
     * @return bool
     */
    public function was_current_entity_created(): bool {
        return $this->current_entity_was_created;
    }

    /**
     * @return bool
     */
    public function was_current_entity_re_used(): bool {
        return $this->current_entity_was_re_used;
    }

    /**
     * @param  array|null $prev_entity_data
     * @return AbstractEntity
     */
    abstract protected function set_current_entity(array $prev_entity_data=null): AbstractEntity;

}
