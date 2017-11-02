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
        ];

        return $this->view('advertising-invoices/pdf.twig', $data);
    }

    public function InvoicesPrintAction()
    {
        $meta = [
            'parentMenu' => 'Iklan',
            'title' => 'Cetak Faktur Iklan',
        ];

        $data = [
            'meta' => $meta,
        ];

        return $this->view('advertising-invoices/invoices-print.twig', $data);
    }

    public function InvoicesPrintPreviewAction(Request $request)
    {
        $ids = explode(',', $request->get('ids'));

        $meta = [
            'parentMenu' => 'Faktur',
            'title' => 'Cetak Faktur - ' . date("Y-m-d H:i:s"),
        ];

        $invoices = $this->request('advertising/invoices/by_orders.json', 'get', ['orders' => $ids]);
        $invoices = json_decode($invoices->getContent(), true);

        $data = [
            'meta' => $meta,
            'invoices' => $invoices
        ];

        return $this->view('advertising-invoices/print-preview.twig', $data);
    }
}
