<?php declare(strict_types=1);

namespace CodeManager\Enum\ProjectParameterKeys;

/**
 * Utility ENUM.
 */
final class Path {
    public const DIRECTORY_PROJECT      = 'PATH_DIRECTORY_PROJECT_BASE';
    public const DIRECTORY_CODE_MANAGER = 'PATH_DIRECTORY_CODE_MANAGER';
    public const PROJECT_CONFIG         = 'PATH_PROJECT_CONFIGS';
    public const PROJECT_BUNDLES        = 'PATH_PROJECT_BUNDLES';
    public const NODE_MINIFY_HTML       = 'PATH_NODE_MINIFY_HTML';
    public const NODE_MINIFY_CSS        = 'PATH_NODE_MINIFY_CSS';
    public const NODE_MINIFY_JS         = 'PATH_NODE_MINIFY_JS';
    public const QA_REPORT              = 'PATH_QA_REPORT';

    public const DIRECTORY_DATA         = 'PATH_DIRECTORY_DATA';
    public const DIRECTORY_OUTPUT       = 'PATH_DIRECTORY_OUTPUT';
    public const DIRECTORY_NODE         = 'PATH_DIRECTORY_NODE';

    public const RELATIVE_NODE_MINIFY_HTML = 'PATH_RELATIVE_NODE_MINIFY_HTML';
    public const RELATIVE_NODE_MINIFY_CSS = 'PATH_RELATIVE_NODE_MINIFY_CSS';
    public const RELATIVE_NODE_MINIFY_JS = 'PATH_RELATIVE_NODE_MINIFY_JS';


    public const PATH_API               = 'var/.ignore/.config.yml';
}
