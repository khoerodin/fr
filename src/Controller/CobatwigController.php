<?php
/**
 * Created by PhpStorm.
 * User: dhika
 * Date: 13/06/17
 * Time: 16:31
 */

namespace Bisnis\Controller;


class CobatwigController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Home',
            'title' => 'Bank',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('coba.twig', $data);
    }
}