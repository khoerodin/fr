<?php

namespace Bisnis\Controller;

use Bisnis\Template\TemplateEngineInterface;
use Bisnis\Template\TemplatingAwareInterface;
use Bisnis\Template\TemplatingAwareTrait;

/**
 * @author Muhamad Surya Iksanudin <surya.iksanudin@bisnis.com>
 */
abstract class AbstractController implements ControllerInterface, TemplatingAwareInterface
{
    use TemplatingAwareTrait;
}
