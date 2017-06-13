<?php

namespace Bisnis\Controller;

class AdvertisingPricesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Harga Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-prices/index.twig', $data);
    }
}