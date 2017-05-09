<?php

namespace Bisnis\Controller;

class HomeController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Dashboard',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('home.twig', $data);
    }

    public function meAction()
    {
        $response = $this->get('users/me');
        echo $response->getContent();exit();
    }

    public function cobaAction()
    {
        // PUT
        /*$response = $this->put(sprintf('clients/1?api_key=%s', self::API_KEY), [
            'name' => 'Bisnis Indonesia',
        ]);*/

        //GET
        //$response = $this->get(sprintf('clients?api_key=%s', self::API_KEY));

        //GET /{id}
        $response = $this->get('clients/1');

        // POST
        /*$response = $this->post(sprintf('clients?api_key=%s', self::API_KEY), [
            'name' => 'Coba Post',
            'email' => 'coba@post.com',
            'user' =>
        ]);*/

        echo $response->getContent();exit();
    }

    public function error404Action()
    {
        return $this->renderResponse('404.twig');
    }

    public function error500Action()
    {
        return $this->renderResponse('500.twig');
    }
}