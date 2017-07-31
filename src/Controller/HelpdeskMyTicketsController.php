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

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-my-tickets/index.twig', $data);
    }

}