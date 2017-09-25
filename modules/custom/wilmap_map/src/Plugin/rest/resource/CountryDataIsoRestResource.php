<?php

namespace Drupal\wilmap_map\Plugin\rest\resource;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
/**
 * Provides a resource to get country data from country iso2 code.
 *
 * @RestResource(
 *   id = "country_data_iso_rest_resource",
 *   label = @Translation("Country Data From iso2 Rest Resource"),
 *   uri_paths = {
 *     "canonical" = "/deprecated/api/country/data/iso2/{code}",
 *   }
 * )
 *
 * @deprecated
 */
class CountryDataIsoRestResource extends CountryDataRestResource
{

    /**
     * Responds to GET requests.
     *
     * Returns country data in "group_data_popup" field group as defined in Country form.
     *
     * @param $code string country iso2 code
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *   Throws exception expected.
     *
     * @see parent::get();
     */
    public function get($code = null)
    {

        // Get country nid from iso2 code
        $service = \Drupal::service('wilmap_map.country');
        $nids = $service->getCountryFromIso($code);

        if (empty($nids)) {
            throw new AccessDeniedHttpException();
        }

        return parent::get(reset($nids));
    }

}
