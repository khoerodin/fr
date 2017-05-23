<?php

namespace Bisnis\Controller;


class UnitsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Units',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('units/index.twig', $data);
    }
}