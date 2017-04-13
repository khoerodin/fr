<?php

namespace Bisnis\Api;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
interface ApiCallerAwareInterface
{
    public function setClient(ClientInterface $client);
}
