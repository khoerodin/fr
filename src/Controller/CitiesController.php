<?php

namespace Bisnis\Controller;

class CitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Kota',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('cities/index.twig', $data);
    }
}