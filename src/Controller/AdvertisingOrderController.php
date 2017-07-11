<?php

namespace Bisnis\Controller;

class AdvertisingOrderController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Order Iklan',
        ];

        $representatives = $this->request('representatives', 'get');
        $representatives = json_decode($representatives->getContent(), true)['hydra:member'];
        $data = [
            'meta' => $meta,
            'representatives' => $representatives
        ];

        return $this->view('advertising-order/index.twig', $data);
    }
}