<?php

namespace Bisnis\Controller;

class ModulesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Modul',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('modules/index.twig', $data);
    }
}