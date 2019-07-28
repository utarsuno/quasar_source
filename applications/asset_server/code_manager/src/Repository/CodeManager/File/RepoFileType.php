<?php declare(strict_types=1);

namespace CodeManager\Repository\CodeManager\File;

use CodeManager\Entity\CodeManager\File\EntityFile;
use CodeManager\Entity\CodeManager\File\EntityFileType;
use CodeManager\Repository\Abstractions\QueryableRepo;
use QuasarSource\SQL\Representation\SQLQuery;
use RuntimeException;
use QuasarSource\Utils\File\UtilsPath as PATH;

/**
 * Class RepoFileType
 * @package CodeManager\Repository\CodeManager\File
 */
class RepoFileType extends QueryableRepo {

    public const ENTITY_CLASS = EntityFileType::class;
    protected $entity_class   = EntityFileType::class;

    /** @var RepoFile $repo_files */
    private $repo_files;

    /** @var array $cached_extensions_to_entity_ids */
    private $cached_extensions_to_entity_ids = [];

    private const EXTENSION_TYPE_GZIPPED   = 'gzipped';
    private const EXTENSION_TYPE_MINIFIED  = 'minified';
    private const EXTENSION_TYPE_PROCESSED = 'processed';

    /**
     * @param  EntityFile $file
     * @return EntityFileType
     */
    public function get_type_as_gzipped(EntityFile $file): EntityFileType {
        $current_type = $this->get_file_type_and_ensure_validity($file, self::EXTENSION_TYPE_GZIPPED);

        $minified    = $current_type->get_is_minified() ? 'true' : 'false';
        $processed   = $current_type->get_is_processed() ? 'true' : 'false';
        $entity_type = $current_type->getEntityType();

        $sql    = 'SELECT id FROM public.file_type WHERE bool_1 = ' . $processed;
        $sql   .= ' AND bool_0 = ' . $minified . ' AND entity_type = ' . $entity_type;
        $sql   .= ' AND bool_2 = true';
        $sql   .= " AND as_string != '" . $current_type->getAsString() . "'";

        $result = $this->execute_custom_query(
            $sql
        );
        $id_to_get = (int) $result[0][0];
        /** @var EntityFileType $type */
        $type      = $this->findOneBy(['id' => $id_to_get]);
        var_dump('FOR GETTING GZIP TYPE, I GOT THE FOLLOWING {' . $type->getAsString() . '}');
        return $type;
    }

    /**
     * @param  EntityFile $file
     * @return EntityFileType
     */
    public function get_type_as_minified(EntityFile $file): EntityFileType {
        $current_type = $this->get_file_type_and_ensure_validity($file, self::EXTENSION_TYPE_MINIFIED);

        $gzipped      = $current_type->get_is_gzipped() ? 'true' : 'false';
        $processed    = $current_type->get_is_processed() ? 'true' : 'false';
        $entity_type  = $current_type->getEntityType();

        $sql    = 'SELECT id FROM public.file_type WHERE bool_1 = ' . $processed;
        $sql   .= ' AND bool_2 = ' . $gzipped . ' AND entity_type = ' . $entity_type;
        $sql   .= ' AND bool_0 = true';
        $sql   .= " AND as_string != '" . $current_type->getAsString() . "'";

        $query = new SQLQuery();
        $query->SELECT('id')->FROM('public.file_type')
            ->WHERE_EQUAL_TO_BOOL('bool_1', $processed)
            ->AND_EQUAL_TO_BOOL('bool_2', $gzipped)
            ->AND_EQUAL_TO('entity_type', $entity_type)
            ->AND_EQUAL_TO_STR('as_string', $current_type->getAsString());

        #var_dump($sql);
        $result = $this->execute_custom_query(
            $sql
        );
        $id_to_get = (int) $result[0][0];
        /** @var EntityFileType $type */
        $type      = $this->findOneBy(['id' => $id_to_get]);
        return $type;
    }

    /**
     * @param  EntityFile $file
     * @return EntityFileType
     */
    public function get_entity_needed_file_type(EntityFile $file): EntityFileType {
        $extensions = PATH::get_extensions_as_string($file->getFullPath());
        /**
         * @var string         $extension_string
         * @var EntityFileType $entity
         */
        foreach ($this->cached_extensions_to_entity_ids as $extension_string => $entity) {
            if ($extensions === $extension_string) {
                return $entity;
            }
        }
        throw new RuntimeException('Unable to find needed file type for entity file {' . $file->getFullPath() . '}');
    }

    public function set_needed_repos(): void {
        $this->repo_files = $this->db_service->get_repo(RepoFile::class);
        /** @var EntityFileType $file_type */
        foreach ($this->get_all() as $file_type) {
            $this->cached_extensions_to_entity_ids[$file_type->getAsString()] = $file_type;
        }
    }

    # ------------------------------------------------- P R I V A T E --------------------------------------------------

    /**
     * @param  EntityFile $file
     * @param  string     $extension_type
     * @return EntityFileType
     */
    private function get_file_type_and_ensure_validity(EntityFile $file, string $extension_type): EntityFileType {
        $type = $file->getFileType();
        if ($extension_type === self::EXTENSION_TYPE_GZIPPED && $type->get_is_gzipped() ||
            $extension_type === self::EXTENSION_TYPE_MINIFIED && $type->get_is_minified() ||
            $extension_type === self::EXTENSION_TYPE_PROCESSED && $type->get_is_processed()
        ) {
            throw new RuntimeException(
                'The entity file{' . $file->getFullPath() . '}\'s extension is already {' . $extension_type . '}!'
            );
        }
        return $type;
    }
}
