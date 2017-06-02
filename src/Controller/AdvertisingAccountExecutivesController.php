<?php

namespace Bisnis\Controller;

class AdvertisingAccountExecutivesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Advertising',
            'title' => 'Account Executives',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-account-executives/index.twig', $data);
    }
}