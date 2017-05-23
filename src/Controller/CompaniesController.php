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

        $companies = $this->get('companies');
        $companies = json_decode($companies->getContent(),true);

        $data = [
            'meta' => $meta,
            'companies' => $companies
        ];

        return $this->view('companies/index.twig', $data);
    }
}