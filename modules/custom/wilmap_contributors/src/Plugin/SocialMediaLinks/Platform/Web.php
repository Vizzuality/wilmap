<?php

namespace Drupal\wilmap_contributors\Plugin\SocialMediaLinks\Platform;

use Drupal\social_media_links\PlatformBase;
use Drupal\Core\Form\FormStateInterface;
# use core/lib/Drupal/Component/Utility/
use Drupal\Core\Url;
use Drupal\Component\Utility\UrlHelper;

/**
 * Provides 'web' platform.
 *
 * @Platform(
 *   id = "web",
 *   name = @Translation("Web")
 * )
 */
class Web extends PlatformBase
{

    /**
     * {@inheritdoc}
     */
    public function getUrl()
    {
        return Url::fromUri($this->getValue());
    }

    /**
     * {@inheritdoc}
     */
    public static function validateValue(
      array &$element,
      FormStateInterface $form_state,
      array $form
    ) {
        if (!empty($element['#value'])) {
            if (!UrlHelper::isValid($element['#value'], true)) {
                $form_state->setError($element,
                  t('The entered web URL is not valid.'));
            }
        }
    }

}
