<?php

namespace CodeManager\Entity\Abstractions;

interface EntityInterface {

    public function cache_needs_update(bool $trigger_update): bool;

    public function cache_update(bool $update_state=true): void;

    public function on_event_born($data): void;

}
