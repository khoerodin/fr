<?php

namespace Bisnis\Controller;

class BillingAreasController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Billing',
            'title' => 'Billing Area',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-areas/index.twig', $data);
    }
}