<?php declare(strict_types=1);

namespace QuasarSource\Utilities\File\Discrete;

/**
 * Class XMLElement
 * @package QuasarSource\Utilities\File
 */
class XMLElement {
    /** @var string */
    public $name;
    /** @var array */
    public $attributes;
    /** @var array */
    public $content;
    /** @var XMLElement */
    public $children;
}
