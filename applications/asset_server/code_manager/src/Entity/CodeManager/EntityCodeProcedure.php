<?php declare(strict_types=1);

namespace CodeManager\Entity\CodeManager;

use CodeManager\Entity\Abstractions\AbstractEntity;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt0;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use QuasarSource\Doctrine\Fields\EnumFields;

/**
 * Class EntityCodeProcedure
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\CodeManager\RepoCodeProcedure", readOnly=true)
 * @Table(name="code_procedure")
 *
 * @method EntityCodeProcedure setTaskClass(string $task_class)
 * @method EntityCodeProcedure setExecuteRank(int $rank)
 * @method string getTaskClass()
 * @method int getExecuteRank()
 */
class EntityCodeProcedure extends AbstractEntity {
    // {Class Name of Task}
    use TraitText0;
    // {Execute Order}
    use TraitSmallInt0;

    public static $db_table_name   = 'code_procedure';
    protected static $func_aliases = [
        'TaskClass'   => EnumFields::TEXT_0,
        'ExecuteRank' => EnumFields::SMALL_INT_0
    ];

    /**
     * Parent code project.
     *
     * @var EntityCodeProject
     * @ManyToOne(targetEntity="CodeManager\Entity\CodeManager\EntityCodeProject", inversedBy="procedures")
     * @JoinColumn(name="code_project_id", referencedColumnName="id")
     */
    protected $code_project;

    /**
     * @param  EntityCodeProject|null $code_project
     * @return EntityCodeProcedure
     */
    public function setCodeProject(?EntityCodeProject $code_project): self {
        $this->code_project = $code_project;
        return $this;
    }

    /**
     * @return EntityCodeProject|null
     */
    public function getCodeProject(): ?EntityCodeProject {
        return $this->code_project;
    }

}
