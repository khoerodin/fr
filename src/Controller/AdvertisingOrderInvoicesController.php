<?php

namespace Bisnis\Controller;

class AdvertisingOrderInvoicesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Faktur Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-order-invoices/index.twig', $data);
    }
}
