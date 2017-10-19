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

        switch ($jenis) {
            case "kuping":
                $harga = '';
                break;
            case "banner":
                $harga = '';
                break;
            case "stapel":
                $harga = '';
                break;
            case "eksposisi":
                $harga = '';
                break;
            case "tarif khusus":
                $harga = '';
                break;
            case substr( $jenis, 0, 5 ) === "paket" ) :
                $harga = '';
                break;
            default:
                echo "Your favorite color is neither red, blue, nor green!";
        }

        $harga =

        $data = [
            'meta' => $meta,
            'invoice' => $invoice,
            'order' => $order
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
