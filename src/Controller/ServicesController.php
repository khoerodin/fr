<?php

namespace Bisnis\Controller;


class ServicesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Services',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('services/index.twig', $data);
    }
}