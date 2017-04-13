<?php

namespace Bisnis\Api;

use Psr\Http\Message\ResponseInterface;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
interface ClientInterface
{
    /**
     * @param $url
     * @param array $options
     * @return ResponseInterface
     */
    public function get($url, array $options);

    /**
     * @param $url
     * @param array $options
     * @return ResponseInterface
     */
    public function post($url, array $options);

    /**
     * @param $url
     * @param array $options
     * @return ResponseInterface
     */
    public function put($url, array $options);

    /**
     * @param $url
     * @param array $options
     * @return ResponseInterface
     */
    public function delete($url, array $options);
}
