<?php

namespace Bisnis\Controller;


class HelpdeskTicketDashboardController extends AdminController
{
    public function indexAction()
    {
        $admin = $this->request('users', 'get', ['username' => 'aden']);
        $admin = json_decode($admin->getContent(), true)['hydra:member'];

        $data = [
            'meta' => ['title' => 'Helpdesk Dashboard'],
            'year' => date('Y'),
            'admin' => ['id' => $admin[0]['id'], 'username' => $admin[0]['username']],
        ];

        return $this->view('helpdesk-ticket-dashboard/index.twig', $data);
    }

}