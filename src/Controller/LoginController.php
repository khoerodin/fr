<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class LoginController extends AbstractController
{
    public function indexAction()
    {
        return $this->renderResponse('login.twig');
    }

    public function processLoginAction(Request $request)
    {
        $username = $request->get('username');
        $password = $request->get('password');

        $response = $this->post('login', [
            'username' => $username,
            'password' => $password
        ]);

        $token = json_decode($response->getContent(), true)['token'];
        $this->store('token', $token);

        if(401 == $response->getStatusCode()){
            $redirect = new RedirectResponse('/login');
        }else{
            $redirect = new RedirectResponse('/');
        }

        return $redirect;
    }

    public function logoutAction()
    {
        $this->client->remove('token');
        return new RedirectResponse('/login');
    }
}