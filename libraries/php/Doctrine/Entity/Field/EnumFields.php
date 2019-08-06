<?php declare(strict_types=1);

namespace QuasarSource\Doctrine\Fields;

/**
 * Interface EnumFields
 * @package QuasarSource\Doctrine\Fields
 */
interface EnumFields {

    public const MAGIC_GET          = 'get_';
    public const MAGIC_GET_ALT      = 'get';
    public const MAGIC_SET          = 'set_';
    public const MAGIC_SET_ALT      = 'set';
    public const MAGIC_METHODS      = [self::MAGIC_GET, self::MAGIC_GET_ALT, self::MAGIC_SET, self::MAGIC_SET_ALT];

    public const BIG_TEXT_0         = 'Blob0';
    public const BIG_TEXT_1         = 'Blob1';
    public const BIG_TEXT_2         = 'Blob2';
    public const TEXT_0             = 'Text0';
    public const TEXT_1             = 'Text1';
    public const TEXT_2             = 'Text2';
    public const TEXT_3             = 'Text3';
    public const TEXT_4             = 'Text4';
    public const SMALL_INT_0        = 'SmallInt0';
    public const SMALL_INT_1        = 'SmallInt1';
    public const SIZE_IN_BYTES      = 'SizeInBytes';
    public const FLOAT_0            = 'Float0';
    public const UNIX_TIME_0        = 'UnixTime0';
    public const UNIX_TIME_1        = 'UnixTime1';
    public const UNIX_TIME_2        = 'UnixTime2';
    public const BOOLEAN_0          = 'Bool0';
    public const BOOLEAN_1          = 'Bool1';
    public const BOOLEAN_2          = 'Bool2';
    public const BOOLEAN_0_NOT_NULL = 'Bool_0';
    public const BOOLEAN_1_NOT_NULL = 'Bool_1';
    public const BOOLEAN_2_NOT_NULL = 'Bool_2';

    public const HEX_COLOR_0        = 'HexColor0';
    public const HEX_COLOR_1        = 'HexColor1';

    public const UNIX_TIME_0_AS_SQL = 'unix_time0';
    public const PATH_AS_SQL        = 'path';
}
