<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 14/06/17
 * Time: 9:44
 */

namespace Bisnis\Controller;


class HelpdeskTicketsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Tiket Helpdesk',
        ];

        $admin = $this->request('users', 'get', ['username' => 'daniel']);
        $admin = json_decode($admin->getContent(), true)['hydra:member'];

//                echo "<pre>";
//                print_r($admin);
//                echo "</pre>";die();

        $data = [
            'meta' => $meta,
            'admin' => ['id' => $admin[0]['id'], 'username' => $admin[0]['username']]
        ];

        return $this->view('helpdesk-tickets/index.twig', $data);
    }
}