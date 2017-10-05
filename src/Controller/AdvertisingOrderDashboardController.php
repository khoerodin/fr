<?php

namespace Bisnis\Controller;


class AdvertisingOrderDashboardController extends AdminController
{
    public function indexAction()
    {
        $data = [
            'meta' => ['title' => 'Dashboard Iklan'],
            'year' => date('Y'),
        ];

        return $this->view('advertising-order-dashboard/index.twig', $data);
    }

}