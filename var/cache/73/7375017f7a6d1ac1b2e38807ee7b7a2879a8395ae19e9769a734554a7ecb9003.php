<?php

/* layout/content.html.twig */
class __TwigTemplate_dcb419293920d48128ec885624ccedbef4fbf445bbf0e00f0acbc247c3d1f73a extends Twig_Template
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
        echo "<div class=\"content-wrapper\">
    <section class=\"content-header\">
        <h1>";
        // line 3
        echo ($context["title"] ?? null);
        echo "</h1>
        <ol class=\"breadcrumb\">
            <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li>
            <li class=\"active\">Dashboard</li>
        </ol>
    </section>
    <section class=\"content\">";
        // line 9
        echo ($context["content"] ?? null);
        echo "</section>
</div>";
    }

    public function getTemplateName()
    {
        return "layout/content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  32 => 9,  23 => 3,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "layout/content.html.twig", "/home/aden/Projects/BIGERPFRONT/var/views/layout/content.html.twig");
    }
}
