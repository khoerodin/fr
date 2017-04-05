<?php

namespace Bisnis\Http;

use Bisnis\Controller\ControllerResolver;
use Bisnis\Event\FilterController;
use Bisnis\Event\FilterResponse;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Routing\Exception\InvalidParameterException;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class Kernel implements HttpKernelInterface
{
    /**
     * @var RouteCollection
     */
    private $router;

    /**
     * @var EventDispatcher
     */
    private $eventDispatcher;

    /**
     * @param RouteCollection $routeCollection
     * @param EventDispatcher $eventDispatcher
     */
    public function __construct(RouteCollection $routeCollection, EventDispatcher $eventDispatcher)
    {
        $this->router = $routeCollection;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * When $catch is true, the implementation must catch all exceptions
     * and do its best to convert them to a Response instance.
     *
     * @param Request $request A Request instance
     * @param int     $type    The type of the request
     *                         (one of HttpKernelInterface::MASTER_REQUEST or HttpKernelInterface::SUB_REQUEST)
     * @param bool    $catch   Whether to catch exceptions or not
     *
     * @return Response A Response instance
     *
     * @throws \Exception When an Exception occurs during processing
     */
    public function handle(Request $request, $type = self::MASTER_REQUEST, $catch = true)
    {
        $filterResponse = new FilterResponse($request);
        $this->eventDispatcher->dispatch(KernelEvents::FILTER_REQUEST, $filterResponse);

        $response = $filterResponse->getResponse();
        if ($response instanceof Response) {
            return $response;
        }

        try {
            $controllerResolver = new ControllerResolver($this->router, $request);
            $attributes = $controllerResolver->resolve($request->getPathInfo());

            $filterController = new FilterController($request, $attributes);
            $this->eventDispatcher->dispatch(KernelEvents::FILTER_CONTROLLER, $filterController);

            $response = call_user_func_array(array($attributes['_c'], $attributes['_a']), $attributes['_p']);
        } catch (ResourceNotFoundException $e) {
            $response = new Response('Not found!', Response::HTTP_NOT_FOUND);
        }

        if ($response instanceof Response) {
            $filterResponse->setResponse($response);
            $this->eventDispatcher->dispatch(KernelEvents::FILTER_RESPONSE, $filterResponse);

            return $filterResponse->getResponse();
        }

        throw new InvalidParameterException(sprintf('The controller must return a "\Symfony\Component\HttpFoundation\Response" object'));
    }

    /**
     * @param string $name
     * @param Route  $route
     */
    protected function route($name, Route $route)
    {
        $this->router->add($name, $route);
    }

    protected function on($event, $callback)
    {
        if (!is_callable($callback)) {
            throw new \InvalidArgumentException(sprintf('"%s" is not callable.'));
        }

        $this->eventDispatcher->addListener($event, $callback);
    }
}
