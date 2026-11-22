<?php

namespace Wugweb\Kits\Contracts;

/**
 * Contract for declaring and governing external HTTP services per WordPress.org guidelines.
 */
interface ServiceRegistryInterface
{
    /** Register an authorized external service with destination host, purpose, and privacy disclosure. */
    public function registerService(string $serviceId, array $metadata): void;

    /** Check if a service is registered. */
    public function hasService(string $serviceId): bool;

    /** Retrieve service metadata. */
    public function getService(string $serviceId): ?array;

    /** Get all registered services. */
    public function all(): array;
}
