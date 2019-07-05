<?php declare(strict_types=1);
/**
 * Created by PhpStorm.
 * User: utarsuno
 * Date: 2019-04-20
 * Time: 23:13
 */

namespace CodeManager\Entity\File;

use CodeManager\Entity\Abstractions\Traits\Boolean\FieldBooleanThree;
use CodeManager\Entity\Abstractions\Traits\MetaData\FieldID;
use CodeManager\Entity\Abstractions\Traits\Text\FieldText;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;

/**
 * Class EntityFileType
 * @package CodeManager\Entity\File
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\EntityFileTypeRepository")
 * @Table(name="file_type")
 */
class EntityFileType {
    use FieldID;
    // Represents the entire extension (ex: '.min.html.gz')
    use FieldText;
    // gzipped, minified, pre_processed.
    use FieldBooleanThree;
}
