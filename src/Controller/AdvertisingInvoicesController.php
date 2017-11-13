<?php

namespace Bisnis\Controller;


use Symfony\Component\HttpFoundation\Request;

class AdvertisingInvoicesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Membuat Faktur Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-invoices/index.twig', $data);
    }

    private function penyebut($nilai) {
        $nilai = abs($nilai);
        $huruf = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
        $temp = "";
        if ($nilai < 12) {
            $temp = " ". $huruf[$nilai];
        } else if ($nilai <20) {
            $temp = $this->penyebut($nilai - 10). " belas";
        } else if ($nilai < 100) {
            $temp = $this->penyebut($nilai/10)." puluh". $this->penyebut($nilai % 10);
        } else if ($nilai < 200) {
            $temp = " seratus" . $this->penyebut($nilai - 100);
        } else if ($nilai < 1000) {
            $temp = $this->penyebut($nilai/100) . " ratus" . $this->penyebut($nilai % 100);
        } else if ($nilai < 2000) {
            $temp = " seribu" . $this->penyebut($nilai - 1000);
        } else if ($nilai < 1000000) {
            $temp = $this->penyebut($nilai/1000) . " ribu" . $this->penyebut($nilai % 1000);
        } else if ($nilai < 1000000000) {
            $temp = $this->penyebut($nilai/1000000) . " juta" . $this->penyebut($nilai % 1000000);
        } else if ($nilai < 1000000000000) {
            $temp = $this->penyebut($nilai/1000000000) . " milyar" . $this->penyebut(fmod($nilai,1000000000));
        } else if ($nilai < 1000000000000000) {
            $temp = $this->penyebut($nilai/1000000000000) . " trilyun" . $this->penyebut(fmod($nilai,1000000000000));
        }
        return $temp;
    }

    private function terbilang($nilai) {
        if($nilai<0) {
            $hasil = "minus ". trim($this->penyebut($nilai));
        } else {
            $hasil = trim($this->penyebut($nilai));
        }
        return $hasil;
    }

    public function printAction($invoiceId)
    {
        $meta = [
            'parentMenu' => 'Faktur',
            'title' => 'Cetak Faktur',
        ];

        $invoice = $this->request('advertising/invoices/' . $invoiceId, 'get');
        $invoice = json_decode($invoice->getContent(), true);

        $order = $this->request('advertising/order-invoices', 'get', ['invoice.id' => $invoice['id']]);
        $order = json_decode($order->getContent(), true)['hydra:member'][0]['order'];

        $publishAds = $this->request('advertising/publish-ads', 'get', ['order.id' => $order['id'], 'order' => ['publishDate' => 'ASC']]);
        $publishAds = json_decode($publishAds->getContent(), true)['hydra:member'];
        $panjang = sizeof($publishAds);
        foreach ($publishAds as $key => $publishAd) {
            if($key == 0){
                $awal = $publishAd['publishDate'];
            }

            if($key+1 == $panjang){
                $akhir = $publishAd['publishDate'];
            }
        }

        $tglTerbit['awal'] = $awal;
        $tglTerbit['akhir'] = $akhir;

        $jenis = strtolower($order['specification']['name']);
        $jenis = str_replace(' ', '', $jenis);

        if ( substr( $jenis, 0, 5 ) === "paket" ) {
            $tarif = 'k';
        } else {
            switch ($jenis) {
                case "kuping":
                    $tarif = 'k';
                    break;
                case "banner":
                    $tarif = 'k';
                    break;
                case "stapel":
                    $tarif = 'k';
                    break;
                case "eksposisi":
                    $tarif = 'k';
                    break;
                case "tarifkhusus":
                    $tarif = 'k';
                    break;
                default:
                    $tarif = 'n';
            }
        }

        $data = [
            'meta' => $meta,
            'invoice' => $invoice,
            'order' => $order,
            'tarif' => $tarif,
            'terbilang' => $this->terbilang($invoice['amount']) . ' rupiah',
            'tglTerbit' => $tglTerbit
        ];

        return $this->view('advertising-invoices/print.twig', $data);
    }

    public function InvoicesPrintAction($state, $start, $end)
    {
        $startDate = date_parse($start);
        $start = $startDate['year'] . '-' . $startDate['month'] . '-' . $startDate['day'] . ' 00:00:00';
        //$start = date('Y-m-d', strtotime($start. ' - 1 days'));

        $endDate = date_parse($end);
        $end = $endDate['year'] . '-' . $endDate['month'] . '-' . $endDate['day'] . ' 00:00:00';
        //$end = date('Y-m-d', strtotime($end. ' + 1 days'));

        $orders = $this->request(
            'advertising/orders',
            'get',
            [
                'createdAt' => [
                    'after' => $start
                ],
                'createdAt' => [
                    'before' => $end
                ]
            ]
        );
        $orders = json_decode($orders->getContent(), true)['hydra:member'];

        $orderIds = [];
        foreach ($orders as $order) {
            $orderIds[] = $order['id'];
        }

        return $this->InvoicesPrintPreviewAction($orderIds);
    }

    private function InvoicesPrintPreviewAction(Array $ids)
    {
        $meta = [
            'title' => 'CETAK FAKTUR - ' . date("d-m-Y H:i:s"),
        ];

        $invoices = $this->request('advertising/invoices/by_orders.json', 'get', ['orders' => $ids, 'status' => 'void']);
        $invoices = json_decode($invoices->getContent(), true);

        $terbilang = [];
        $tglTerbit = [];
        foreach ($invoices as $invoice) {
            $terbilang[$invoice['invoice']['id']] = $this->terbilang($invoice['invoice']['amount']) . ' rupiah';

            $publishAds = $this->request('advertising/publish-ads', 'get', ['order.id' => $invoice['order']['id'], 'order' => ['publishDate' => 'ASC']]);
            $publishAds = json_decode($publishAds->getContent(), true)['hydra:member'];
            $panjang = sizeof($publishAds);
            foreach ($publishAds as $key => $publishAd) {
                if($key == 0){
                    $awal = $publishAd['publishDate'];
                }

                if($key+1 == $panjang){
                    $akhir = $publishAd['publishDate'];
                }
            }
            $tglTerbit[$invoice['invoice']['id']]['awal'] = $awal;
            $tglTerbit[$invoice['invoice']['id']]['akhir'] = $akhir;
        }

        $data = [
            'meta' => $meta,
            'invoices' => $invoices,
            'terbilang' => $terbilang,
            'tglTerbit' => $tglTerbit
        ];

        return $this->view('advertising-invoices/print-preview.twig', $data);
    }
}
