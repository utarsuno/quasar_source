<?php declare(strict_types=1);

namespace QuasarSource\Utilities\SQL\Feature;

use QuasarSource\Utilities\SQL\Representation\SQLQuery;

/**
 * Trait TraitQueryCache
 */
trait TraitQueryCache {
    /**
     * @param string $field_name
     * @return bool
     */
    public function cache_is_cold(string $field_name): bool {
        /** @noinspection PhpVariableVariableInspection */
        if ($this->$field_name === null) {
            /** @noinspection PhpVariableVariableInspection */
            $this->$field_name = SQLQuery::new();
            return true;
        }
        return false;
    }

    /**
     * @param SQLQuery $query
     * @return mixed|mixed[]
     */
    public function first_execute(SQLQuery $query) {
        return $query->prepare($this->connection)->execute();
    }

}
