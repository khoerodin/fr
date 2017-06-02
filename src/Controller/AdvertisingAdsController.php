<?php

namespace Bisnis\Controller;


class AdvertisingAdsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Ads',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-ads/index.twig', $data);
    }
}