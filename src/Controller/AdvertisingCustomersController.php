<?php

namespace Bisnis\Controller;

class AdvertisingCustomersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Pelanggan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-customers/index.twig', $data);
    }
}