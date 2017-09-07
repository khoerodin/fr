<?php

namespace Bisnis\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AdvertisingOrdersController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Order Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-orders/index.twig', $data);
    }

    public function newAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Buat Order Iklan Baru',
        ];

        $representatives = $this->request('representatives', 'get');
        $representatives = json_decode($representatives->getContent(), true)['hydra:member'];

        $paymentMethod = $this->request('billing/payment-methods', 'get');
        $paymentMethod = json_decode($paymentMethod->getContent(), true)['hydra:member'];

        $media = $this->request('advertising/media', 'get', ['name' => 'BISNIS INDONESIA']);
        $media = json_decode($media->getContent(), true)['hydra:member'];

        $tags = $this->request('advertising/tags', 'get');
        $tags = json_decode($tags->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'representatives' => $representatives,
            'paymentMethod' => $paymentMethod,
            'media' => ['name' => $media[0]['name'], 'id' => $media[0]['id'] ],
            'tags' => $tags
        ];

        return $this->view('advertising-orders/new.twig', $data);
    }

    public function detailAction($orderId)
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Order Iklan',
        ];

        $order = $this->request('advertising/orders/' . $orderId, 'get');
        $order = json_decode($order->getContent(), true);

        $representatives = $this->request('representatives', 'get');
        $representatives = json_decode($representatives->getContent(), true)['hydra:member'];

        $paymentMethod = $this->request('billing/payment-methods', 'get');
        $paymentMethod = json_decode($paymentMethod->getContent(), true)['hydra:member'];

        $categories = $this->request('advertising/categories', 'get');
        $categories = json_decode($categories->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'order' => $order,
            'representatives' => $representatives,
            'paymentMethod' => $paymentMethod,
            'categories' => $this->getTreeParents($order['category']['id'],$categories)
        ];

        return $this->view('advertising-orders/detail.twig', $data);
    }

    private function getTreeParents($childId, $array)
    {
        $str = '';
        foreach ($array as $value) {
            if ( $childId == $value['id'] ) {

                $str .= $this->getTreeParents( $value['parent']['id'], $array);
                if ( $value['parent']['id'] != null) {
                    $str .= ' ➤ ';
                }
                $str .= $value['name'];

            }
        }
        return $str;
    }

    function publishAdsAction(Request $request)
    {
        $orderId = $request->get('orderId');
        $tanggal = $request->get('tanggal');

        $content = array();
        foreach ($tanggal as $date) {
            if (!empty($orderId) AND $date['publishDate'] != '') {
                $response = $this->request('advertising/publish-ads', 'post', [ 'order' => '/api/advertising/orders/' . $orderId, 'publishDate' => $date['publishDate'] ]);
                $content[] = $response->getContent();
            }
        }

        return new Response(json_encode($content));
    }

    function updatePublishAdsAction(Request $request)
    {
        $datas = $request->get('data');

        $content = array();
        foreach ($datas as $data) {
            if (strtolower($data['type']) == 'put') {
                $response = $this->request('advertising/publish-ads/' . $data['id'], 'put', [ 'publishDate' => $data['publishDate'] ]);
            } elseif (strtolower($data['type']) == 'post') {
                $response = $this->request('advertising/publish-ads', 'post', [ 'order' => '/api/advertising/orders/' . $data['orderId'], 'publishDate' => $data['publishDate'] ]);
            } elseif (strtolower($data['type']) == 'delete') {
                $response = $this->request('advertising/publish-ads/' . $data['id'], 'delete');
            }
            $content[] = $response->getContent();
        }

        return new Response(json_encode($content));
    }
}