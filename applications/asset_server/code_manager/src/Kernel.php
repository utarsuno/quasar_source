<?php declare(strict_types=1);

namespace CodeManager;

use function dirname;
use Exception;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\Config\Exception\LoaderLoadException;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Routing\RouteCollectionBuilder;
use Symfony\Component\HttpKernel\Kernel          as BaseKernel;
use CodeManager\Enum\ProjectParameterKeys\Path   as PATHS;
use CodeManager\Enum\ProjectParameterKeys\Schema as SCHEMAS;

/**
 * Class Kernel
 * @package CodeManager
 */
class Kernel extends BaseKernel {
    use MicroKernelTrait;

    private const CONFIG_EXTS = '.{php,xml,yaml,yml}';
    private $project_directory;

    /**
     * @return iterable
     */
    public function registerBundles(): iterable {
        yield new \Symfony\Bundle\FrameworkBundle\FrameworkBundle();
        yield new \Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle();
        yield new \Doctrine\Bundle\DoctrineBundle\DoctrineBundle();
        yield new \Symfony\Bundle\MonologBundle\MonologBundle();
    }

    /**
     * @return string
     */
    public function getProjectDir(): string {
        if ($this->project_directory === null) {
            $this->project_directory = dirname(__DIR__);
        }
        return $this->project_directory;
    }

    /**
     * @param  ContainerBuilder $container
     * @param  LoaderInterface  $loader
     * @throws Exception
     */
    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void {
        #var_dump('CONFIGURE CONTAINER!');
        $container->setParameter(PATHS::DIRECTORY_PROJECT, getenv(PATHS::DIRECTORY_PROJECT));
        $container->setParameter(PATHS::DIRECTORY_CODE_MANAGER, getenv(PATHS::DIRECTORY_CODE_MANAGER));
        $container->setParameter(PATHS::PROJECT_CONFIG, getenv(PATHS::PROJECT_CONFIG));
        $container->setParameter(PATHS::PROJECT_BUNDLES, getenv(PATHS::PROJECT_BUNDLES));
        $container->setParameter(PATHS::NODE_MINIFY_CSS, getenv(PATHS::NODE_MINIFY_CSS));
        $container->setParameter(PATHS::NODE_MINIFY_HTML, getenv(PATHS::NODE_MINIFY_HTML));
        $container->setParameter(PATHS::NODE_MINIFY_JS, getenv(PATHS::NODE_MINIFY_JS));

        $container->setParameter(SCHEMAS::YAML_CODE_MANAGER, [
            'global_information' => null,
            'assets'             => [
                '.css'  => null,
                '.html' => null,
                '.json' => null,
                '.vert' => null,
                '.frag' => null
            ],
            'npm'                => null,
            'qa_report'          => null,
            'docker'             => null,
            'projects'           => null
        ]);
        $container->setParameter(SCHEMAS::YAML_ASSETS, [
            [PATHS::DIRECTORY_OUTPUT => null, PATHS::DIRECTORY_DATA => null, 'files' => null]
        ]);

        $container->addResource(new FileResource($container->getParameter(PATHS::PROJECT_BUNDLES)));
        $container->setParameter('container.dumper.inline_class_loader', true);
        $confDir = $this->getProjectDir() . '/config';
        $loader->load($confDir.'/{packages}/*.yaml', 'glob');
        $loader->load($confDir.'/{packages}/'.$this->environment.'/**/*.yaml', 'glob');
        $loader->load($confDir.'/{services}'.self::CONFIG_EXTS, 'glob');
        $loader->load($confDir.'/{services}_'.$this->environment.self::CONFIG_EXTS, 'glob');
    }

    /**
     * @param  RouteCollectionBuilder $routes
     * @throws LoaderLoadException
     */
    protected function configureRoutes(RouteCollectionBuilder $routes): void {
        $conf_dir = dirname(__DIR__).'/config/{routes}';
        $routes->import($conf_dir.'/'.$this->environment.'/**/*.yaml', '/', 'glob');
        $routes->import($conf_dir.'/*'.self::CONFIG_EXTS, '/', 'glob');
        $routes->import($conf_dir.self::CONFIG_EXTS, '/', 'glob');
    }
}
