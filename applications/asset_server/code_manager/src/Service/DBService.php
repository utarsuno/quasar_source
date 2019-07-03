<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
use CodeManager\Command\Prepared\PreparedCommand;
use CodeManager\Command\Prepared\DBSchemaUpdate;
use CodeManager\Command\Prepared\DBSchemaValidate;
use CodeManager\Entity\CodeManager\EntityCodeBuild;
use CodeManager\Entity\CodeManager\EntityDBSnapshot;
use CodeManager\Entity\CodeManager\EntityNPMLib;
use CodeManager\Entity\CodeManager\EntityQAReport;
use CodeManager\Entity\File\EntityDirectory;
use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\Users\EntityUser;
use CodeManager\Entity\Users\EntityUserRole;
use CodeManager\Repository\CodeManager\EntityCodeBuildRepository;
use CodeManager\Repository\CodeManager\EntityDBSnapshotRepository;
use CodeManager\Repository\CodeManager\EntityDirectoryRepository;
use CodeManager\Repository\CodeManager\EntityFileRepository;
use CodeManager\Repository\CodeManager\EntityNPMLibRepository;
use CodeManager\Repository\CodeManager\EntityQAReportRepository;
use CodeManager\Repository\Users\EntityUserRepository;
use CodeManager\Repository\Users\EntityUserRoleRepository;
use CodeManager\Service\Feature\AbstractService;
use CodeManager\Service\Feature\Repository\OwnsReposInterface;
use Doctrine\Common\Persistence\ObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use QuasarSource\BuildProcess\Abstractions\UnitOfWork;
#use Symfony\Component\Console\Command\Command;
use QuasarSource\SQL\Representation\SQLQueryGroup;
use QuasarSource\SQL\Schema\DBSchema;
use QuasarSource\SQL\Table\DBTable;
use QuasarSource\Utilities\UtilsString as STR;
use QuasarSource\Utilities\UtilsSystem as SYS;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Console\Application;

/**
 * @Service
 */
class DBService extends AbstractService implements OwnsReposInterface{ #extends UnitOfWork

    private const REPO_TO_ENTITY = [
        EntityFileRepository::class       => EntityFile::class,
        EntityDirectoryRepository::class  => EntityDirectory::class,
        EntityQAReportRepository::class   => EntityQAReport::class,
        EntityNPMLibRepository::class     => EntityNPMLib::class,
        EntityUserRepository::class       => EntityUser::class,
        EntityUserRoleRepository::class   => EntityUserRole::class,
        EntityCodeBuildRepository::class  => EntityCodeBuild::class,
        EntityDBSnapshotRepository::class => EntityDBSnapshot::class
    ];

    /** @var array */
    private $commands = [];

    /** @var DBSchemaUpdate */
    private $cmd_db_schema_update;

    /** @var DBSchemaValidate */
    private $cmd_db_schema_validate;

    /** @var Application */
    private $application;

    /** @var CodeBuilderService */
    private $code_builder;

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var array */
    private $entity_repos = [];

    /** @var SQLQueryGroup $queries_schema */
    private $queries_schema;

    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->entity_manager = $entity_manager;
        $this->queries_schema = new DBSchema(SYS::get_env('DB_NAME'), $this->entity_manager->getConnection());

        var_dump('Created DB Service!');

        #var_dump(EntityUser::class);
        #exit(4);

        #var_dump($this->queries_schema->execute('get_num_tables'));

        /*
        $table_names = $this->queries_schema->execute(DBSchema::QUERY_GET_TABLE_NAMES);
        foreach ($table_names as $table_name) {
            $name = STR::replace($table_name, '_', '\\');
            var_dump($name);
        }
        exit();*/
        #var_dump($table_names);

        #$db_tables = $this->queries_schema->get_all_db_tables();

