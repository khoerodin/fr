<?php

namespace Bisnis\Template;

use Bisnis\Middleware\MiddlewareInterface;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
class TemplateMiddleware implements MiddlewareInterface
{
    /**
     * @param array $configs
     */
    public function run(array $configs = array())
    {
        $class = $configs['_c'];
        $implements = class_implements($class);
        if (array_key_exists(TemplatingAwareInterface::class, $implements)) {
            call_user_func_array(array($configs['_c'], 'setTemplateEngine'), array($configs['_p']['_t']));
        }
    }
}
