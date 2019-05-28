<?php

namespace CodeManager\Entity\Abstractions\Traits\Text;

use Doctrine\ORM\Mapping\Column;


trait FieldJSONMetaData {

    /**
     * @var string
     * @Column(name="json_meta_data", type="string", nullable=true, unique=false)
     */
    protected $json_meta_data;

    /**
     * @return string
     */
    public function getJSONMetaData(): string {
        return $this->json_meta_data;
    }

    /**
     * @param string $json_meta_data
     * @return self
     */
    public function setJSONMetaData(string $json_meta_data): self {
        $this->json_meta_data = $json_meta_data;
        return $this;
    }

}



