<?php

namespace Bisnis\Controller;


class HelpdeskTicketsController extends AdminController
{
    public function indexAction()
    {
        $data = [
            'meta' => [
                'parentMenu' => 'Helpdesk',
                'title' => 'Tiket Helpdesk',
            ],
        ];

        return $this->view('helpdesk-tickets/index.twig', $data);
    }
}