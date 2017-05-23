<?php

namespace Bisnis\Controller;

class ModulesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Modules',
        ];

        $modules = $this->get('modules');
        $modules = json_decode($modules->getContent(),true);


        $data = [
            'meta' => $meta,
            'modules' => $modules,
        ];

        return $this->view('modules/index.twig', $data);
    }
}