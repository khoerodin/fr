<?php

namespace Bisnis\Controller;

class ClientsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Administration',
            'title' => 'Clients',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('clients/index.twig', $data);
    }
}