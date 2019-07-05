<?php declare(strict_types=1);

namespace CodeManager\Service;

use function array_key_exists;
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
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\Schema\DBSchema;
use QuasarSource\Utilities\Process\Doctrine\ProcessDoctrine as DOCTRINE;
use QuasarSource\Utilities\SystemOS\UtilsSystem             as SYS;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Console\Application;

/**
 * @Service
 */
class DBService extends AbstractService implements OwnsReposInterface {
    use TraitFlagTable;

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

    private const FLAG_HEALTHY_DB_MAPPING = 'db_entity_mapping';
    private const FLAG_HEALTHY_DB_SCHEMA  = 'db_schema';
    private const FLAG_DB_SCHEMA_UPDATED  = 'db_schema_was_updated';

    /** @var array */
    private $commands = [];

    /** @var Application */
    private $application;

    /** @var CodeBuilderService */
    private $code_builder;

    /** @var EntityManagerInterface */
    private $entity_manager;

    /** @var array */
    private $entity_repos = [];

    /** @var DBSchema $queries_schema */
    private $queries_schema;

    /** @var EntityDBSnapshotRepository $repo_db_snapshot */
    private $repo_db_snapshot;

    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        $this->entity_manager   = $entity_manager;
        $this->queries_schema   = new DBSchema(SYS::get_env('DB_NAME'), $this->entity_manager->getConnection());
        $this->repo_db_snapshot = $this->get_repo(EntityDBSnapshotRepository::class);
    }

    /**
     * @return bool
     */
    public function is_schema_valid(): bool {
        $perform_checks = SYS::get_env('DB_CHECKS') === 'true';
        if ($perform_checks) {
            [$mapping, $schema] = DOCTRINE::execute_validate_checks();
            $this->flag_set(self::FLAG_HEALTHY_DB_MAPPING, $mapping);
            $this->flag_set(self::FLAG_HEALTHY_DB_SCHEMA, $schema);
        }
        if ($this->flag_is_on(self::FLAG_HEALTHY_DB_MAPPING)) {
            var_dump('DB Mapping is healthy');
        } else {
            var_dump('DB Mapping is NOT healthy');
        }
        if ($this->flag_is_on(self::FLAG_HEALTHY_DB_SCHEMA)) {
            var_dump('DB Schema is healthy');
        } else {
            var_dump('DB Schema is NOT healthy, (running update!)');

            DOCTRINE::execute_update();
            $this->code_builder->get_current_code_build()->setBooleanValue0(true);
        }
        return true;
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

    /**
     * @param callable $cmd
     */
    private function run_cmd_wrapped(callable $cmd): void {
        try {
            $cmd();
        } catch (Exception $e) {
            #$this->mark_as_failed();
            $this->warn('Exception', $e->getMessage());
        }
    }

}
