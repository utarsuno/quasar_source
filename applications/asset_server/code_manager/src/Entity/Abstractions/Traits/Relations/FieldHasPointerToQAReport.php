<?php

namespace CodeManager\Entity\Abstractions\Traits\Relations;
use CodeManager\Entity\CodeManager\EntityQAReport;
use Doctrine\ORM\Mapping\ManyToOne;


trait FieldHasPointerToQAReport {

    /**
     * @var EntityQAReport
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\EntityQAReport")
     */
    protected $qa_results;

    /**
     * @return EntityQAReport
     */
    public function getQaResults(): EntityQAReport {
        return $this->qa_results;
    }

    /**
     * @param EntityQAReport $qa_results
     * @return self
     */
    public function setQaResults(EntityQAReport $qa_results): self {
        $this->qa_results = $qa_results;
        return $this;
    }
}
