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

    public function addAction()
    {
        $meta = [
            'title' => 'Add a Company'
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('companies/add.twig', $data);
    }

    public function processAddAction(Request $request)
    {
        $name = $request->get('name');
        $email = $request->get('email');
        $address = $request->get('address');
        $contactPerson = $request->get('contactPerson');
        $phoneNumber = $request->get('phoneNumber');

        $response = $this->post('companies', [
            'name' => $name,
            'email' => $email,
            'address' => $address,
            'contactPerson' => $contactPerson,
            'phoneNumber' => $phoneNumber,
        ]);

        return new RedirectResponse('/companies');
    }

    public function detailsAction($id)
    {
        $companies = $this->get('companies/' . $id);
        $companies = json_decode($companies->getContent());

        $meta = [
            'title' => 'Details',
        ];

        $data = [
            'meta' => $meta,
            'companies' => $companies
        ];

        return $this->view('companies/details.twig', $data);
    }

    public function deleteAction($id)
    {
        $this->delete('/companies/' . $id);
        return new RedirectResponse('/companies');
    }
}