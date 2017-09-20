<?php

namespace Drupal\wilmap_widget\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RemoveXFrameOptionsSubscriber implements EventSubscriberInterface {

    public function RemoveXFrameOptions(FilterResponseEvent $event) {
        $response = $event->getResponse();
        $response->headers->remove('X-Frame-Options');
        // Set the header, use FALSE to not replace it if it's set already.
        // TODO: set final site
        $response->headers->set('Content-Security-Policy', "frame-ancestors 'self' pantheonsite.io *.pantheonsite.io", FALSE);
    }

    public static function getSubscribedEvents() {
        $events[KernelEvents::RESPONSE][] = array('RemoveXFrameOptions', -10);
        return $events;
    }
}