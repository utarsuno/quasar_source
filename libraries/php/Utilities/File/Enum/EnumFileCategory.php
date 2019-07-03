<?php declare(strict_types=1);

namespace QuasarSource\Enums;


abstract class EnumFileCategory {
    public const NONE    = 0;
    public const CODE    = 1;
    public const CONFIG  = 2;
    public const LIBRARY = 3;
    public const ASSET   = 4;
    public const LICENSE = 5;
    public const README  = 6;
}