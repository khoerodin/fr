<?php

namespace Bisnis\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

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

        return $this->view('profile.twig', $data);
    }

    public function saveAction(Request $request)
    {
        $id = $this->me->id;
        $fullname = $request->get('fullname');
        $email = $request->get('email');
        $username = $request->get('username');
        $plainPassword = $request->get('plain_password');

        $response = $this->put(sprintf('users/%s', $id), [
            'fullname' => $fullname,
            'email' => $email,
            'username' => $username,
            'plainPassword' => $plainPassword,
        ]);

        return new RedirectResponse('/profile');
    }
}