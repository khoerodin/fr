<?php

namespace Bisnis\Controller;

class DepartmentsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Departements',
        ];

        $departements = $this->get('departments');
        $departements = json_decode($departements->getContent(),true);

        $data = [
            'meta' => $meta,
            'departments' => $departements
        ];

        return $this->view('departments/index.twig', $data);
    }
}