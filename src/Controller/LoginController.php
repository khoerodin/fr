<?php

namespace Bisnis\Controller;

use Ihsan\Client\Platform\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

        if($response->getStatusCode() != 401){
            $token = json_decode($response->getContent(), true)['token'];
            $this->store('token', $token);
            //var_dump($token);die();
        }

        return new Response($response->getStatusCode());
    }

    public function logoutAction()
    {
        $this->request('logout', 'put', []);
        $this->client->remove('token');
    }
}