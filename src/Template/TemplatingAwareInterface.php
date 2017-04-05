<?php

namespace Bisnis\Template;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
interface TemplatingAwareInterface
{
    public function setTemplateEngine(TemplateEngineInterface $templateEngine);
}
