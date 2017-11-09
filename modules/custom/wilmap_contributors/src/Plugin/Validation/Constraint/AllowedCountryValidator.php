<?php

namespace Drupal\wilmap_contributors\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use \Drupal\node\Entity\Node;

/**
 * Validates the AllowedCountry constraint.
 */
class AllowedCountryValidator extends ConstraintValidator
{

    /**
     * {@inheritdoc}
     */
    public function validate($value, Constraint $constraint)
    {
        /** @var \Drupal\Core\Field\FieldItemListInterface $value */
        /** @var AllowedCountry $constraint */

        // No countries selection is allowed
        if (!isset($value)) {
            return;
        }

        // No countries selection is allowed
        $entity = $value->getEntity();
        if (!isset($entity)) {
            return;
        }

        $account = \Drupal::currentUser();

        // Admins may select any Country
        //if( in_array( 'administrator', $account->getRoles() )){}

        // Bypass users with 'bypass contributors access' permission
        if($account->hasPermission('bypass contributors access')){
            return;
        }

        // Only Countries in which user is Contributor are allowed
        foreach ($value as $delta => $item) {
            $target_id = $item->target_id;

            // '0' or NULL are considered valid empty references.
            if (empty($target_id)) {
                continue;
            }

            /* @var \Drupal\Core\Entity\FieldableEntityInterface $referenced_entity */
            $referenced_entity = $item->entity;

            // if ($entity->id() === $referenced_entity->id() && $entity->getEntityTypeId() === $referenced_entity->getEntityTypeId()) {
            if (!$this->isContributor($item->getValue(), $account)) {

                $country = Node::load($referenced_entity->id());

                $this->context->buildViolation($constraint->message,
                  ['%country' => $country->label()])
                  ->setParameter('%type', $referenced_entity->getEntityTypeId())
                  ->setParameter('%id', $referenced_entity->id())
                  ->setInvalidValue($referenced_entity)
                  ->atPath((string)$delta . '.target_id')
                  ->addViolation();
            }
        }
    }


    /**
     * @param $country
     * @param $account \Drupal\Core\Session\AccountProxyInterface user
     *
     * @return bool
     */
    private function isContributor($country, $account)
    {

        // Administrators are always contributors
        if (in_array('administrator', $account->getRoles())) {
            return true;
        }

        // Loads user entity
        $account = \Drupal::entityTypeManager()
          ->getStorage('user')
          ->load($account->id());

        // Countries in which user is contributor
        $user_countries = $account->get('field_country')->getValue();

        // Check if user is contributor of country (user->field_country)
        foreach ($user_countries as $user_country) {
            if ($user_country == $country) {
                return true;
            }
        }
        return false;
    }

}