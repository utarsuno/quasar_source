<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Enum;


abstract class EntityFields {
    public const OPTIONAL   = 'optional';
    public const ID         = 'id';
    public const DURATION   = 'duration';
    public const TIME_START = 'unix_timestamp';
    public const TIME_END   = 'unix_timestamp_end';
}