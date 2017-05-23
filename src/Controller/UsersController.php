<?php

namespace Bisnis\Controller;

class UsersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Users',
        ];

        $users = $this->get('users');
        $users = json_decode($users->getContent(),true);

        $companies = $this->get('companies');
        $companies = json_decode($companies->getContent(),true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'users' => $users,
            'companies' => $companies
        ];

        return $this->view('users/index.twig', $data);
    }
}