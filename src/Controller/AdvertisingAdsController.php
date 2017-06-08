<?php

namespace Bisnis\Controller;


class AdvertisingAdsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-ads/index.twig', $data);
    }
}