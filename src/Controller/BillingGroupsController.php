<?php

namespace Bisnis\Controller;

class BillingGroupsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Billing',
            'title' => 'Billing Group',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('billing-groups/index.twig', $data);
    }
}