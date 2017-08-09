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

        $data = [
            'meta' => $meta,
            'helpdeskCategories' => $helpdeskCategories
        ];

        //        echo "<pre>";
        //        print_r($helpdeskCategories);
        //        echo "</pre>";die();

        return $this->view('helpdesk-my-tickets/index.twig', $data);
    }

}