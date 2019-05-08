<?php

namespace CodeManager\Abstractions;

interface EntityInterface {

    public function cache_needs_to_be_checked() : bool;

    public function cache_set_to_checked() : void;

    public function cache_needs_to_be_updated() : bool;

    public function cache_update() : void;

    public function on_event_first_new_creation($data) : void;

}
