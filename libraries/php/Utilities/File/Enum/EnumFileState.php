<?php declare(strict_types=1);

namespace QuasarSource\Enums;


abstract class EnumFileState {
    public const NONE      = 0;
    public const MINIFIED  = 1;
    public const GZIPPED   = 2;
    public const PROCESSED = 3;
}