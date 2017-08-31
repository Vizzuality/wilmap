<?php

namespace Drupal\wilmap_contributors\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Checks that the submitted value is an available Country for user
 *
 * @Constraint(
 *   id = "allowed_country",
 *   label = @Translation("Allowed Country", context = "Validation"),
 * )
 */
class AllowedCountry extends Constraint
{

// The message that will be shown if user is not contributor of country
    public $message = 'You are not a Contributor of %country.';

}