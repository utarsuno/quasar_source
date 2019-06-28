<?php declare(strict_types=1);

namespace CodeManager\Service\Feature\Config;


/**
 * Interface FeatureConfigUniversalInterface
 * @package CodeManager\Service\Feature\Config
 */
interface FeatureConfigUniversalInterface {

    /**
     * @param  string $key
     * @return mixed
     */
    public function config_universal_get(string $key);

}
