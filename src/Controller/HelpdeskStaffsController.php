<?php

namespace Bisnis\Controller;


class HelpdeskStaffsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Staff Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-staffs/index.twig', $data);
    }
}