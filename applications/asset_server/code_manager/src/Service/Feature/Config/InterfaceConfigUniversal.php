<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Config;

/**
 * Interface InterfaceConfigUniversal
 * @package CodeManager\Service\Feature\Config
 */
interface InterfaceConfigUniversal {

    /**
     * @param  string $key
     * @return mixed
     */
    public function config_universal_get(string $key);

}
