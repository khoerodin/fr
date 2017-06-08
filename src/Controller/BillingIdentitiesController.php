<?php

namespace Bisnis\Controller;

class BillingIdentitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Tagihan',
            'title' => 'Identities Tagihan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-identities/index.twig', $data);
    }
}