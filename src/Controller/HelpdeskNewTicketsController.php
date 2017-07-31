<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 31/07/17
 * Time: 10:38
 */

namespace Bisnis\Controller;


class HelpdeskNewTicketsController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Tiket Baru',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('helpdesk-new-tickets/index.twig', $data);
    }

}