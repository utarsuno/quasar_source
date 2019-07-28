<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

/**
 * Class UtilsWebManifest
 * @package QuasarSource\Utils\File\Discrete
 */
abstract class UtilsWebManifest {

    public static function generate_text_contents(

    ): string {
        // TODO : THIS SHOULD LIKELY BE A HTTP CONSTANT OF SOME SORT
        $manifest = 'data:application/manifest+json';
        return $manifest;
    }

}
