<?php

namespace Wugweb\Kits\Services;

use Wugweb\Kits\Contracts\ServiceRegistryInterface;

/**
 * Registry enforcing centralized external service declarations per WordPress.org review requirements.
 */
class ExternalServiceRegistry implements ServiceRegistryInterface
{
    protected array $services = [];

    /**
     * {@inheritDoc}
     */
    public function registerService(string $serviceId, array $metadata): void
    {
        $this->services[$serviceId] = array_merge([
            'name' => $serviceId,
            'host' => '',
            'purpose' => '',
            'privacy_url' => '',
            'terms_url' => '',
            'is_default' => false,
            'requires_auth' => true,
        ], $metadata);
    }

    /**
     * {@inheritDoc}
     */
    public function hasService(string $serviceId): bool
    {
        return isset($this->services[$serviceId]);
    }

    /**
     * {@inheritDoc}
     */
    public function getService(string $serviceId): ?array
    {
        return $this->services[$serviceId] ?? null;
    }

    /**
     * {@inheritDoc}
     */
    public function all(): array
    {
        return $this->services;
    }

    /**
     * Generate standard WordPress.org readme.txt '== External services ==' markdown section.
     */
    public function toReadmeMarkdown(): string
    {
        if (empty($this->services)) {
            return '';
        }

        $lines = ["== External services ==", ""];
        foreach ($this->services as $id => $s) {
            $lines[] = "This plugin connects to external service: " . ($s['name'] ?: $id);
            if ($s['host']) {
                $lines[] = "* Endpoint: " . $s['host'];
            }
            if ($s['purpose']) {
                $lines[] = "* Purpose: " . $s['purpose'];
            }
            if ($s['privacy_url']) {
                $lines[] = "* Privacy policy: " . $s['privacy_url'];
            }
            if ($s['terms_url']) {
                $lines[] = "* Terms of service: " . $s['terms_url'];
            }
            $lines[] = "";
        }

        return implode("\n", $lines);
    }
}
