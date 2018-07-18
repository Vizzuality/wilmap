<?php

namespace Drupal\wilmap_contributors\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Checks that the submitted entry has country, region or is transnational
 *
 * @Constraint(
 *   id = "requires_location_info",
 *   label = @Translation("Requires location info", context = "Validation"),
 * )
 */
class RequiresLocationInfo extends Constraint
{

// The message that will be shown if user is not contributor of country
    public $message = 'An entry requires either a Country, a Region, or must be transnational';

}