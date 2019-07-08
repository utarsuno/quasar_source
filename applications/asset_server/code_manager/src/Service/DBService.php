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
use QuasarSource\DataStructure\BuildStep\BuildStep;
use QuasarSource\DataStructure\FlagTable\TraitFlagTable;
use QuasarSource\SQL\DBSchema;
use QuasarSource\SQL\DBTable;
use QuasarSource\Utilities\Process\Doctrine\ProcessDoctrine as DOCTRINE;
use QuasarSource\Utilities\SystemOS\UtilsSystem             as SYS;
use RuntimeException;

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

    public static $singleton;

    private $new_db_snapshot_entity_created = false;

    /**
     * @param  int $id
     * @param  string $entity_class
     * @return object|null
     */
    public static function get_entity(int $id, string $entity_class) {
        $repo = self::$singleton->get_repo($entity_class);
        return $repo->findOneBy(['id' => $id]);
    }

    /** @var array */
    private $commands = [];

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

    /** @var EntityDBSnapshot $db_snapshot */
    private $db_snapshot;

    /**
     * @param LoggerService          $logger
     * @param EntityManagerInterface $entity_manager
     */
    public function __construct(LoggerService $logger, EntityManagerInterface $entity_manager) {
        parent::__construct($logger);
        self::$singleton        = $this;
        $this->entity_manager   = $entity_manager;
        $this->queries_schema   = new DBSchema(SYS::get_env('DB_NAME'), $this->entity_manager->getConnection());
        $this->repo_db_snapshot = $this->get_repo(EntityDBSnapshotRepository::class);
    }

    /**
     * @param  string $db_table_name
     * @return DBTable
     */
    public function get_db_table_by_name(string $db_table_name): DBTable {
        $all_tables = $this->queries_schema->get_all_db_tables();
        return $all_tables[$db_table_name];
    }

    /**
     * @return EntityDBSnapshot
     */
    public function get_db_snapshot(): EntityDBSnapshot {
        return $this->db_snapshot;
    }

    /**
     * @return BuildStep
     */
    public function provide_build_step(): BuildStep {
        $step = new BuildStep('DB Health Check');
        $step->add_sub_step([$this, 'build_step0'], 'MetaData analysis');
        $step->add_sub_step([$this, 'build_step1'], 'DB Health Check');
        $step->add_sub_step([$this, 'build_step2'], 'DB Snapshot Entity');
        return $step;
    }

    public function build_step0(): void {
        [$this->db_snapshot, $this->new_db_snapshot_entity_created] = $this->repo_db_snapshot->get_db_snapshot($this->queries_schema, $this);
    }

    public function build_step1(): void {
        if ($this->new_db_snapshot_entity_created && SYS::get_env('DB_CHECKS') === 'true') {
            [$mapping, $schema] = DOCTRINE::execute_validate_checks();
            $this->flag_set(self::FLAG_HEALTHY_DB_MAPPING, $mapping);
            $this->flag_set(self::FLAG_HEALTHY_DB_SCHEMA, $schema);
        } else {
            $this->flags_set_all(
                [self::FLAG_HEALTHY_DB_MAPPING, self::FLAG_HEALTHY_DB_SCHEMA],
                true
            );
        }
        if ($this->flag_is_off(self::FLAG_HEALTHY_DB_MAPPING)) {
            throw new RuntimeException('DB Mapping is NOT healthy');
        }
    }

    public function build_step2(): void {
        if ($this->new_db_snapshot_entity_created) {
            $this->db_snapshot->set_did_db_schema_update(false);
            if ($this->flag_is_off(self::FLAG_HEALTHY_DB_SCHEMA)) {
                DOCTRINE::execute_update();
                // Set to true only after actual schema update to ensure no exception was thrown for it.
                $this->db_snapshot->set_did_db_schema_update(true);
            }
            $this->repo_db_snapshot->save_entity($this->db_snapshot, true);
        }
    }

    /**
     * @return bool
     */
    public function is_schema_valid(): bool {
        return $this->flag_is_on(self::FLAG_HEALTHY_DB_MAPPING) && $this->flag_is_on(self::FLAG_HEALTHY_DB_SCHEMA);
    }

    // ----------------------------------------- I N T E R F A C E {OwnsRepo} ------------------------------------------

    /**
     * @param  string $repo_key
     * @return ObjectRepository
     */
    public function get_repo(string $repo_key): ObjectRepository {
        if (!array_key_exists($repo_key, $this->entity_repos)) {
            $this->entity_repos[$repo_key] = $this->entity_manager->getRepository(self::REPO_TO_ENTITY[$repo_key]);
        }
        return $this->entity_repos[$repo_key];
    }

}
