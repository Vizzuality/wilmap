<?php

namespace Drupal\wilmap_contributors\Plugin\SocialMediaLinks\Platform;

use Drupal\social_media_links\PlatformBase;
use Drupal\Core\Form\FormStateInterface;
use Egulias\EmailValidator\EmailValidator;
use Drupal\Core\Url;

/**
 * Provides 'web' platform.
 *
 * @Platform(
 *   id = "web",
 *   name = @Translation("Web"),
 * )
 */
class Web extends PlatformBase {

  /**
   * {@inheritdoc}
   */
  public function getUrl() {
    return Url::fromUri('http:' . $this->getValue());
  }

  /**
   * {@inheritdoc}
   */
  public static function validateValue(array &$element, FormStateInterface $form_state, array $form) {
    if (!empty($element['#value'])) {
      $validator = new EmailValidator();

      if (!$validator->isValid($element['#value'], TRUE)) {
        $form_state->setError($element, t('The entered web URL is not valid.'));
      }
    }
  }

}
