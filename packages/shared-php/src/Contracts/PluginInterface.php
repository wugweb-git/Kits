<?php

namespace Wugweb\Kits\Contracts;

/**
 * Standard contract for Kits companion plugins.
 */
interface PluginInterface
{
    /** Get the unique plugin slug identifier. */
    public function getSlug(): string;

    /** Get the semver plugin version. */
    public function getVersion(): string;

    /** Get the plugin i18n text domain. */
    public function getTextDomain(): string;

    /** Check if a feature flag is enabled. */
    public function isFeatureEnabled(string $feature): bool;
}
