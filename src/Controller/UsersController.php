<?php

namespace Bisnis\Controller;

class UsersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Pengguna',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('users/index.twig', $data);
    }
}