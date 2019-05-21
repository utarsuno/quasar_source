<?php

namespace CodeManager\Service\Abstractions;

interface OwnsManagers {
    public function get_manager(string $manager_class): BaseAbstractService;
}