<?php declare(strict_types=1);

namespace CodeManager\Entity\Abstractions\Traits\Enum;


abstract class EntityTableNames {
    public const CODE_BUILDS           = 'code_builds';
    public const DIRECTORIES           = 'entity_directory';
    public const DB_SNAPSHOT           = 'db_snapshot';
    public const NPM_LIB               = 'npm_library';
    public const QA_REPORT             = 'qa_report';
    public const ENTITY_FILES          = 'entity_file';
    public const BANK_TRANSACTION      = 'bank_transactions';
    public const BANK_TRANSACTION_TYPE = 'bank_transaction_types';
}