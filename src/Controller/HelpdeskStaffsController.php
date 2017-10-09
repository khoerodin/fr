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

        $users = $this->request('users', 'get');
        $users = json_decode($users->getContent(), true)['hydra:member'];

        $categories = $this->request('helpdesk/categories', 'get');
        $categories = json_decode($categories->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'users' => $users,
            'categories' => $categories,
        ];

        return $this->view('helpdesk-staffs/index.twig', $data);
    }
}
