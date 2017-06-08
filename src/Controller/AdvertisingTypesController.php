<?php

namespace Bisnis\Controller;

class AdvertisingTypesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Tipe Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-types/index.twig', $data);
    }
}