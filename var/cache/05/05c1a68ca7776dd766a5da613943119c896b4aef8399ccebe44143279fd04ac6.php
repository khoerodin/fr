<?php

/* layout.html.twig */
class __TwigTemplate_dfcec58028d81fb378c126450e0b9f9128eb3278553c36ff064a5544f4e49d5d extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        ob_start();
        // line 2
        echo "<!DOCTYPE html>
    <html lang=\"en-us\">
    <head>";
        // line 5
        $this->loadTemplate("layout/header.html.twig", "layout.html.twig", 5)->display(array_merge($context, array("title" => ($context["title"] ?? null))));
        // line 6
        if (array_key_exists("css", $context)) {
            // line 7
            echo ($context["css"] ?? null);
        }
        // line 9
        echo "</head>
        <body class=\"skin-red sidebar-mini\">
            <div class=\"wrapper\">";
        // line 12
        $this->loadTemplate("layout/body_header.html.twig", "layout.html.twig", 12)->display($context);
        // line 13
        $this->loadTemplate("layout/menu.html.twig", "layout.html.twig", 13)->display($context);
        // line 14
        $this->loadTemplate("layout/content.html.twig", "layout.html.twig", 14)->display(array_merge($context, array("title" => ($context["title"] ?? null), "content" => ($context["content"] ?? null))));
        // line 15
        $this->loadTemplate("layout/footer.html.twig", "layout.html.twig", 15)->display($context);
        // line 16
        if (array_key_exists("js", $context)) {
            // line 17
            echo ($context["js"] ?? null);
        }
        // line 19
        echo "</div>
        </body>
    </html>";
        echo trim(preg_replace('/>\s+</', '><', ob_get_clean()));
    }

    public function getTemplateName()
    {
        return "layout.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  49 => 19,  46 => 17,  44 => 16,  42 => 15,  40 => 14,  38 => 13,  36 => 12,  32 => 9,  29 => 7,  27 => 6,  25 => 5,  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "layout.html.twig", "/home/aden/Projects/BIGERPFRONT/var/views/layout.html.twig");
    }
}
