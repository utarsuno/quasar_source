<?php declare(strict_types=1);

namespace QuasarSource\Enums;
use QuasarSource\Enums\EnumFileCategory as CATEGORY;


abstract class EnumFileType {
    public const NONE            = 0;
    public const CSS             = 1;
    public const XML             = 2;
    public const HTML            = 3;
    public const JSON            = 4;
    public const SHADER_VERTEX   = 5;
    public const SHADER_FRAGMENT = 6;
    public const WEB_MANIFEST    = 7;
    public const LICENSE         = 8;
    public const READ_ME         = 9;
    public const YAML            = 10;
    public const JS              = 11;
    public const PHP             = 12;
    public const HEADER          = 13;
    public const C               = 14;
    public const C_PLUS_PLUS     = 15;

    public const TO_CATEGORY     = [
        self::CSS             => CATEGORY::ASSET,
        self::HTML            => CATEGORY::ASSET,
        self::YAML            => CATEGORY::CONFIG,
        self::LICENSE         => CATEGORY::LICENSE,
        self::READ_ME         => CATEGORY::README,
        self::JS              => CATEGORY::CODE,
        self::PHP             => CATEGORY::CODE,
        self::C               => CATEGORY::CODE,
        self::HEADER          => CATEGORY::CODE,
        self::C_PLUS_PLUS     => CATEGORY::CODE,
        self::SHADER_FRAGMENT => CATEGORY::ASSET,
        self::SHADER_VERTEX   => CATEGORY::ASSET
    ];
}
