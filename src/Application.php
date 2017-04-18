<?php

namespace Bisnis;

use Ihsan\Client\Platform\Bootstrap;

class Application extends Bootstrap
{
    /**
     * @return string
     */
    protected function projectDir()
    {
        return __DIR__.'/..';
    }
}
