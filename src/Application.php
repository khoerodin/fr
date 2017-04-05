<?php

namespace Bisnis;

use Bisnis\Event\FilterController;
use Bisnis\Http\Kernel;
use Bisnis\Http\KernelEvents;
use Bisnis\Middleware\MiddlewareFactory;
use Bisnis\Template\TemplateEngineInterface;
use Bisnis\Template\TwigTemplateEngine;
use Symfony\Component\Routing\Exception\InvalidParameterException;
use Symfony\Component\Routing\Route;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class Application extends Kernel
{
    /**
     * @var TemplateEngineInterface
     */
    private $templateEngine;

    /**
     * @var array
     */
    private $configPaths = array();

    /**
     * @param string $path
     */
    public function registerConfigPath($path)
    {
        $this->configPaths[] = $path;
    }

    /**
     * @param TemplateEngineInterface $templateEngine
     */
    public function setTemplateEngine(TemplateEngineInterface $templateEngine)
    {
        $this->templateEngine = $templateEngine;
    }

    public function run()
    {
        $configs = array();
        foreach (array_unique($this->configPaths) as $config) {
            $configs = array_merge($configs, require $config);
        }

        if (!$this->templateEngine) {
            $this->templateEngine = new TwigTemplateEngine($configs['template']['views'], $configs['template']['cache']);
        }

        $this->buildRoute($configs['routes']);

        $middlewareFactory = new MiddlewareFactory();
        foreach ($configs['middlewares'] as $middleware) {
            $middlewareFactory->addMiddlewware(new $middleware());
        }

        $this->on(KernelEvents::FILTER_CONTROLLER, function (FilterController $event) use ($middlewareFactory) {
            $middlewareFactory->run($event->getAttributes());
        });
    }

    /**
     * @param array $routes
     */
    protected function buildRoute(array $routes)
    {
        foreach ($routes as $route) {
            if (!key_exists('controller', $route)) {
                throw new InvalidParameterException(sprintf('"controller" key must be set.'));
            }

            if (!key_exists('path', $route)) {
                throw new InvalidParameterException(sprintf('"path" must be set.'));
            }

            if (!key_exists('name', $route)) {
                $route['name'] = $route['controller'];
            }

            if (!key_exists('methods', $route)) {
                $route['methods'] = array();
            }

            $this->route($route['name'], new Route($route['path'], array(
                '_c' => $route['controller'],
                '_t' => $this->templateEngine,
            ), array(), array(), '', array(), $route['methods']));

            if (key_exists('filter', $route)) {
                if (!key_exists('event', $route['filter'])) {
                    throw new \OutOfBoundsException(sprintf('Key "event" must be set in "filter" key.'));
                }
                if (!key_exists('listener', $route['filter'])) {
                    throw new \OutOfBoundsException(sprintf('Key "listener" must be set in "filter" key.'));
                }

                $this->on($route['filter']['event'], $route['filter']['listener']);
            }
        }
    }
}
