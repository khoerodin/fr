<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends AbstractController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Home',
            'title' => 'Masuk',
        ];

        $data = [
            'meta' => $meta,
        ];

        $this->request('logout', 'put', []);
        $this->client->removeAll();

        return $this->renderResponse('login.twig', $data);
    }

    public function processLoginAction(Request $request)
    {
        $username = $request->get('username');
        $password = $request->get('password');

        $response = $this->post('login', [
            'username' => $username,
            'password' => $password,
        ]);

        $arr = json_decode($response->getContent(), true);

        if (array_key_exists('token', $arr) && $response->getStatusCode() === 200) {
            if ( !empty($arr['token']) ) {
                $this->store('token', $arr['token']);
                return new Response('1');
            }

            return new Response($response->getStatusCode());
        }

        return new Response($response->getStatusCode());
    }

    /*public function logoutAction(Request $request)
    {
        $response = $this->request('logout', 'put', []);
        $this->client->removeAll();

        if (strtolower($request->getMethod()) == 'get') {
            return new RedirectResponse('/login');
        }

        return $response;
    }*/
}
