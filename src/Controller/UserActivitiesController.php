<?php

namespace Bisnis\Controller;

class UserActivitiesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Admin',
            'title' => 'Aktifitas pengguna',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('user-activities/index.twig', $data);
    }
}
