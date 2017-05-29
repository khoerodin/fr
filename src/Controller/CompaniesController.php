<?php

namespace Bisnis\Controller;


use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class CompaniesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Companies',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('companies/index.twig', $data);
    }
}