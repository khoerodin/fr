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

    public function usernameAction()
    {
        $users = $this->get('users');
        $users = json_decode($users->getContent(),true)['hydra:member'];
        //var_dump($users);die();
        $filtered = [];
        foreach ($users as $values) {

            $my_array = $values;
            $allowed  = ['id', 'username'];
            $filtered[] .= array_filter(
                $my_array,
                function ($key) use ($allowed) {
                    return in_array($key, $allowed);
                },
                ARRAY_FILTER_USE_KEY
            );

            /*foreach ($values as $index => $username) {
                if($index == 'username' ) {
                    $uname['id'] .= $username;
                    $uname['username'] .= $username;
                }
            }*/
        }

        echo "<pre>";
        print_r($filtered);
        echo "</pre>";die();
    }

    public function addAction()
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

    public function aaddAction(Request $request)
    {
        $fullname = $request->get('fullname');
        $username = $request->get('username');
        $email = $request->get('email');
        $company = $request->get('company');
        $plainPassword = $request->get('plainPassword');
        $enabled = $request->get('enabled');

        $response = $this->post('users', [
            'fullname' => $fullname,
            'username' => $username,
            'email' => $email,
            'company' => '/api/companies/' . $company,
            'plainPassword' => $plainPassword,
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