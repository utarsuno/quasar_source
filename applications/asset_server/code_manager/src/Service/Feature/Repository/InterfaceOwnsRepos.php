<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Repository;

use Doctrine\Common\Persistence\ObjectRepository;

/**
 * Interface InterfaceOwnsRepos
 * @package CodeManager\Service\Abstractions
 */
interface InterfaceOwnsRepos {

    /**
     * @param  string $repo_class
     * @return ObjectRepository
     */
    public function get_repo(string $repo_class): ObjectRepository;
}
