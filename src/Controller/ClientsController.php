<?php

namespace Bisnis\Controller;

class ClientsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Clients',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('clients/index.twig', $data);
    }
}