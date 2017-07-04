<?php
/**
 * Created by PhpStorm.
 * User: mispc3
 * Date: 14/06/17
 * Time: 9:45
 */

namespace Bisnis\Controller;


class HelpdeskTicketResponsesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Helpdesk',
            'title' => 'Respon Tiket Helpdesk',
        ];

        $data = [
            'meta' => $meta
        ];

//        return $this->view('helpdesk-ticket-responses/index.twig', $data);
        return $this->view('helpdesk-ticket-responses/index1.twig', $data);
    }
}