<?php

namespace Bisnis\Controller;

class DepartmentsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Departements',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('departments/index.twig', $data);
    }
}