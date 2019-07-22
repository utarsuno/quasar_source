<?php declare(strict_types=1);

namespace QuasarSource\Utils\Math;

/**
 * Class UtilsCryptography
 * @package QuasarSource\Utils\Math
 */
abstract class UtilsCryptography {

    public const SHA512SUM = 'sha512';
    public const SHA256SUM = 'sha256';

    /**
     * @param  string $data [The data to hash.                                   ]
     * @param  string $key  [The key to hash against.                            ]
     * @return string       [A {256} length string representing the hashed value.]
     */
    public static function hmac_sha256(string $data, string $key): string {
        return hash_hmac(self::SHA256SUM, $data, $key);
    }

    /**
     * @param  string $path          [The path of the file to get a hash value of.      ]
     * @param  string $hash_strategy [The hash algorithm to use, determines size of {N}.]
     * @return string                [A {N} length string representing the hashed value.]
     */
    public static function get_file_hash(string $path, string $hash_strategy): string {
        return hash_file($hash_strategy, $path);
    }

}
