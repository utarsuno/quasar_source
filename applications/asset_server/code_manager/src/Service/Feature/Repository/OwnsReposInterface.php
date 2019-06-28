<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Repository;

use Doctrine\Common\Persistence\ObjectRepository;

/**
 * Interface OwnsRepos
 * @package CodeManager\Service\Abstractions
 */
interface OwnsReposInterface {

    /**
     * @param string $repo_class
     * @return ObjectRepository
     */
    public function get_repo(string $repo_class): ObjectRepository;
}
