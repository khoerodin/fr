<?php

namespace Bisnis\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class ControllerResolver
{
    /**
     * @var UrlMatcher
     */
    private $urlMatcher;

    /**
     * @var Request
     */
    private $request;

    /**
     * @param RouteCollection $routeCollection
     * @param Request         $request
     */
    public function __construct(RouteCollection $routeCollection, Request $request)
    {
        $requestContext = new RequestContext();
        $requestContext->fromRequest($request);
        $this->urlMatcher = new UrlMatcher($routeCollection, $requestContext);
        $this->request = $request;
    }

    /**
     * @param $path
     *
     * @return array
     */
    public function resolve($path)
    {
        $attributes = $this->urlMatcher->match($path);
        $controllerNotation = explode('@', $attributes['_c']);
        unset($attributes['_c']);

        $controller = explode(':', $controllerNotation[0]);

        $total = count($controller);
        $last = $total - 1;

        $controller[$total] = $controller[$last];
        $controller[$last] = 'Controller';

        $action = sprintf('%sAction', $controllerNotation[1]);
        unset($controllerNotation);

        $class = implode('\\', $controller);
        $implements = class_implements($class);
        if (!array_key_exists(ControllerInterface::class, $implements)) {
            throw new \InvalidArgumentException(sprintf('"%s" must implement "%s"', $class, ControllerInterface::class));
        }

        return array(
            '_c' => new $class(),
            '_a' => $action,
            '_p' => array_merge($attributes, array('_request' => $this->request)),
        );
    }
}
