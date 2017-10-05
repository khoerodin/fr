<?php

namespace Bisnis\Controller;


class ServicesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Servis',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('services/index.twig', $data);
    }
}