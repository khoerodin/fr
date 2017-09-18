<?php

namespace Bisnis\Controller;


class HelpdeskTicketsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Tiket Helpdesk',
        ];

        $admin = $this->request('users', 'get', ['username' => 'aden']);
        $admin = json_decode($admin->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'admin' => ['id' => $admin[0]['id'], 'username' => $admin[0]['username']]
        ];

        return $this->view('helpdesk-tickets/index.twig', $data);
    }
}