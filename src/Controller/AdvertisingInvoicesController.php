<?php

namespace Bisnis\Controller;

class AdvertisingInvoicesController extends AdminController
{
    public function indexAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Faktur Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-invoices/index.twig', $data);
    }

    public function pdfAction($invoiceId)
    {
        $meta = [
            'parentMenu' => 'Faktur',
            'title' => 'Cetak Faktur',
        ];

        $invoice = $this->request('advertising/invoices/' . $invoiceId, 'get');
        $invoice = json_decode($invoice->getContent(), true);

        $order = $this->request('advertising/order-invoices', 'get', ['invoice.id' => $invoice['id']]);
        $order = json_decode($order->getContent(), true)['hydra:member'][0]['order'];

        $jenis = strtolower($order['specification']['name']);

        $harga = '';
        if ( substr( $jenis, 0, 5 ) === "paket" ) {
            $harga = $order['basePrice'];
        } else {
            switch ($jenis) {
                case "kuping":
                    $harga = $order['basePrice'];
                    break;
                case "banner":
                    $harga = $order['basePrice'];
                    break;
                case "stapel":
                    $harga = $order['basePrice'];
                    break;
                case "eksposisi":
                    $harga = $order['basePrice'];
                    break;
                case "tarif khusus":
                    $harga = $order['basePrice'];
                    break;
                default:
                    $harga = ( (float) $order['columnSize'] *(float) $order['milimeterSize'] ) * (float) $order['totalPost'] * (float) $order['basePrice'];
            }
        }

        $data = [
            'meta' => $meta,
            'invoice' => $invoice,
            'order' => $order,
            'harga' => $harga
        ];

        return $this->view('advertising-invoices/pdf.twig', $data);
    }

    public function printAction()
    {
        $meta = [
            'parentMenu' => 'Faktur',
            'title' => 'Print Template',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-invoices/pdf.twig', $data);
    }
}
