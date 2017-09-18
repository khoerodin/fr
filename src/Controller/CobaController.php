<?php

namespace Bisnis\Controller;


class CobaController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Coba',
            'title' => 'Coba',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('coba/index.twig', $data);
    }
}