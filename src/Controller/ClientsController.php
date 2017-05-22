<?php

namespace Bisnis\Controller;

class ClientsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Clients',
        ];

        $clients = $this->get('clients');
        $clients = json_decode($clients->getContent(),true);

        $data = [
            'meta' => $meta,
            'clients' => $clients
        ];

        return $this->view('clients/index.twig', $data);
    }
}