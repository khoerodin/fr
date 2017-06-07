<?php

namespace Bisnis\Controller;

class BillingIdentitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Billing',
            'title' => 'Billing Identities',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-identities/index.twig', $data);
    }
}