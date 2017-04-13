<?php

namespace Bisnis\Api;

use GuzzleHttp\Client;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class GuzzleClient implements ClientInterface
{
    /**
     * @var Client
     */
    private $guzzle;

    /**
     * @var array
     */
    private $options = array();

    public function __construct()
    {
        $this->guzzle = new Client();
    }

    /**
     * @param string $token
     */
    public function bearer($token)
    {
        $this->options = array(
            'headers' => array(
                'Authorization' => sprintf('Bearer %s', $token),
            )
        );
    }

    /**
     * @param $url
     * @param array $options
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function get($url, array $options = array())
    {
        return $this->guzzle->get($url, $this->mergeOptions($options));
    }

    /**
     * @param $url
     * @param array $options
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function post($url, array $options = array())
    {
        return $this->guzzle->post($url, $this->mergeOptions($options));
    }

    /**
     * @param $url
     * @param array $options
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function put($url, array $options = array())
    {
        return $this->guzzle->put($url, $this->mergeOptions($options));
    }

    /**
     * @param $url
     * @param array $options
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function delete($url, array $options = array())
    {
        return $this->guzzle->delete($url, $this->mergeOptions($options));
    }

    /**
     * @param array $options
     * @return array
     */
    private function mergeOptions(array $options)
    {
        if (array_key_exists('headers', $options) && array_key_exists('headers', $this->options)) {
            $options['headers'] = array_merge($this->options['headers'], $options['headers']);
        } else {
            $options = array_merge($options, $this->options);
        }

        return $options;
    }
}