        /** @var DBTable $d $d */
        #foreach ($db_tables as $d) {
            #var_dump(get_class($d));
        #    var_dump($d->get_name());
        #    var_dump($d->execute(SQLQueryGroup::QUERY_GET_SIZE_PRETTY));
        #    var_dump($d->execute(DBTable::QUERY_GET_NUM_ROWS_EXPENSIVE));
        #    var_dump(PHP_EOL);
            #var_dump($d->execute(SQLQueryGroup::QUERY_GET_SIZE_PRETTY));
        #}

        #foreach ($table_names as $name) {
            #$res = $this->queries_schema->execute(DBSchema::);
        #}

        #$tn2 = $this->queries_schema->execute('get_table_names');

        #var_dump($table_names);
        #var_dump($tn2);


        #exit();


        #$this->query_manager  = new QueryManager($this->entity_manager->getConnection());
        #parent::__construct('DB Health Check', $logger);
    }

    /**
     * @param  string $command_name
     * @param  string $command_class
     * @return PreparedCommand
     */
    private function get_command(string $command_name, string $command_class): PreparedCommand {
        if (!array_key_exists($command_name, $this->commands)) {
            $this->commands[$command_name] = new $command_class($this->application->find($command_name));
        }
        return $this->commands[$command_name];
    }

    // ----------------------------------------- I N T E R F A C E {OwnsRepo} ------------------------------------------

    /**
     * @param  string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        if (!array_key_exists($repo_key, $this->entity_repos)) {
            $this->set_repo($repo_key, self::REPO_TO_ENTITY[$repo_key]);
        }
        return $this->entity_repos[$repo_key];
    }

    /**
     * @param string $repo_key
     * @param string $entity_class
     */
    private function set_repo(string $repo_key, string $entity_class): void {
        $this->entity_repos[$repo_key] = $this->entity_manager->getRepository($entity_class);
    }

    // ---------------------------------------------- B U I L D  S T E P -----------------------------------------------

    /**
     * @param Application        $application
     * @param CodeBuilderService $code_builder
     */
    public function prepare_for_build_step(Application $application, CodeBuilderService $code_builder): void {
        $this->application  = $application;
        $this->code_builder = $code_builder;
    }

    protected function pre_work(): void {
        $this->cmd_db_schema_update   = $this->get_command(
            'doctrine:schema:update',
            DBSchemaUpdate::class
        );
        $this->cmd_db_schema_validate = $this->get_command(
            'doctrine:schema:validate',
            DBSchemaValidate::class
        );
    }

    protected function perform_work(): void {
        $code_build = $this->code_builder->get_current_code_build();

        if ($code_build->is_mode_rushed()) {
            $this->log('Build mode is rushed, skipping DB checks.');
        } else {
            $this->run_cmd_wrapped([$this, 'run_schema_validate']);
            if (!$this->cmd_db_schema_validate->is_healthy_mapping()) {
                $this->log('Entity mapping is not healthy!');
                $this->mark_as_failed();
            }
            if (!$this->cmd_db_schema_validate->is_healthy_schema()) {
                $this->log('Updating the DB Schema!');
                $this->run_cmd_wrapped([$this, 'run_schema_update']);

                if ($this->cmd_db_schema_update->did_db_schema_update()) {
                    // setOptional --> setDbSchemaUpdated

                    #$this->code_builder->get_current_code_build()->setOptional(true);
                    $this->code_builder->get_current_code_build()->setBooleanValue0(true);
                }
            }
        }

        // TODO: Check for any enum tables that need to be populated!
        // TODO: ^ The above check depends on the code build mode set!
    }

    private function run_schema_validate(): void {
        $this->cmd_db_schema_validate->run_command();
    }

    private function run_schema_update(): void {
        $this->cmd_db_schema_update->run_command();
    }

    /**
     * @param callable $cmd
     */
    private function run_cmd_wrapped(callable $cmd): void {
        try {
            $cmd();
        } catch (Exception $e) {
            $this->mark_as_failed();
            $this->warn('Exception', $e->getMessage());
        }
    }

    protected function post_work(): void {
        $this->log('DBHealthService post_work');
    }


}
