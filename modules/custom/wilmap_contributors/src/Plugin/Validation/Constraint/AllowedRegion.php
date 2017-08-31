<?php

namespace Drupal\wilmap_contributors\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Checks that the submitted value is an available Region for user
 *
 * @Constraint(
 *   id = "allowed_region",
 *   label = @Translation("Allowed Region", context = "Validation"),
 * )
 */
class AllowedRegion extends Constraint
{

// The message that will be shown if user is not contributor of region
    public $message = 'You are not a Contributor of region %region.';

}