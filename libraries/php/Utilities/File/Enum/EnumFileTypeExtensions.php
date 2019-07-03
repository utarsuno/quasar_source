<?php declare(strict_types=1);

namespace QuasarSource\Enums;
use QuasarSource\Enums\EnumFileType as TYPE;


abstract class EnumFileTypeExtensions {

    public const JS              = '.js';
    public const C               = '.c';
    public const CPP             = '.cpp';
    public const HEADER          = '.h';
    public const WEB_MANIFEST    = '.webmanifest';
    public const YAML            = '.yml';
    public const SHADER_VERTEX   = '.vert';
    public const SHADER_FRAGMENT = '.frag';
    public const JSON            = '.json';
    public const CSS             = '.css';
    public const XML             = '.xml';
    public const HTML            = '.html';
    public const MINIFIED        = '.min';
    public const GZIPPED         = '.gz';

    public const TO_TYPES        = [
        self::JS              => TYPE::JS,
        self::C               => TYPE::C,
        self::CPP             => TYPE::C_PLUS_PLUS,
        self::HEADER          => TYPE::HEADER,
        self::WEB_MANIFEST    => TYPE::WEB_MANIFEST,
        self::YAML            => TYPE::YAML,
        self::SHADER_FRAGMENT => TYPE::SHADER_FRAGMENT,
        self::SHADER_VERTEX   => TYPE::SHADER_VERTEX,
        self::JSON            => TYPE::JSON,
        self::CSS             => TYPE::CSS,
        self::XML             => TYPE::XML,
        self::HTML            => TYPE::HTML
    ];
}
