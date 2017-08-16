<?php

namespace Bisnis\Controller;

class BillingIdentitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Tagihan',
            'title' => 'Penanda Tagih',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-identities/index.twig', $data);
    }
}