<?php

namespace Bisnis\Controller;

class ModulesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Administration',
            'title' => 'Modules',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('modules/index.twig', $data);
    }
}