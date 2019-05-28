<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\File\EntityFile;
use Doctrine\ORM\Mapping\ManyToOne;
use QuasarSource\Utilities\Exceptions\ExceptionUtilities as DBG;


trait FieldHasPointerToEntityFile {

    /**
     * @var EntityFile
     * @ManyToOne(targetEntity="CodeManager\Entity\File\EntityFile")
     */
    protected $entity_file;

    /**
     * @param bool $raise_exception_if_null < If true, an exception will be thrown if there is no EntityFile set. >
     * @return EntityFile
     */
    public function getEntityFile(bool $raise_exception_if_null=false): EntityFile {
        if ($raise_exception_if_null && $this->entity_file === null) {
            DBG::throw_exception('EntityQAReport does not have {entity_file} set.');
        }
        return $this->entity_file;
    }

    /**
     * @param EntityFile $entity_file
     * @return self
     */
    public function setEntityFile(EntityFile $entity_file): self {
        $this->entity_file = $entity_file;
        return $this;
    }
}
