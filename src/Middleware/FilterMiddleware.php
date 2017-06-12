<?php

namespace Bisnis\Middleware;

use Bisnis\Filter\FilterFactory;
use Ihsan\Client\Platform\DependencyInjection\ContainerAwareInterface;
use Ihsan\Client\Platform\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class FilterMiddleware implements HttpKernelInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var HttpKernelInterface
     */
    private $app;

    /**
     * @var array
     */
    private $filters;

    /**
     * @param HttpKernelInterface $app
     * @param array $filters
     */
    public function __construct(HttpKernelInterface $app, array $filters = [])
    {
        $this->app = $app;
        $this->filters = $filters;
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
        $filters = [];
        foreach ($this->filters as $filter) {
            $filters[] = new $filter();
        }

        $this->container['app.filter_factory'] = function () use($filters) {
            return new FilterFactory($filters);
        };

        return $this->app->handle($request, $type, $catch);
    }
}