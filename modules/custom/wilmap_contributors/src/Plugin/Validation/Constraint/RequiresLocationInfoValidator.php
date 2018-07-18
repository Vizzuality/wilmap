<?php

namespace Drupal\wilmap_contributors\Plugin\Validation\Constraint;

use Drupal\node\NodeInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;


/**
 * Validates the AllowedCountry constraint.
 */
class RequiresLocationInfoValidator extends ConstraintValidator
{

    /**
     * {@inheritdoc}
     */
    public function validate($data, Constraint $constraint)
    {
      if (!$constraint instanceof RequiresLocationInfo) {
        throw new UnexpectedTypeException($constraint, __NAMESPACE__.'\HasCodeConstraint');
      }

      // Node entity
      if ($data instanceof NodeInterface) {
        $this->validateNodeEntity($data, $constraint);
        return;
      }
    }


    /**
     * @param $data
     * @param $constraint
     *
     * @return bool
     */
    private function validateNodeEntity($data, $constraint)
    {
        if (
          $data->field_transnational->value === 0
          && \count($data->field_region) === 0
          && \count($data->field_location_entry) === 0
        ) {
          return $this->context->buildViolation(
            $constraint->message, array()
          )->addViolation();
        }
    }

}