import React from 'react';
import svgPathsProgress from '../../imports/svg-qdytv29h8n';
import svgPathsMedallion from '../../imports/svg-u5cmz8oyto';

export interface TopicTileProps {
  title?: string;
  progress?: number;
  thumbnail?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  onClick?: () => void;
  className?: string;
}

export function TopicTile({
  title = 'A Topic Name That Is Two Lines',
  progress = 80,
  thumbnail,
  status = 'in-progress',
  onClick,
  className = '',
}: TopicTileProps) {
  // Calculate progress percentage for the circular indicator
  const progressPercentage = Math.min(100, Math.max(0, progress));
  const circumference = 2 * Math.PI * 14.93; // radius from the SVG paths
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        position: 'relative',
        width: '256px',
        height: '230px',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
        transition: 'transform var(--motion-duration-short) var(--motion-easing-standard)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Shadow wrapper for the card */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '256px',
          height: '230px',
          boxShadow: '-1px -1px 13px 0px #fafbff, 2px 2px 15px 0px rgba(166, 171, 189, 0.5)',
        }}
      >
        {/* Bottom - Background with blur and artwork */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'clip',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {/* Background Image */}
          {thumbnail && (
            <img
              alt=""
              src={thumbnail}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                borderRadius: 'var(--radius-lg)',
              }}
            />
          )}

          {/* Blur overlay */}
          <svg
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
            }}
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 256 230"
          >
            <defs>
              <filter id={`bgblur-${status}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
              </filter>
            </defs>
            <path
              d="M0 0H256V230H0V0Z"
              fill="white"
              style={{ filter: `url(#bgblur-${status})` }}
            />
          </svg>

          {/* Artwork - centered thumbnail */}
          {thumbnail && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 'calc(50% - 53px)',
                transform: 'translate(-50%, -50%)',
                width: '226px',
                height: '94px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              <img
                alt={title}
                src={thumbnail}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  borderRadius: 'var(--radius-lg)',
                }}
              />
            </div>
          )}

          {/* Progress Indicator - positioned at bottom right */}
          <div
            style={{
              position: 'absolute',
              left: '204px',
              top: '178px',
            }}
          >
            {/* Not Started - Star Medallion */}
            {status === 'not-started' && (
              <div
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  flexShrink: 0,
                }}
              >
                {/* Outer elements */}
                <div style={{ position: 'absolute', inset: '-3.57% -4.46% -4.46% -3.57%' }}>
                  <div style={{ position: 'absolute', inset: '4.53% 4.31% 3.92% 4.31%' }}>
                    <svg
                      style={{ display: 'block', width: '100%', height: '100%' }}
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 37.5168 37.5851"
                    >
                      <defs>
                        <filter
                          colorInterpolationFilters="sRGB"
                          filterUnits="userSpaceOnUse"
                          height="43.0136"
                          id="filter0_ii_medal_notstarted"
                          width="44.3025"
                          x="-4.07143"
                          y="-2.71429"
                        >
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="2.71429" dy="2.71429" />
                          <feGaussianBlur stdDeviation="3.05357" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 1 0" />
                          <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
                          <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                          <feOffset dx="-4.07143" dy="-2.71429" />
                          <feGaussianBlur stdDeviation="3.39286" />
                          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                          <feColorMatrix type="matrix" values="0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0.5 0" />
                          <feBlend in2="effect1_innerShadow" mode="normal" result="effect2_innerShadow" />
                        </filter>
                      </defs>
                      <g filter="url(#filter0_ii_medal_notstarted)">
                        <path d={svgPathsMedallion.p1e0aef00} fill="#D9DBDD" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Check mark elements */}
                <div style={{ position: 'absolute', inset: '34.11% 28.73% 33.38% 29.65%' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '47.06% 51.33% 33.53% 29.65%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        height: '2.639px',
                        width: '7.687px',
                        transform: 'rotate(45.599deg) skewX(1.198deg)',
                      }}
                    >
                      <div style={{ background: '#ECEDEE', borderRadius: '2.838px', width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '34.11% 28.73% 33.38% 39.42%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        height: '2.639px',
                        width: '14.654px',
                        transform: 'rotate(134.401deg) skewX(358.802deg)',
                      }}
                    >
                      <div style={{ background: '#ECEDEE', borderRadius: '2.838px', width: '100%', height: '100%' }} />
                    </div>
                  </div>
                </div>

                {/* Center circle */}
                <div style={{ position: 'absolute', inset: '14.34% 13.79% 13.47% 14.78%' }}>
                  <svg
                    style={{ display: 'block', width: '100%', height: '100%' }}
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 27.1429 27.4321"
                  >
                    <path d={svgPathsMedallion.p39e5bf00} fill="#ECEDEE" />
                  </svg>
                </div>
              </div>
            )}

            {/* In Progress - Circular Progress Wheel */}
            {status === 'in-progress' && (
              <div
                style={{
                  width: '35.286px',
                  height: '35.286px',
                }}
              >
                <svg
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 35.2857 35.2857"
                >
                  <g id="library-topic-progress">
                    <g id="Non-Cert Progress">
                      {/* Background circle */}
                      <g id="Wheel">
                        <path
                          d={svgPathsProgress.p374d3500}
                          fill="black"
                          fillOpacity="0.5"
                        />
                      </g>
                      {/* Checkmark */}
                      <path
                        d={svgPathsProgress.p1ed008f0}
                        fill="black"
                        fillOpacity="0.7"
                      />
                    </g>
                    {/* Progress arc */}
                    <path
                      d={svgPathsProgress.p22be1f80}
                      fill="black"
                      fillOpacity="0.7"
                    />
                  </g>
                </svg>
              </div>
            )}

            {/* Completed - Checkmark in Circle */}
            {status === 'completed' && (
              <div
                style={{
                  width: '35.286px',
                  height: '35.286px',
                }}
              >
                <svg
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 35.2857 35.2857"
                >
                  <g id="library-topic-progress">
                    <g id="Non-Cert Progress">
                      {/* Background circle */}
                      <g id="Wheel">
                        <path
                          d={svgPathsProgress.p374d3500}
                          fill="var(--success)"
                          fillOpacity="0.8"
                        />
                      </g>
                      {/* Checkmark */}
                      <path
                        d={svgPathsProgress.p1ed008f0}
                        fill="var(--success)"
                        fillOpacity="1"
                      />
                    </g>
                    {/* Full circle for completed */}
                    <path
                      d={svgPathsProgress.p22be1f80}
                      fill="var(--success)"
                      fillOpacity="1"
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Text - positioned below the card */}
        <div
          style={{
            position: 'absolute',
            bottom: '23.48%',
            left: '16px',
            top: '52.17%',
          }}
        >
          <p
            style={{
              position: 'absolute',
              bottom: '110px',
              left: '16px',
              width: '215px',
              transform: 'translateY(100%)',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: '28px',
              color: '#bababa',
              margin: 0,
            }}
          >
            {title}
          </p>
        </div>

        {/* Progress */}
        <div
          style={{
            position: 'absolute',
            inset: '86.09% 41.88% 6.91% 6.25%',
          }}
        >
          <p
            style={{
              position: 'absolute',
              inset: '86.09% 41.88% 6.91% 6.25%',
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: '21px',
              opacity: 0.7,
              color: '#7d7d7d',
              margin: 0,
            }}
          >
            {status === 'not-started' ? 'Not Started' : status === 'completed' ? 'Completed' : `${progress}% Complete`}
          </p>
        </div>
      </div>
    </div>
  );
}
