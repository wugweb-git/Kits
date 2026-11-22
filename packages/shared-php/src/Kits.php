<?php

namespace Wugweb\Kits;

use Wugweb\Kits\Tokens\TokenEngine;
use Wugweb\Kits\Services\ExternalServiceRegistry;

/**
 * Unified Facade for the Wugweb Kits PHP SDK.
 */
class Kits
{
    protected static ?TokenEngine $tokenEngine = null;
    protected static ?ExternalServiceRegistry $serviceRegistry = null;

    /**
     * Access or initialize the design token engine.
     */
    public static function tokens(?array $tokenTree = null): TokenEngine
    {
        if (null !== $tokenTree || null === self::$tokenEngine) {
            self::$tokenEngine = new TokenEngine($tokenTree ?? []);
        }
        return self::$tokenEngine;
    }

    /**
     * Access or initialize the external services registry.
     */
    public static function services(): ExternalServiceRegistry
    {
        if (null === self::$serviceRegistry) {
            self::$serviceRegistry = new ExternalServiceRegistry();
        }
        return self::$serviceRegistry;
    }
}
