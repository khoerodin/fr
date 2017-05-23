<?php

/* layout/footer.html.twig */
class __TwigTemplate_34aca1ebeea478f209f93cede17f0b0fe9e45a3f89777549252d71f08853d529 extends Twig_Template
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
        echo "<footer class=\"main-footer\">
        <div class=\"pull-right hidden-xs\"><b>Version 1.0.0</b></div>
        <strong>Copyright &copy; 2017 <span style=\"color: #0d6aad\">MIS Bisnis Indonesia</span></strong>
    </footer>
    <!-- ./wrapper -->
    <!-- jQuery 2.2.3 -->
    <script src=\"/assets/jquery/jquery-2.2.3.min.js\"></script>
    <!-- Bootstrap 3.3.6 -->
    <script src=\"/assets/bootstrap/js/bootstrap.min.js\"></script>
    <!-- FastClick -->
    <script src=\"/assets/fastclick/fastclick.js\"></script>
    <!-- AdminLTE App -->
    <script src=\"/assets/adminlte/js/app.js\"></script>";
        echo trim(preg_replace('/>\s+</', '><', ob_get_clean()));
    }

    public function getTemplateName()
    {
        return "layout/footer.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "layout/footer.html.twig", "/home/aden/Projects/BIGERPFRONT/var/views/layout/footer.html.twig");
    }
}
