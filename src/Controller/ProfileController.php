<?php

namespace Bisnis\Controller;

class ProfileController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'title' => 'Profile',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('profile/index.twig', $data);
    }
}