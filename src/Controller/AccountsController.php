<?php

namespace Bisnis\Controller;

class AccountsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Accounts',
        ];

        $accounts = $this->get('accounts');
        $accounts = json_decode($accounts->getContent(),true);

        $data = [
            'meta' => $meta,
            'accounts' => $accounts
        ];

        return $this->view('accounts/index.twig', $data);
    }
}