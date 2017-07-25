<?php

namespace Bisnis\Controller;

class AdvertisingOrdersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Order Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-orders/index.twig', $data);
    }

    public function newAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Buat Order Iklan Baru',
        ];

        $representatives = $this->request('representatives', 'get');
        $representatives = json_decode($representatives->getContent(), true)['hydra:member'];

        $paymentMethod = $this->request('billing/payment-methods', 'get');
        $paymentMethod = json_decode($paymentMethod->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'representatives' => $representatives,
            'paymentMethod' => $paymentMethod
        ];

        return $this->view('advertising-orders/new.twig', $data);
    }
}