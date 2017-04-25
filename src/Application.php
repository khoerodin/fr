<?php

namespace Bisnis;

use Ihsan\Client\Platform\Bootstrap;
use Symfony\Component\Cache\Adapter\AdapterInterface;

class Application extends Bootstrap
{
    /**
     * @param string $configDir
     * @param AdapterInterface|null $cacheAdapter
     * @param array $values
     */
    public function __construct($configDir, AdapterInterface $cacheAdapter = null, array $values = array())
    {
        parent::__construct($cacheAdapter, $values);
        $this->boot($configDir);
    }

    /**
     * @return string
     */
    protected function projectDir()
    {
        return __DIR__.'/..';
    }
}
