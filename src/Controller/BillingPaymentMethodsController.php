<?php

namespace Bisnis\Controller;

class BillingPaymentMethodsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Tagihan',
            'title' => 'Metode Pembayaran',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('billing-payment-methods/index.twig', $data);
    }
}
