<?php

namespace CodeManager\Service\Abstractions;

use Doctrine\Common\Persistence\ObjectRepository;

interface OwnsRepos {
    public function get_repo(string $repo_class): ObjectRepository;
}