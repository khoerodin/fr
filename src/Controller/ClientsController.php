<?php

namespace Bisnis\Controller;


use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

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

    public function addAction()
    {
        $meta = [
            'title' => 'Add a Client'
        ];

        $users = $this->get('users');
        $users = json_decode($users->getContent(),true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'users' => $users
        ];

        return $this->view('clients/add.twig', $data);
    }

    public function processAddAction(Request $request)
    {
        $name = $request->get('name');
        $email = $request->get('email');
        $apiKey = $request->get('apiKey');
        $user = $request->get('user');

        $this->post('clients', [
            'name' => $name,
            'email' => $email,
            'apiKey' => $apiKey,
            'user' => '/api/users/' . $user,
        ]);

        return new RedirectResponse('/clients');
    }

    public function detailsAction($id)
    {
        $clients = $this->get('clients/' . $id);
        $clients = json_decode($clients->getContent());

        $meta = [
            'title' => 'Details',
        ];

        $data = [
            'meta' => $meta,
            'clients' => $clients
        ];

        return $this->view('clients/details.twig', $data);
    }

    public function deleteAction($id)
    {
        $this->delete('clients/' . $id);
        return new RedirectResponse('/clients');
    }
}