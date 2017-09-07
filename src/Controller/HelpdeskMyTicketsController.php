<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 31/07/17
 * Time: 10:37
 */

namespace Bisnis\Controller;


class HelpdeskMyTicketsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'TiketKu',
        ];

        $helpdeskCategories = $this->request('helpdesk/categories', 'get');
        $helpdeskCategories = json_decode($helpdeskCategories->getContent(), true)['hydra:member'];

        $admin = $this->request('users', 'get', ['username' => 'daniel']);
        $admin = json_decode($admin->getContent(), true)['hydra:member'];

//                echo "<pre>";
//                print_r($admin);
//                echo "</pre>";die();


        $data = [
            'meta' => $meta,
            'helpdeskCategories' => $helpdeskCategories,
            'admin' => ['id' => $admin[0]['id'], 'username' => $admin[0]['username']]
        ];



        return $this->view('helpdesk-my-tickets/index2.twig', $data);
    }

}