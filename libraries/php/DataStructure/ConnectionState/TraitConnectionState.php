<?php declare(strict_types=1);

namespace QuasarSource\DataStructure\ConnectionState;

use http\Exception\RuntimeException;

/**
 * Trait TraitConnectionState
 * @package QuasarSource\DataStructure\ConnectionState
 */
trait TraitConnectionState {

    protected $state_connected = false;

    protected function state_engage_connected(): void {
        if (!$this->state_connected) {

        } else {
            throw new RuntimeException();
        }
    }
}
