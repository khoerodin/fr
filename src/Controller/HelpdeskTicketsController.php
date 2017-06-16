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

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-tickets/index.twig', $data);
    }
}