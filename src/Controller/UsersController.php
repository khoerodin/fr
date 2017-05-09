<?php

namespace Bisnis\Controller;


use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UsersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Users',
        ];

        $users = $this->get('users');
        $users = json_decode($users->getContent(),true);

        $companies = $this->get('companies');
        $companies = json_decode($companies->getContent(),true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'users' => $users,
            'companies' => $companies
        ];

        return $this->view('users/index.twig', $data);
    }

    public function iaddAction()
    {
        $meta = [
            'title' => 'Add a User'
        ];

        $companies = $this->get('companies');
        $companies = json_decode($companies->getContent(),true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'companies' => $companies,
        ];

        return $this->view('users/add.twig', $data);
    }

    public function addAction(Request $request)
    {
        $fullname = $request->get('fullname');
        $username = $request->get('username');
        $email = $request->get('email');
        $company = $request->get('company');
        $plainPassword = $request->get('plainPassword');
        //$roles = $roles;
        $enabled = $request->get('enabled');

        $response = $this->post('users', [
            'fullname' => $fullname,
            'username' => $username,
            'email' => $email,
            'company' => '/api/companies/' . $company,
            'plainPassword' => $plainPassword,
            //'roles' => $roles,
            'enabled' => (bool) $enabled,
        ]);

        return new Response($response->getContent());
    }

    public function detailsAction($id)
    {
        $users = $this->get(sprintf('users/%s', $id));
        $users = json_decode($users->getContent());

        $meta = [
            'title' => 'Details',
        ];

        $data = [
            'meta' => $meta,
            'users' => $users
        ];

        return $this->view('users/details.twig', $data);
    }

    public function deleteAction($id)
    {
        $this->delete('/users/' . $id);
        return new RedirectResponse('/users');
    }
}