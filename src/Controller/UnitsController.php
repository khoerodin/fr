<?php

namespace Bisnis\Controller;


class UnitsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Units',
        ];

        $units = $this->get('units');
        $units = json_decode($units->getContent(),true);

        $data = [
            'meta' => $meta,
            'units' => $units
        ];

        return $this->view('units/index.twig', $data);
    }
}