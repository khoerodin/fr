<?php

namespace Bisnis\Controller;

class RolesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Roles',
        ];

        $roles = $this->get('roles');
        $roles = json_decode($roles->getContent(),true);


        $data = [
            'meta' => $meta,
            'roles' => $roles,
        ];

        return $this->view('roles/index.twig', $data);
    }
}