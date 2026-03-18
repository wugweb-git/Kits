import React from 'react';
import { User, BedDouble, Wind, Tv, Wifi, Bath, Users } from 'lucide-react';
import { Button } from '../wugweb/Button';
import { Badge } from '../wugweb/Badge';

interface RoomCardProps {
  title: string;
  description: string;
  price: number;
  currency?: string;
  capacity: number;
  bedType: string;
  size: number; // in sq meters or ft
  image: string;
  amenities: {
    icon: React.ReactNode;
    label: string;
  }[];
  status?: 'available' | 'booked' | 'maintenance';
  onBook?: () => void;
  onViewDetails?: () => void;
}

export function RoomCard({
  title,
  description,
  price,
  currency = '$',
  capacity,
  bedType,
  size,
  image,
  amenities,
  status = 'available',
  onBook,
  onViewDetails
}: RoomCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        transition: 'all var(--motion-duration-short) var(--motion-easing-standard)',
        boxShadow: 'var(--core-shadow-xs)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = 'var(--core-shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'var(--core-shadow-xs)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Image Header */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          width: '100%',
          background: 'var(--muted)',
          overflow: 'hidden'
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Status Badge */}
        <div style={{ position: 'absolute', top: 'var(--spacing-4)', right: 'var(--spacing-4)' }}>
          <Badge
            variant={status === 'available' ? 'success' : status === 'booked' ? 'destructive' : 'warning'}
            style={{ fontWeight: 600 }}
          >
            {status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--ts-h3-size)',
              fontWeight: 'var(--ts-h3-weight)',
              lineHeight: 'var(--ts-h3-line-height)',
              color: 'var(--foreground)',
              margin: 0,
              marginBottom: 'var(--spacing-1)'
            }}>
              {title}
            </h3>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              alignItems: 'center',
              color: 'var(--muted-foreground)',
              fontSize: 'var(--ts-body-sm-size)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <Users size={16} />
                {capacity} Guests
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <BedDouble size={16} />
                {bedType}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <Wind size={16} />
                {size} m²
              </span>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--core-font-family-base)',
              fontSize: 'var(--ts-h3-size)',
              fontWeight: 'var(--ts-h3-weight)',
              color: 'var(--foreground)'
            }}>
              {currency}{price}
            </div>
            <div style={{
              fontSize: 'var(--ts-caption-size)',
              color: 'var(--muted-foreground)'
            }}>
              / night
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--core-font-family-base)',
          fontSize: 'var(--ts-body-md-size)',
          color: 'var(--muted-foreground)',
          lineHeight: 1.5,
          marginTop: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-6)',
          flex: 1
        }}>
          {description}
        </p>

        {/* Amenities */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--border)'
        }}>
          {amenities.map((amenity, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                background: 'var(--muted)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--ts-caption-size)',
                color: 'var(--foreground)',
                fontWeight: 500
              }}
            >
              {React.cloneElement(amenity.icon as React.ReactElement, { size: 14 })}
              {amenity.label}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button
            variant="outline"
            style={{ flex: 1 }}
            onClick={onViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            style={{ flex: 1 }}
            onClick={onBook}
            disabled={status !== 'available'}
          >
            {status === 'available' ? 'Book Now' : 'Unavailable'}
          </Button>
        </div>
      </div>
    </div>
  );
}
