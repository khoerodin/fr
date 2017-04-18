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

    /**
     * @return string
     */
    protected function cacheDir()
    {
        return sprintf('/%s/var/cache', $this->projectDir());
    }
}
