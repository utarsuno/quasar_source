<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions;

abstract class EntityState {

    // TODO: Event callbacks?

    public const STATE_NOT_SET   = 'not_set';
    public const STATE_CREATED   = 'created';
    public const STATE_UPDATED   = 'updated';
    public const STATE_DELETED   = 'deleted';
    public const STATE_NO_CHANGE = 'no_change';

    /** @var string */
    protected $entity_state      = self::STATE_NOT_SET;

    public function set_state(string $state): void {
        $this->entity_state = $state;
    }

    public function has_set_state(): bool {
        return $this->entity_state !== self::STATE_NOT_SET;
    }

    abstract public function on_event_born($data): void;
}

