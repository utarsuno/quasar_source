<?php declare(strict_types=1);

namespace CodeManager\Entity\Task;

use CodeManager\Entity\Abstractions\AbstractEntity;
use QuasarSource\Doctrine\Entity\Field\Text\TraitText0;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\Table;
use QuasarSource\Doctrine\Entity\Field\Number\Float\TraitFloat0;
use QuasarSource\Doctrine\Entity\Field\Number\Int\Small\TraitSmallInt1;
use QuasarSource\Doctrine\Entity\Field\Time\TraitUnixTime2;
use QuasarSource\Doctrine\Fields\EnumFields as FIELD;

/**
 * Class EntityDBSnapshot
 * @package CodeManager\Entity\CodeManager
 *
 * @Entity(repositoryClass="CodeManager\Repository\Task\RepoMeeseeksTask")
 * @Table(name="tasks_meeseek")
 *
 * @method EntityMeeseeksTask set_created_at(int $timestamp)
 * @method EntityMeeseeksTask set_completed_at(int $timestamp)
 * @method EntityMeeseeksTask set_due_at(int $timestamp)
 * @method EntityMeeseeksTask set_iteration(int $i)
 * @method EntityMeeseeksTask set_iterations_needed(int $i)
 * @method EntityMeeseeksTask set_time_needed(float $seconds)
 * @method int|null get_created_at()
 * @method int|null get_completed_at()
 * @method int|null get_due_at()
 * @method int|null get_iteration()
 * @method int|null get_iterations_needed()
 * @method float|null get_time_needed()
 */
class EntityMeeseeksTask extends AbstractEntity {
    // {description}
    use TraitText0;
    // {created at, due at, completed at}
    use TraitUnixTime2;
    // {iteration, iterations_needed}
    use TraitSmallInt1;
    // {time needed (in seconds), time taken (in seconds)}
    use TraitFloat0; # TODO:

    public static $sort_field_time = FIELD::UNIX_TIME_0_AS_SQL;
    public static $db_table_name   = 'tasks_meeseek';
    protected static $func_aliases = [
        'created_at'        => FIELD::UNIX_TIME_0,
        'due_at'            => FIELD::UNIX_TIME_1,
        'completed_at'      => FIELD::UNIX_TIME_2,
        'iteration'         => FIELD::SMALL_INT_0,
        'iterations_needed' => FIELD::SMALL_INT_1,
        'time_needed'       => FIELD::FLOAT_0
    ];

    /**
     * @param  string $description
     * @return EntityMeeseeksTask
     */
    public static function spawn(string $description): EntityMeeseeksTask {
        return (new self())->set_created_at(-1)->setText0($description);
    }

    /**
     * @param  int $num_seconds
     * @return EntityMeeseeksTask
     */
    public function set_to_due_in_delta_time(int $num_seconds): self {
        return $this->set_due_at($this->get_created_at() + $num_seconds);
    }

    /**
     * @return array
     */
    public function as_array(): array {
        return [
            'id'                => $this->getID(),
            'created_at'        => $this->get_created_at(),
            'completed_at'      => $this->get_completed_at(),
            'due_at'            => $this->get_due_at(),
            'iteration'         => $this->get_iteration(),
            'iterations_needed' => $this->get_iterations_needed(),
            'time_needed'       => $this->get_time_needed(),
            'description'       => $this->getText0()
        ];
    }
}
