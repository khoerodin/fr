<?php

namespace Bisnis\Controller;

class UsersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Users',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('users/index.twig', $data);
    }
}