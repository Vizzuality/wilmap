<?php

namespace Drupal\wilmap_widget\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RemoveXFrameOptionsSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        $events[KernelEvents::RESPONSE][] = array('RemoveXFrameOptions', -10);
        return $events;
    }

    public function RemoveXFrameOptions(FilterResponseEvent $event)
    {

        $current_path = \Drupal::service('path.current')->getPath();
        $pathargs = explode('/', $current_path);

        // Only allows iframes in  paths like /widgets/*
        if ($pathargs[1] == 'widgets') {
            $response = $event->getResponse();
            $response->headers->remove('X-Frame-Options');
        }
    }
}