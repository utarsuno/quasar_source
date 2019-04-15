<?php
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-03-30
 * Time: 01:44
 */

namespace QuasarSource\Domain\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="files")
 */
class EntityFile {

    // TODO: MAPPINGS TO CHILD AND PARENT FILES?!
    // TODO: MAPPING TO PARENT DIRECTORY?

    /**
     * @ORM\GeneratedValue()
     * @ORM\Column(type="bigint")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $path;

    /**
     * @ORM\Column(type="smallint")
     */
    private $type;

    /**
     * @ORM\Column(type="blob")
     */
    private $contents;

    /**
     * @ORM\Column(type="bigint")
     */
    private $sha512sum;

    /**
     * @ORM\Column(type="bigint")
     */
    private $size;

    /**
     * @ORM\Column(type="datetime")
     */
    private $loaded_into_db;

    /**
     * @ORM\Column(type="datetime")
     */
    private $cached;

    /**
     * @ORM\Column(type="boolean")
     */
    private $cleanable;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_clean;


}



