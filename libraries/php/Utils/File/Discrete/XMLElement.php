<?php declare(strict_types=1);

namespace QuasarSource\Utils\File\Discrete;

/**
 * Class XMLElement
 * @package QuasarSource\Utils\File
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
