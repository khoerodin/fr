<?php

namespace Bisnis\Controller;

class AdvertisingPaymentMethodsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Metode Pembayaran Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-payment-methods/index.twig', $data);
    }
}
