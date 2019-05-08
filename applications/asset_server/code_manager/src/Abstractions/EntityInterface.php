<?php

namespace CodeManager\Abstractions;

interface EntityInterface {

    public function ensure_cache_up_to_date() : bool;

    public function on_event_first_new_creation($data) : void;

}
