<?php

namespace Bisnis\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

    public function detailAction($orderId)
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Order Iklan',
        ];

        $order = $this->request('advertising/orders/' . $orderId, 'get');
        $order = json_decode($order->getContent(), true);

        $representatives = $this->request('representatives', 'get');
        $representatives = json_decode($representatives->getContent(), true)['hydra:member'];

        $paymentMethod = $this->request('billing/payment-methods', 'get');
        $paymentMethod = json_decode($paymentMethod->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'order' => $order,
            'representatives' => $representatives,
            'paymentMethod' => $paymentMethod,
            'emiten' => $emiten,
            'sektor' => $sektor
        ];

        return $this->view('advertising-orders/detail.twig', $data);
    }

    function publishAdsAction(Request $request)
    {
        $url = 'advertising/publish-ads';
        $method = 'post';
        $data = $request->get('tanggal');

        echo "<pre>";
        var_dump($data);
        echo "</pre>";die();

        $response = $this->request($url, $method, $data);
        return new Response($response->getContent());
    }
}