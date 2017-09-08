<?php

namespace Bisnis\Controller;

class UsersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Pengguna',
        ];

        $services = $this->request('services', 'get');
        $services = json_decode($services->getContent(), true)['hydra:member'];

        // sorting ASC
        usort($services, function($a, $b) {
            return $a['name'] <=> $b['name'];
        });

        $data = [
            'meta' => $meta,
            'services' => $services
        ];

        return $this->view('users/index.twig', $data);
    }
}