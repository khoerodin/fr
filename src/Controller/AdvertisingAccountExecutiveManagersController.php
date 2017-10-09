<?php

namespace Bisnis\Controller;

class AdvertisingAccountExecutiveManagersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Manajer Akun Eksekutif',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-account-executive-managers/index.twig', $data);
    }
}
