<?php

namespace Bisnis\Controller;


class AdvertisingInvoicePrintController extends AdminController
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

        return $this->view('advertising-invoices-print/index.twig', $data);
    }
}