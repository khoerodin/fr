<?php

namespace Bisnis\Controller;


class HelpdeskTicketDashboardController extends AdminController
{
    public function indexAction()
    {
        $data = [
            'meta' => ['title' => 'Helpdesk Dashboard'],
            'year' => date('Y'),
        ];

        return $this->view('helpdesk-ticket-dashboard/index.twig', $data);
    }

}