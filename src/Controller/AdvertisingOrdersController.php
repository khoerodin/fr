<?php

namespace Bisnis\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
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

        $tagStrings = explode(',', $order['orderTag']);

        $allTags = $this->request('advertising/tags', 'get');
        $allTags = json_decode($allTags->getContent(), true)['hydra:member'];

        $tags = [];
        foreach ($allTags as $tag) {
            $tags[] = [
                'id' => $tag['id'],
                'name' => $tag['name'],
                'selected' => ( in_array($tag['id'], $tagStrings) ) ? 1 : 0
            ];
        }

        $orderRefference = $this->request('advertising/orders/' . $order['orderRefference'], 'get');
        $orderRefference = json_decode($orderRefference->getContent(), true);

        $categories = $this->request('advertising/categories', 'get');
        $categories = json_decode($categories->getContent(), true)['hydra:member'];

        $data = [
            'meta' => $meta,
            'order' => $order,
            'representatives' => $representatives,
            'paymentMethod' => $paymentMethod,
            'categories' => $this->getTreeParents($order['category']['id'], $categories),
            'tags' => $tags,
            'orderRefference' => $orderRefference['orderNumber']
        ];

        return $this->view('advertising-orders/detail.twig', $data);
    }

    private function getTreeParents($categoryId, $categories)
    {
        $str = '';
        foreach ($categories as $value) {
            if ( $categoryId == $value['id'] ) {

                $str .= $this->getTreeParents( $value['parent']['id'], $categories);
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

    private function searchModule(array $request)
    {
        $url = $request['module'];
        $method = $request['method'];;
        $q = $request['q'];;
        $field = $request['field'];;
        $params2 = $request['params2'];;
        $label = $request['label'];;

        $params = [];
        foreach ($field as $column) {
            $params[$column] = $q;
        }

        if (is_null($params2)) {
            $params3 = [];
            foreach ($params2 as $key => $value) {
                $params3[$key] = $value;
            }
            $params = array_merge($params, $params3);
        }

        $response = $this->request($url, $method, $params);
        $arr = json_decode($response->getContent(), true);

        if (array_key_exists('hydra:member', $arr)) {
            if(count($arr) > 0 ) {
                $arr = $arr['hydra:member'];
            } else {
                return new JsonResponse(array());
            }
        } else {
            return new JsonResponse(array());
        }


        $arrData = [];
        foreach ($arr as $value) {
            $obj = [];
            foreach ($value as $k => $v) {
                if($k == 'id'){
                    $obj[$k] = $v;

                }

                if($k == $field[0]){
                    $obj['field'] = $v . $label;
                }
            }
            $arrData[] = $obj;
        }

        return $arrData;
    }

    private function searchTagging($q)
    {
        $response = $this->request('advertising/tags', 'GET', ['name' => $q ]);
        $arr = json_decode($response->getContent(), true);

        if (array_key_exists('hydra:member', $arr)) {
            if(count($arr) > 0 ) {
                $arr = $arr['hydra:member'];
            } else {
                return new JsonResponse(array());
            }
        } else {
            return new JsonResponse(array());
        }

        $arrData = [];
        foreach ($arr as $value) {
            $obj = [];
            foreach ($value as $k => $v) {
                if($k == 'id'){
                    $obj[$k] = $v;

                }

                if($k == 'name'){
                    $obj['field'] = $v . ' ~ Tag';
                }
            }
            $arrData[] = $obj;
        }

        return $arrData;

    }

    public function searchAction(Request $request)
    {
        $orderNumberData = [
            'module'    => 'advertising/orders',
            'method'    => 'GET',
            'q'         => $request->get('q'),
            'field'     => array('orderNumber'),
            'params2'   => $request->get('params'),
            'label'     => ' ~ No Order'
        ];

        $orderLetterData = [
            'module'    => 'advertising/orders',
            'method'    => 'GET',
            'q'         => $request->get('q'),
            'field'     => array('orderLetter'),
            'params2'   => $request->get('params'),
            'label'     => ' ~ No Surat Order'
        ];

        $orderNumber = $this->searchModule($orderNumberData);
        $orderLetter = $this->searchModule($orderLetterData);
        $tags = $this->searchTagging($request->get('q'));

        $response = array_merge($orderNumber, $orderLetter, $tags);
        return new JsonResponse($response);
    }

    public function invoicesAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Faktur Iklan',
        ];

        $data = [
            'meta' => $meta
        ];

        return $this->view('advertising-orders/invoices.twig', $data);
    }
}
