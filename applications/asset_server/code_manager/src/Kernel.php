<?php declare(strict_types=1);

namespace CodeManager;

use Doctrine\Bundle\DoctrineBundle\DoctrineBundle;
use Doctrine\Bundle\DoctrineCacheBundle\DoctrineCacheBundle;
use Exception;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Bundle\MonologBundle\MonologBundle;
use Symfony\Component\Config\Exception\LoaderLoadException;
use Symfony\Component\Config\Loader\LoaderInterface;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Routing\RouteCollectionBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

/**
 * Class Kernel
 * @package CodeManager
 */
class Kernel extends BaseKernel {
    use MicroKernelTrait;

    /**
     * @return iterable
     */
    public function registerBundles(): iterable {
        yield new FrameworkBundle();
        yield new MonologBundle();
        yield new DoctrineCacheBundle();
        yield new DoctrineBundle();
    }

    /**
     * @return string
     */
    public function getProjectDir(): string {
        return '/quasar_source/applications/asset_server/code_manager';
    }

    /**
     * @param  ContainerBuilder $container
     * @param  LoaderInterface  $loader
     * @throws Exception
     */
    protected function configureContainer(ContainerBuilder $container, LoaderInterface $loader): void {
        $container->addResource(new FileResource('/quasar_source/applications/asset_server/code_manager/config/bundles.php'));
        $container->setParameter('container.dumper.inline_class_loader', true);
        $confDir = '/quasar_source/applications/asset_server/code_manager/config';
        $loader->load($confDir.'/{packages}/*.yaml', 'glob');
        $loader->load($confDir.'/{packages}/'.$this->environment.'/**/*.yaml', 'glob');
        $loader->load($confDir.'/{services}.{php,xml,yaml,yml}', 'glob');
        $loader->load($confDir.'/{services}_'.$this->environment.'.{php,xml,yaml,yml}', 'glob');
    }

    /**
     * @param  RouteCollectionBuilder $routes
     * @throws LoaderLoadException
     */
    protected function configureRoutes(RouteCollectionBuilder $routes): void {
        $conf_dir = '/quasar_source/applications/asset_server/code_manager/config/{routes}';
        $routes->import($conf_dir.'/'.$this->environment.'/**/*.yaml', '/', 'glob');
        $routes->import($conf_dir.'/*.{php,xml,yaml,yml}', '/', 'glob');
        $routes->import($conf_dir.'.{php,xml,yaml,yml}', '/', 'glob');
    }
}
