<?php

namespace Bisnis\Controller;

class AdvertisingAccountExecutivesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Akun Eksekutif',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-account-executives/index.twig', $data);
    }
}