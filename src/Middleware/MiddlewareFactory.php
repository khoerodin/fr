<?php

namespace Bisnis\Middleware;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class MiddlewareFactory
{
    /**
     * @var MiddlewareInterface[]
     */
    private $middlewares = array();

    /**
     * @param MiddlewareInterface $middleware
     */
    public function addMiddlewware(MiddlewareInterface $middleware)
    {
        $this->middlewares[get_class($middleware)] = $middleware;
    }

    /**
     * @param array $configs
     */
    public function run(array $configs = array())
    {
        foreach ($this->middlewares as $middleware) {
            $middleware->run($configs);
        }
    }
}
