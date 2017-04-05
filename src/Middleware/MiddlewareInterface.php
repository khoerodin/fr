<?php

namespace Bisnis\Middleware;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
interface MiddlewareInterface
{
    /**
     * @param array $configs
     */
    public function run(array $configs = array());
}
