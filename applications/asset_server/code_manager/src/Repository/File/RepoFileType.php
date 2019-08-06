<?php declare(strict_types=1);

namespace CodeManager\Repository\File;

use CodeManager\Entity\File\EntityFile;
use CodeManager\Entity\File\EntityFileType;
use CodeManager\Repository\Abstractions\QueryableRepo;
use RuntimeException;
use QuasarSource\Utils\File\UtilsPath as PATH;

/**
 * Class RepoFileType
 * @package CodeManager\Repository\File
 */
class RepoFileType extends QueryableRepo {

    protected $entity_class   = EntityFileType::class;

    public const EXTENSION_TYPE_GZIPPED   = 'gzipped';
    public const EXTENSION_TYPE_MINIFIED  = 'minified';
    public const EXTENSION_TYPE_PROCESSED = 'processed';

    /** @var RepoFile $repo_files */
    private $repo_files;

    /** @var array $cached_extensions_to_entity_ids */
    private $cached_extensions_to_entity_ids = [];

    public function __destruct() {
        unset($this->repo_files, $this->cached_extensions_to_entity_ids);
        parent::__destruct();
    }

    /**
     * @param  string $extension
     * @return EntityFileType
     */
    public function find_file_type_by_name(string $extension): EntityFileType {
        /** @var EntityFileType $entity */
        $entity = $this->findOneBy(['as_string' => $extension]);
        return $entity;
    }

    /**
     * @param  EntityFile $file
     * @return EntityFileType
     */
    public function get_type_as_processed(EntityFile $file): EntityFileType {
        return $this->get_type_as($file, self::EXTENSION_TYPE_PROCESSED);
    }

    /**
     * @param  EntityFile $file
     * @param  string     $extension_type
     * @return EntityFileType
     */
    public function get_type_as(EntityFile $file, string $extension_type): EntityFileType {
        $file_type = $file->getFileType();
        if ($extension_type === self::EXTENSION_TYPE_GZIPPED && $file_type->get_is_gzipped() ||
            $extension_type === self::EXTENSION_TYPE_MINIFIED && $file_type->get_is_minified() ||
            $extension_type === self::EXTENSION_TYPE_PROCESSED && $file_type->get_is_processed()
        ) {
            throw new RuntimeException('EntityFile{' . $file->getPath() . '}\'s extension is already {' . $extension_type . '}!');
        }
        $sql    = $this->get_query_find_file_type($file_type, $extension_type);
        $result = $this->execute_custom_query($sql);
        /** @var EntityFileType $type */
        $type   = $this->findOneBy(['id' => (int) $result[0][0]]);
        return $type;
        #$query = new SQLQuery();
        #$query->SELECT('id')->FROM('public.file_type')
        #    ->WHERE_EQUAL_TO_BOOL('bool_1', $processed)
        #    ->AND_EQUAL_TO_BOOL('bool_2', $gzipped)
        #    ->AND_EQUAL_TO('entity_type', $entity_type)
        #    ->AND_EQUAL_TO_STR('as_string', $current_type->getAsString());
    }

    /**
     * @param  EntityFile $file
     * @return EntityFileType
     */
    public function get_entity_needed_file_type(EntityFile $file): EntityFileType {
        $extensions = PATH::get_extensions_as_string($file->getPath());
        /**
         * @var string         $extension_string
         * @var EntityFileType $entity
         */
        foreach ($this->cached_extensions_to_entity_ids as $extension_string => $entity) {
            if ($extensions === $extension_string) {
                return $entity;
            }
        }
        throw new RuntimeException('Unable to find needed file type for entity file {' . $file->getPath() . '}');
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  EntityFileType $file_type
     * @param  string         $extension_type
     * @return string
     */
    private function get_query_find_file_type(EntityFileType $file_type, string $extension_type): string {
        $minified  = $file_type->get_is_minified()  ? 'true ' : 'false ';
        $gzipped   = $file_type->get_is_gzipped()   ? 'true ' : 'false ';
        $processed = $file_type->get_is_processed() ? 'true ' : 'false ';
        $sql       = 'SELECT id FROM public.file_type WHERE bool_0 = ';
        $sql      .= $extension_type === self::EXTENSION_TYPE_MINIFIED  ? 'true ' : $minified;
        $sql      .= 'AND bool_1 = ';
        $sql      .= $extension_type === self::EXTENSION_TYPE_PROCESSED ? 'true ' : $processed;
        $sql      .= 'AND bool_2 = ';
        $sql      .= $extension_type === self::EXTENSION_TYPE_GZIPPED   ? 'true ' : $gzipped;
        $sql      .= 'AND entity_type = ' . $file_type->getEntityType() . ' ';
        $sql      .= "AND as_string != '" . $file_type->getAsString() . "'";
        return $sql;
    }

    # ----------------------------------- A B S T R A C T I O N -- C O N T R A C T S -----------------------------------
    public function set_needed_repos(): void {
        $this->repo_files = $this->db_service->get_repo(EntityFile::class);
        /** @var EntityFileType $file_type */
        foreach ($this->get_all() as $file_type) {
            $this->cached_extensions_to_entity_ids[$file_type->getAsString()] = $file_type;
        }
    }
}
