<?php

namespace Bisnis\Application\Controller;

use Bisnis\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    public function indexAction()
    {
        $this->client->bearer('eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FERU4iXSwidXNlcm5hbWUiOiJhZGVuIiwiZXhwIjoxNDkyMDczODY5LCJpYXQiOjE0OTIwNzAyNjl9.ZtBhMmjh95c3XCcOpdw_NC50EkjU5joSp49uXGjETWddodh_w2i1Kikxir1lVouTldhrZvcmSkoYIFRGJA_MG740jAysEcFes1xfQLTmKMNo8GbK307QpxItA7e0PHPZxRNP4J9cuRF65bW6oPoHCd09lGFFnCqja0msFFIX2kRBj6WYxorcaGQG4Ym9zdbmZRWVu8jBEic0_8oTkKxYLUBoEqsR_ss6Xj2IJQy2s3lhviQvS6AOH1ILZSGWS2XUbXgQpN7tvhTKqbj1kqSRU8x4KLpoNfBQyXepX0EpxAe2pUUFIkYTDbShsPRO2YGh3DQCmwmK_Jso-p5EfUeT0pTNRGczcVb16ZvZAjKMh_Jih8fjBEkqY42XRGwACtkBgZZSaK6q-qs_YEfw4IsZkC1ZOdCsEc4aynFqMNj0B374gxO5P2jnMyjL4E21xAFBJTLgJSCOZytADhwkpaOgtQ8ZfQSiZg1AN7erSIGqFzii64xNgXyDLxCQHECWnEFCrsZl2hpgzv3jg3FucemJHZAkyHjluW4N0wlV8c2cAqXglHGXv0Dg6BDvSn0dOMjS_9KEDGDp3fq-yGp5DnHRBJ2NAARLBJYKiZvgsHoQlXbBiqNPBWl5xiYZB9Hk4nGzixzcDoYnLXrNHOXcOvsm8WJdp8jWJdqQ4g5E_h2sX0c');
        $response = $this->client->get('http://10.5.5.206:8000/api/modules', array(
            'query' => array(
                'api_key' => 'c1a7ecb8d69d93ac228ff3a30d70cba7f3d481e1',
            ),
        ));

        return new Response($response->getBody());
    }
}
