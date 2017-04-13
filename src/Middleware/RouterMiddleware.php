<?php

namespace Bisnis\Middleware;

use Bisnis\Controller\ControllerResolver;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\Exception\InvalidParameterException;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class RouterMiddleware implements HttpKernelInterface
{
    /**
     * @var HttpKernelInterface
     */
    private $app;

    /**
     * @var EventDispatcher
     */
    private $eventDispatcher;

    /**
     * @param HttpKernelInterface $app
     * @param EventDispatcher $eventDispatcher
     */
    public function __construct(HttpKernelInterface $app, EventDispatcher $eventDispatcher)
    {
        $this->app = $app;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Request $request
     * @param int $type
     * @param bool $catch
     *
     * @return Response
     */
    public function handle(Request $request, $type = self::MASTER_REQUEST, $catch = true)
    {
        $configurations = $request->attributes->get('_config', array());
        $router = new RouteCollection();

        if (array_key_exists('routes', $configurations)) {
            foreach ($configurations['routes'] as $route) {
                $this->buildRoute($router, $route);
                $this->attachEvent($route);
            }
        }

        $controllerResolver = new ControllerResolver($router, $request);
        $request->attributes->add($controllerResolver->resolve($request->getPathInfo()));

        return $this->app->handle($request, $type, $catch);
    }

    private function buildRoute(RouteCollection $router, array $config)
    {
        if (!key_exists('controller', $config)) {
            throw new InvalidParameterException(sprintf('"controller" key must be set.'));
        }

        if (!key_exists('path', $config)) {
            throw new InvalidParameterException(sprintf('"path" must be set.'));
        }

        if (!key_exists('name', $config)) {
            $config['name'] = $config['controller'];
        }

        if (!key_exists('methods', $config)) {
            $config['methods'] = array();
        }

        $router->add($config['name'], new Route($config['path'], array(
            '_controller' => $config['controller'],
        ), array(), array(), '', array(), $config['methods']));
    }

    private function attachEvent(array $config)
    {
        if (key_exists('filter', $config)) {
            if (!key_exists('event', $config['filter'])) {
                throw new \OutOfBoundsException(sprintf('Key "event" must be set in "filter" key.'));
            }
            if (!key_exists('listener', $config['filter'])) {
                throw new \OutOfBoundsException(sprintf('Key "listener" must be set in "filter" key.'));
            }

            $this->doAttach($config['filter']['event'], $config['filter']['listener']);
        }
    }

    private function doAttach($event, $callback)
    {
        if (!is_callable($callback)) {
            throw new \InvalidArgumentException(sprintf('"%s" is not callable.'));
        }

        $this->eventDispatcher->addListener($event, $callback);
    }
}
