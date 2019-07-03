<?php declare(strict_types=1);

namespace QuasarSource\SQL\Representation;

/**
 * Interface InterfaceSQLQueryOwner
 * @package QuasarSource\SQL\Representation
 */
interface InterfaceSQLQueryOwner {

    /**
     * @param string $key
     * @return mixed
     */
    public function get_attribute(string $key);

}
