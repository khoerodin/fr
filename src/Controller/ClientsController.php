<?php

namespace Bisnis\Controller;

class ClientsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Klien',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('clients/index.twig', $data);
    }
}