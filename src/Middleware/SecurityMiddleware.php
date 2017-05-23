<?php

namespace Bisnis\Middleware;

use Bisnis\Controller\AdminController;
use Ihsan\Client\Platform\Api\ClientInterface;
use Ihsan\Client\Platform\DependencyInjection\ContainerAwareInterface;
use Ihsan\Client\Platform\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\HttpKernelInterface;

class SecurityMiddleware implements HttpKernelInterface, ContainerAwareInterface
{
    use ContainerAwareTrait;

    /**
     * @var HttpKernelInterface
     */
    private $app;

    /**
     * @param HttpKernelInterface $app
     */
    public function __construct(HttpKernelInterface $app)
    {
        $this->app = $app;
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
        $controller = $request->attributes->get('_controller');
        if ($controller instanceof AdminController) {
            /** @var Session $session */
            $session = $this->container['internal.session_storage'];
            $token = $session->get('token');
            if (!$token) {
               return new RedirectResponse('/login');
            } else {
                /** @var ClientInterface $client */
                $client = $this->container['internal.http_client'];

                $me = $client->get('users/me');

                if(401 == $me->getStatusCode()){
                    return new RedirectResponse('/login');
                } else {
                    $session->set('me', $me->getContent());
                    $menus = $client->get('roles/me');
                    $session->set('menus', $menus->getContent());
                    //var_dump($menus->getStatusCode());die();
                }
            }
        }

        return $this->app->handle($request, $type, $catch);
    }
}