<?php

namespace Bisnis\Controller;


class HelpdeskMyTicketsController extends AdminController
{
    public function indexAction()
    {
        $data = [
            'meta' => [
                'parentMenu' => 'Helpdesk',
                'title' => 'TiketKu',
            ]
        ];

        return $this->view('helpdesk-my-tickets/index.twig', $data);
    }

}