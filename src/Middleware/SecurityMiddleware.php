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
     * @param int     $type
     * @param bool    $catch
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

            if (!$session->has('BACKEND_HOST')) {
                $url = parse_url($this->container['api']['base_url']);
                $session->set('BACKEND_HOST', $url['host']);
            }

            if (!$token) {
                return new RedirectResponse('/logout');
            } else {
                /** @var ClientInterface $client */
                $client = $this->container['internal.http_client'];

                $me = $client->get('users/me');

                if (401 == $me->getStatusCode()) {
                    return new RedirectResponse('/logout');
                } else {
                    $session->set('me', $me->getContent());
                    $userId = json_decode($me->getContent(), true)['id'];
                    $menus = $client->get('roles',
                        [
                            'user.id' => $userId,
                            'module.menuDisplay' => true,
                            'viewable' => true
                        ]
                    );

                    $menus = json_decode($menus->getContent(), true)['hydra:member'];
                    $modules = array();
                    foreach ($menus as $key => $value) {
                        $parentGroup = explode('#', $value['module']['groupName'])[0];
                        $childGroup = explode('#', $value['module']['groupName'])[1];

                        $modules[$parentGroup][$childGroup][] = [
                            'name' => $value['module']['name'],
                            'group' => $value['module']['groupName'],
                            'description' => $value['module']['description'],
                            'path' => str_replace('/api/', '', $value['module']['path']),
                            'iconCls' => $value['module']['iconCls'],
                        ];
                    }

                    $session->set('menus', $modules);
                }
            }
        }

        return $this->app->handle($request, $type, $catch);
    }
}
