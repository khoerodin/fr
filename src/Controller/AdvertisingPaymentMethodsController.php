<?php

namespace Bisnis\Controller;

class AdvertisingPaymentMethodsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Payment Methods',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-payment-methods/index.twig', $data);
    }
}