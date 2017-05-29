<?php

namespace Bisnis\Controller;

class AccountsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Accounts',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('accounts/index.twig', $data);
    }
}