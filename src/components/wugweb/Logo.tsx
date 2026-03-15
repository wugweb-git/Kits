import React from 'react';
import iconSvgPaths from '../../imports/svg-i7jxm7o75s';
import wugwebTextSvgPaths from '../../imports/svg-3tiezsjehd';
import staywebTextSvgPaths from '../../imports/svg-hqs7zeposl';
import docwebTextSvgPaths from '../../imports/svg-4ll91acn52';
import kitsLogoSvgPaths from '../../imports/svg-hi7ekuzmhv';

export type LogoBrand = 'wugweb' | 'stayweb' | 'nookweb' | 'docweb' | 'kits';
export type LogoState = 'full' | 'icon';
export type LogoSize = 's' | 'm' | 'l';
export type LogoTheme = 'dark' | 'light';
export type LogoContainer = 'yes' | 'no';

interface LogoProps {
  brand?: LogoBrand;
  state?: LogoState;
  size?: LogoSize;
  theme?: LogoTheme;
  container?: LogoContainer;
  className?: string;
  style?: React.CSSProperties;
}

const brandConfig = {
  wugweb: { text: 'wugweb', accentColor: '#FFBE1A' },
  stayweb: { text: 'stayweb', accentColor: '#3B82F6' },
  nookweb: { text: 'nookweb', accentColor: '#10B981' },
  docweb: { text: 'docweb', accentColor: '#8B5CF6' },
  kits: { text: 'kits', accentColor: '#F59E0B' },
};

const sizeConfig = {
  s: {
    icon: { width: 24, height: 18, padding: 8 },
    full: { height: 20, padding: 12 },
  },
  m: {
    icon: { width: 32, height: 24, padding: 12 },
    full: { height: 28, padding: 16 },
  },
  l: {
    icon: { width: 40, height: 30, padding: 16 },
    full: { height: 38, padding: 20 },
  },
};

export function Logo({
  brand = 'wugweb',
  state = 'full',
  size = 'm',
  theme = 'dark',
  container = 'no',
  className = '',
  style = {},
}: LogoProps) {
  const config = brandConfig[brand];
  const sizing = sizeConfig[size];
  const isIcon = state === 'icon';
  
  // Safety check - ensure sizing exists
  if (!sizing) {
    console.error(`Invalid size "${size}" for Logo component`);
    return null;
  }
  
  // Theme colors for text only
  const textColor = theme === 'dark' ? 'var(--foreground, #FFFFFF)' : 'var(--surface-950, #0A0A0A)';

  // Container styles (only for when container='yes')
  // Icon always has dark background, full logo respects theme
  const containerStyles: React.CSSProperties = container === 'yes' 
    ? {
        backgroundColor: isIcon ? '#0A0A0A' : (theme === 'dark' ? 'var(--surface-950, #0A0A0A)' : 'var(--surface-50, #FAFAFA)'),
        border: isIcon ? '1px solid #2B2B2B' : `1px solid ${theme === 'dark' ? 'var(--border, #2B2B2B)' : 'var(--border-light, #E5E5E5)'}`,
        borderRadius: 'var(--radius-2, 8px)',
        padding: `${sizing[isIcon ? 'icon' : 'full'].padding}px`,
      }
    : {};

  // Icon-only rendering - ALWAYS white + yellow (#FFBE1A)
  if (isIcon) {
    const iconSize = sizing.icon;
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...containerStyles,
          ...style,
        }}
        role="img"
        aria-label={`${config.text} logo`}
      >
        <svg
          width={iconSize.width}
          height={iconSize.height}
          viewBox="0 0 40 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <g>
            {/* Always white for the main W shape */}
            <path d={iconSvgPaths.p35c7bb40} fill="#FFFFFF" />
            <path d={iconSvgPaths.p32a31380} fill="#FFFFFF" />
            {/* ALWAYS yellow (#FFBE1A) for the dots - never brand color */}
            <path d={iconSvgPaths.p7f9bb00} fill="#FFBE1A" />
            <path d={iconSvgPaths.p2661f200} fill="#FFBE1A" />
          </g>
        </svg>
      </div>
    );
  }

  // Full logo rendering
  const fullHeight = sizing.full.height;
  const iconWidth = (fullHeight / 30) * 40; // Maintain aspect ratio
  const gap = fullHeight * 0.3;

  // Render text based on brand
  const renderBrandText = () => {
    if (brand === 'wugweb') {
      return (
        <svg
          height={fullHeight}
          viewBox="0 0 150 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            display: 'block', 
            height: `${fullHeight}px`,
            width: 'auto',
          }}
        >
          <g>
            {/* "wug" in bold */}
            <path d={wugwebTextSvgPaths.p1e6cc7c0} fill={textColor} />
            <path d={wugwebTextSvgPaths.p180576e0} fill={textColor} />
            <path d={wugwebTextSvgPaths.p2bef0e80} fill={textColor} />
            
            {/* "web" in light/regular */}
            <path d={wugwebTextSvgPaths.p1d431c80} fill={textColor} fillOpacity="0.5" />
            <path d={wugwebTextSvgPaths.p3b2b1100} fill={textColor} fillOpacity="0.5" />
            <path d={wugwebTextSvgPaths.p3249e000} fill={textColor} fillOpacity="0.5" />
          </g>
        </svg>
      );
    }
    
    if (brand === 'stayweb') {
      return (
        <svg
          height={fullHeight}
          viewBox="0 0 95.44 22.36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            display: 'block', 
            height: `${fullHeight}px`,
            width: 'auto',
          }}
        >
          <g>
            {/* "stay" in bold */}
            <path d={staywebTextSvgPaths.p3e28fe00} fill={textColor} />
            <path d={staywebTextSvgPaths.p2b764270} fill={textColor} />
            <path d={staywebTextSvgPaths.p1876f380} fill={textColor} />
            <path d={staywebTextSvgPaths.p3ea3b400} fill={textColor} />
            
            {/* "web" in light/regular */}
            <path d={staywebTextSvgPaths.p35bc2300} fill={textColor} fillOpacity="0.5" />
            <path d={staywebTextSvgPaths.p34725e00} fill={textColor} fillOpacity="0.5" />
            <path d={staywebTextSvgPaths.p1ef58a00} fill={textColor} fillOpacity="0.5" />
          </g>
        </svg>
      );
    }
    
    if (brand === 'docweb') {
      return (
        <svg
          height={fullHeight}
          viewBox="0 0 95.52 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            display: 'block', 
            height: `${fullHeight}px`,
            width: 'auto',
          }}
        >
          <g>
            {/* "doc" in bold */}
            <path d={docwebTextSvgPaths.pa381300} fill={textColor} />
            <path d={docwebTextSvgPaths.p3e64ce80} fill={textColor} />
            <path d={docwebTextSvgPaths.pe09f570} fill={textColor} />
            
            {/* "web" in light/regular */}
            <path d={docwebTextSvgPaths.p2a09ad00} fill={textColor} fillOpacity="0.5" />
            <path d={docwebTextSvgPaths.p3e25b500} fill={textColor} fillOpacity="0.5" />
            <path d={docwebTextSvgPaths.p166181f0} fill={textColor} fillOpacity="0.5" />
          </g>
        </svg>
      );
    }

    // Fallback for nookweb and kits with text
    if (brand === 'kits') {
      // Use the actual imported kits logo from Figma
      const kitsHeight = fullHeight * 1.5; // Scale appropriately
      const kitsWidth = (kitsHeight / 557.451) * 1100.07; // Maintain aspect ratio from viewBox
      
      return (
        <svg
          height={kitsHeight}
          width={kitsWidth}
          viewBox="0 0 1100.07 557.451"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            display: 'block', 
            height: `${kitsHeight}px`,
            width: `${kitsWidth}px`,
          }}
        >
          <g>
            {/* White text paths */}
            <path d={kitsLogoSvgPaths.p37799800} fill="white" />
            <path d={kitsLogoSvgPaths.p3842fe00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2ad57580} fill="white" />
            <path d={kitsLogoSvgPaths.p3ce0c280} fill="white" />
            <path d={kitsLogoSvgPaths.p5adc600} fill="white" />
            <path d={kitsLogoSvgPaths.pb7757f0} fill="white" />
            <path d={kitsLogoSvgPaths.p2fe2bc00} fill="white" />
            <path d={kitsLogoSvgPaths.p24ee8fc0} fill="white" />
            <path d={kitsLogoSvgPaths.p16dd600} fill="white" />
            <path d={kitsLogoSvgPaths.p355f1e80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2f0ade00} fill="white" />
            <path d={kitsLogoSvgPaths.p39959050} fill="white" />
            <path d={kitsLogoSvgPaths.p2174b570} fill="white" />
            <path d={kitsLogoSvgPaths.pd30f380} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p38847200} fill="white" />
            <path d={kitsLogoSvgPaths.p2e5b7540} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2496e600} fill="white" />
            <path d={kitsLogoSvgPaths.p378caa80} fill="white" />
            <path d={kitsLogoSvgPaths.p20695080} fill="white" />
            <path d={kitsLogoSvgPaths.p229ba380} fill="white" />
            <path d={kitsLogoSvgPaths.p3f55f280} fill="white" />
            <path d={kitsLogoSvgPaths.pfb86900} fill="white" />
            <path d={kitsLogoSvgPaths.p3df3e100} fill="white" />
            <path d={kitsLogoSvgPaths.p1b74bb00} fill="white" />
            <path d={kitsLogoSvgPaths.pc95880} fill="white" />
            <path d={kitsLogoSvgPaths.p29c83440} fill="white" />
            <path d={kitsLogoSvgPaths.pab51f00} fill="white" />
            <path d={kitsLogoSvgPaths.p22a07b00} fill="white" />
            <path d={kitsLogoSvgPaths.p36498d00} fill="white" />
            <path d={kitsLogoSvgPaths.p29eb7e00} fill="white" />
            <path d={kitsLogoSvgPaths.p24a42600} fill="white" />
            <path d={kitsLogoSvgPaths.p9eb1440} fill="white" />
            <path d={kitsLogoSvgPaths.p1405f400} fill="white" />
            <path d={kitsLogoSvgPaths.p3baae100} fill="white" />
            <path d={kitsLogoSvgPaths.p17a8b880} fill="white" />
            <path d={kitsLogoSvgPaths.pba5a800} fill="white" />
            <path d={kitsLogoSvgPaths.p319a700} fill="white" />
            <path d={kitsLogoSvgPaths.p20cb4380} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p292e5c0} fill="white" />
            <path d={kitsLogoSvgPaths.p11010800} fill="white" />
            <path d={kitsLogoSvgPaths.p30241280} fill="white" />
            <path d={kitsLogoSvgPaths.p14959480} fill="white" />
            <path d={kitsLogoSvgPaths.p1396d100} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p1114c900} fill="white" />
            <path d={kitsLogoSvgPaths.p1702b200} fill="white" />
            <path d={kitsLogoSvgPaths.p311ba500} fill="white" />
            <path d={kitsLogoSvgPaths.p1eca0980} fill="white" />
            <path d={kitsLogoSvgPaths.p29f41800} fill="white" />
            <path d={kitsLogoSvgPaths.pdf48680} fill="white" />
            <path d={kitsLogoSvgPaths.p12c76480} fill="white" />
            <path d={kitsLogoSvgPaths.p2964d932} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p26273b00} fill="white" />
            <path d={kitsLogoSvgPaths.p2b962700} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1621bb80} fill="white" />
            <path d={kitsLogoSvgPaths.p25ec0f00} fill="white" />
            <path d={kitsLogoSvgPaths.p7443300} fill="white" />
            <path d={kitsLogoSvgPaths.p36052480} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1eff6800} fill="white" />
            <path d={kitsLogoSvgPaths.p3ba63680} fill="white" />
            <path d={kitsLogoSvgPaths.p1df11c00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3fbd0b00} fill="white" />
            <path d={kitsLogoSvgPaths.p112aff00} fill="white" />
            <path d={kitsLogoSvgPaths.pf6e7d00} fill="white" />
            <path d={kitsLogoSvgPaths.p3229ee70} fill="white" />
            <path d={kitsLogoSvgPaths.p5e12000} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p14bda170} fill="white" />
            <path d={kitsLogoSvgPaths.p3b0a9a00} fill="white" />
            <path d={kitsLogoSvgPaths.p396d5f00} fill="white" />
            <path d={kitsLogoSvgPaths.p1cdcd200} fill="white" />
            <path d={kitsLogoSvgPaths.p292aee00} fill="white" />
            <path d={kitsLogoSvgPaths.p2193d00} fill="white" />
            <path d={kitsLogoSvgPaths.p200f9700} fill="white" />
            <path d={kitsLogoSvgPaths.p262fd300} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p36fb1030} fill="white" />
            <path d={kitsLogoSvgPaths.p19148f00} fill="white" />
            <path d={kitsLogoSvgPaths.p37c68980} fill="white" />
            <path d={kitsLogoSvgPaths.pe3a680} fill="white" />
            <path d={kitsLogoSvgPaths.p9aa3470} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p37dee80} fill="white" />
            <path d={kitsLogoSvgPaths.p2a3fe300} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3e6a6080} fill="white" />
            <path d={kitsLogoSvgPaths.p309b4f00} fill="white" />
            <path d={kitsLogoSvgPaths.pa2c76c0} fill="white" />
            <path d={kitsLogoSvgPaths.p3a9c6d00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p877dd00} fill="white" />
            <path d={kitsLogoSvgPaths.p3f27e280} fill="white" />
            <path d={kitsLogoSvgPaths.p2a58d580} fill="white" />
            <path d={kitsLogoSvgPaths.p12cfac00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1cd29300} fill="white" />
            <path d={kitsLogoSvgPaths.p10a2e400} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p24677700} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p38f76400} fill="white" />
            <path d={kitsLogoSvgPaths.p2f196f00} fill="white" />
            <path d={kitsLogoSvgPaths.p122fb680} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1e0c6480} fill="white" />
            <path d={kitsLogoSvgPaths.p2896f900} fill="white" />
            <path d={kitsLogoSvgPaths.p31fa580} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1994cd80} fill="white" />
            <path d={kitsLogoSvgPaths.p2af4a840} fill="white" />
            <path d={kitsLogoSvgPaths.p2d0590c0} fill="white" />
            <path d={kitsLogoSvgPaths.p3d594600} fill="white" />
            <path d={kitsLogoSvgPaths.pa59a900} fill="white" />
            <path d={kitsLogoSvgPaths.p2b0de00} fill="white" />
            <path d={kitsLogoSvgPaths.p31392500} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p377c8880} fill="white" />
            <path d={kitsLogoSvgPaths.p2716e2f1} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p7824600} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p26b11b00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p2de89200} fill="white" />
            <path d={kitsLogoSvgPaths.p3bd10500} fill="white" />
            <path d={kitsLogoSvgPaths.p3cc31700} fill="white" />
            <path d={kitsLogoSvgPaths.p2e859100} fill="white" />
            <path d={kitsLogoSvgPaths.p28239380} fill="white" />
            <path d={kitsLogoSvgPaths.p2c258f00} fill="white" />
            <path d={kitsLogoSvgPaths.p2193ac80} fill="white" />
            <path d={kitsLogoSvgPaths.p1c66c380} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2b802370} fill="white" />
            <path d={kitsLogoSvgPaths.pc41ce70} fill="white" />
            <path d={kitsLogoSvgPaths.p27d83b00} fill="white" />
            <path d={kitsLogoSvgPaths.p375faa80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p1314b00} fill="white" />
            <path d={kitsLogoSvgPaths.p1dd0800} fill="white" />
            <path d={kitsLogoSvgPaths.p263a1e70} fill="white" />
            <path d={kitsLogoSvgPaths.p1ac68b40} fill="white" />
            <path d={kitsLogoSvgPaths.p24ba9840} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3bdff080} fill="white" />
            <path d={kitsLogoSvgPaths.p4aa2400} fill="white" />
            <path d={kitsLogoSvgPaths.p20875b00} fill="white" />
            <path d={kitsLogoSvgPaths.p3a2cad70} fill="white" />
            <path d={kitsLogoSvgPaths.p22740700} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p35b0fd00} fill="white" />
            <path d={kitsLogoSvgPaths.p137f1800} fill="white" />
            <path d={kitsLogoSvgPaths.p2dc16240} fill="white" />
            <path d={kitsLogoSvgPaths.p50ddf40} fill="white" />
            <path d={kitsLogoSvgPaths.p25205700} fill="white" />
            <path d={kitsLogoSvgPaths.p72ee000} fill="white" />
            <path d={kitsLogoSvgPaths.pc0db700} fill="white" />
            <path d={kitsLogoSvgPaths.p1ac6c700} fill="white" />
            <path d={kitsLogoSvgPaths.p2bf09c80} fill="white" />
            <path d={kitsLogoSvgPaths.p30587f0} fill="white" />
            <path d={kitsLogoSvgPaths.p37a71e00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p355f2e80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2565c780} fill="white" />
            <path d={kitsLogoSvgPaths.p33390400} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.pa705100} fill="white" />
            <path d={kitsLogoSvgPaths.p1557b600} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p2d955ac0} fill="white" />
            <path d={kitsLogoSvgPaths.p37233500} fill="white" />
            <path d={kitsLogoSvgPaths.p1ec78ff0} fill="white" />
            <path d={kitsLogoSvgPaths.p24a31b00} fill="white" />
            <path d={kitsLogoSvgPaths.p2a2452f0} fill="white" />
            <path d={kitsLogoSvgPaths.p6c27280} fill="white" />
            <path d={kitsLogoSvgPaths.p1640300} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1631a500} fill="white" />
            <path d={kitsLogoSvgPaths.p1860680} fill="white" />
            <path d={kitsLogoSvgPaths.p35e02b70} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p39ce1280} fill="white" />
            <path d={kitsLogoSvgPaths.p8dfe400} fill="white" />
            <path d={kitsLogoSvgPaths.p2cd1e500} fill="white" />
            <path d={kitsLogoSvgPaths.p12ea7700} fill="white" />
            <path d={kitsLogoSvgPaths.p2ef06ac0} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p29098700} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3dfc7d00} fill="white" />
            <path d={kitsLogoSvgPaths.p30226600} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3f611500} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p4b14200} fill="white" />
            <path d={kitsLogoSvgPaths.p2812ea00} fill="white" />
            <path d={kitsLogoSvgPaths.p2c1b4700} fill="white" />
            <path d={kitsLogoSvgPaths.p2bb8d680} fill="white" />
            <path d={kitsLogoSvgPaths.p240e0480} fill="white" />
            <path d={kitsLogoSvgPaths.pa0bfe70} fill="white" />
            <path d={kitsLogoSvgPaths.p2bebcc80} fill="white" />
            <path d={kitsLogoSvgPaths.p2427f572} fill="white" />
            <path d={kitsLogoSvgPaths.pbf9c280} fill="white" />
            <path d={kitsLogoSvgPaths.p2469cf80} fill="white" />
            <path d={kitsLogoSvgPaths.p1331b600} fill="white" />
            <path d={kitsLogoSvgPaths.pbd36800} fill="white" />
            <path d={kitsLogoSvgPaths.p7969800} fill="white" />
            <path d={kitsLogoSvgPaths.p7a96080} fill="white" />
            <path d={kitsLogoSvgPaths.p303ebf0} fill="white" />
            <path d={kitsLogoSvgPaths.p67bef00} fill="white" />
            <path d={kitsLogoSvgPaths.p1f4b6f80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p191e3900} fill="white" />
            <path d={kitsLogoSvgPaths.p1712f300} fill="white" />
            <path d={kitsLogoSvgPaths.p23e01000} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p275bfd00} fill="white" />
            <path d={kitsLogoSvgPaths.p18be7f00} fill="white" />
            <path d={kitsLogoSvgPaths.p5142180} fill="white" />
            <path d={kitsLogoSvgPaths.p3c01c800} fill="white" />
            <path d={kitsLogoSvgPaths.pbfb6400} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p47b8400} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3c1c9800} fill="white" />
            <path d={kitsLogoSvgPaths.p2fab3b00} fill="white" />
            <path d={kitsLogoSvgPaths.p25d6ad80} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p11051000} fill="white" />
            <path d={kitsLogoSvgPaths.pa44e800} fill="white" />
            <path d={kitsLogoSvgPaths.pb43fa00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.paf93280} fill="white" />
            <path d={kitsLogoSvgPaths.p264f5600} fill="white" />
            <path d={kitsLogoSvgPaths.p18207900} fill="white" />
            <path d={kitsLogoSvgPaths.p2456c400} fill="white" />
            <path d={kitsLogoSvgPaths.pcd35e80} fill="white" />
            <path d={kitsLogoSvgPaths.p21866700} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p25324c00} fill="white" />
            <path d={kitsLogoSvgPaths.p2cb85480} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.pa344900} fill="white" />
            <path d={kitsLogoSvgPaths.p33f7d200} fill="white" />
            <path d={kitsLogoSvgPaths.p912e100} fill="white" />
            <path d={kitsLogoSvgPaths.p7cfdc80} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p14fc4700} fill="white" />
            <path d={kitsLogoSvgPaths.p40def00} fill="white" />
            <path d={kitsLogoSvgPaths.p27ae4900} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p31645d00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.pef43c00} fill="white" />
            <path d={kitsLogoSvgPaths.p1bce0100} fill="white" />
            <path d={kitsLogoSvgPaths.p11e94b80} fill="white" />
            <path d={kitsLogoSvgPaths.p19246f00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p59a2ca0} fill="white" />
            <path d={kitsLogoSvgPaths.pa22f900} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.pdcc2080} fill="white" />
            <path d={kitsLogoSvgPaths.pf1d7f00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p36136700} fill="white" />
            <path d={kitsLogoSvgPaths.p32598400} fill="white" />
            <path d={kitsLogoSvgPaths.p12ec5b00} fill="white" />
            <path d={kitsLogoSvgPaths.p21ea41f2} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1f254900} fill="white" />
            <path d={kitsLogoSvgPaths.p2bc4f200} fill="white" />
            <path d={kitsLogoSvgPaths.p311f6600} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p39f89000} fill="white" />
            <path d={kitsLogoSvgPaths.p3b64e600} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3ad34f00} fill="white" />
            <path d={kitsLogoSvgPaths.p26ef7740} fill="white" />
            <path d={kitsLogoSvgPaths.p4d61cf0} fill="white" />
            <path d={kitsLogoSvgPaths.p3c6e2e80} fill="white" />
            <path d={kitsLogoSvgPaths.p1312080} fill="white" />
            <path d={kitsLogoSvgPaths.p131af5f0} fill="white" />
            <path d={kitsLogoSvgPaths.p3e59d500} fill="white" />
            <path d={kitsLogoSvgPaths.p1f965e80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p28eb1f00} fill="white" />
            <path d={kitsLogoSvgPaths.p32206580} fill="white" />
            <path d={kitsLogoSvgPaths.p2c007900} fill="white" />
            <path d={kitsLogoSvgPaths.p1b0507f0} fill="white" />
            <path d={kitsLogoSvgPaths.p1fc5ac00} fill="white" />
            <path d={kitsLogoSvgPaths.p1663100} fill="white" />
            <path d={kitsLogoSvgPaths.p205f1d00} fill="white" />
            <path d={kitsLogoSvgPaths.p8a6cf80} fill="white" />
            <path d={kitsLogoSvgPaths.p1f04eb00} fill="white" />
            <path d={kitsLogoSvgPaths.pefc7000} fill="white" />
            <path d={kitsLogoSvgPaths.p1e65eb00} fill="white" />
            <path d={kitsLogoSvgPaths.p3e6f9a00} fill="white" />
            <path d={kitsLogoSvgPaths.p1abb8200} fill="white" />
            <path d={kitsLogoSvgPaths.p1ee98700} fill="white" />
            <path d={kitsLogoSvgPaths.p1227be40} fill="white" />
            <path d={kitsLogoSvgPaths.p3aac6480} fill="white" />
            <path d={kitsLogoSvgPaths.p25123500} fill="white" />
            <path d={kitsLogoSvgPaths.p6af3740} fill="white" />
            <path d={kitsLogoSvgPaths.p32699780} fill="white" />
            <path d={kitsLogoSvgPaths.p29994400} fill="white" />
            <path d={kitsLogoSvgPaths.p1e909b80} fill="white" />
            <path d={kitsLogoSvgPaths.p2d111c00} fill="white" />
            <path d={kitsLogoSvgPaths.p895ad00} fill="white" />
            <path d={kitsLogoSvgPaths.p8402540} fill="white" />
            <path d={kitsLogoSvgPaths.p3844d100} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p17e8cc00} fill="white" />
            <path d={kitsLogoSvgPaths.p3c5ba80} fill="white" />
            <path d={kitsLogoSvgPaths.p1a3f0d00} fill="white" />
            <path d={kitsLogoSvgPaths.p15658a80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p36002700} fill="white" />
            <path d={kitsLogoSvgPaths.p3a8d9200} fill="white" />
            <path d={kitsLogoSvgPaths.p1c96d780} fill="white" />
            <path d={kitsLogoSvgPaths.p32234b00} fill="white" />
            <path d={kitsLogoSvgPaths.p202fcf00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p33724980} fill="white" />
            <path d={kitsLogoSvgPaths.p35946300} fill="white" />
            <path d={kitsLogoSvgPaths.p4a78080} fill="white" />
            <path d={kitsLogoSvgPaths.p85ac300} fill="white" />
            <path d={kitsLogoSvgPaths.p1aac4b70} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p107dd700} fill="white" />
            <path d={kitsLogoSvgPaths.p21900f00} fill="white" />
            <path d={kitsLogoSvgPaths.p33e7f80} fill="white" />
            <path d={kitsLogoSvgPaths.p101e5e80} fill="white" />
            <path d={kitsLogoSvgPaths.p36e3ba00} fill="white" />
            <path d={kitsLogoSvgPaths.p304c7480} fill="white" />
            <path d={kitsLogoSvgPaths.p3e0995f0} fill="white" />
            <path d={kitsLogoSvgPaths.p251549f0} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p13b54140} fill="white" />
            <path d={kitsLogoSvgPaths.pcbe5600} fill="white" />
            <path d={kitsLogoSvgPaths.p8d720b0} fill="white" />
            <path d={kitsLogoSvgPaths.p6424f00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p33625928} fill="white" />
            <path d={kitsLogoSvgPaths.p3e081eb0} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3ad23380} fill="white" />
            <path d={kitsLogoSvgPaths.p39aa4800} fill="white" />
            <path d={kitsLogoSvgPaths.p1bc366f0} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p1ff4a00} fill="white" />
            <path d={kitsLogoSvgPaths.p15408100} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p188bdb80} fill="white" />
            <path d={kitsLogoSvgPaths.p2b15d180} fill="white" />
            <path d={kitsLogoSvgPaths.p2bef5590} fill="white" />
            <path d={kitsLogoSvgPaths.pc291b00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p2f550900} fill="white" />
            <path d={kitsLogoSvgPaths.pf9c9730} fill="white" />
            <path d={kitsLogoSvgPaths.p27df1400} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2fb0d600} fill="white" />
            <path d={kitsLogoSvgPaths.p1358e200} fill="white" />
            <path d={kitsLogoSvgPaths.p2715c6e0} fill="white" />
            <path d={kitsLogoSvgPaths.p113bb800} fill="white" />
            <path d={kitsLogoSvgPaths.p3138ea00} fill="white" />
            <path d={kitsLogoSvgPaths.p190a1780} fill="white" />
            <path d={kitsLogoSvgPaths.p3b0da480} fill="white" />
            <path d={kitsLogoSvgPaths.pc453280} fill="white" />
            <path d={kitsLogoSvgPaths.p163f4c00} fill="white" />
            <path d={kitsLogoSvgPaths.p2c94e400} fill="white" />
            <path d={kitsLogoSvgPaths.p1afdbb80} fill="white" />
            <path d={kitsLogoSvgPaths.pa94f3c0} fill="white" />
            <path d={kitsLogoSvgPaths.p2a1f4f00} fill="white" />
            <path d={kitsLogoSvgPaths.p2f4e5b80} fill="white" />
            <path d={kitsLogoSvgPaths.p18ad30b2} fill="white" />
            <path d={kitsLogoSvgPaths.p562180} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p15110300} fill="white" />
            <path d={kitsLogoSvgPaths.p1ad24380} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p34d2dd40} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p1e370a00} fill="white" />
            <path d={kitsLogoSvgPaths.p43ab00} fill="white" />
            <path d={kitsLogoSvgPaths.p2bbfb200} fill="white" />
            <path d={kitsLogoSvgPaths.pf097000} fill="white" />
            <path d={kitsLogoSvgPaths.p3cd29d00} fill="white" />
            <path d={kitsLogoSvgPaths.p26022900} fill="white" />
            <path d={kitsLogoSvgPaths.p12f40880} fill="white" />
            <path d={kitsLogoSvgPaths.p307aee80} fill="white" />
            <path d={kitsLogoSvgPaths.p27140e80} fill="white" />
            <path d={kitsLogoSvgPaths.p325f400} fill="white" />
            <path d={kitsLogoSvgPaths.p167bc571} fill="white" />
            <path d={kitsLogoSvgPaths.p6aba5c0} fill="white" />
            <path d={kitsLogoSvgPaths.p2ec83b80} fill="white" />
            <path d={kitsLogoSvgPaths.p36b74400} fill="white" />
            <path d={kitsLogoSvgPaths.pe629700} fill="white" />
            <path d={kitsLogoSvgPaths.p16805b00} fill="white" />
            <path d={kitsLogoSvgPaths.p16450200} fill="white" />
            <path d={kitsLogoSvgPaths.p400de00} fill="white" />
            <path d={kitsLogoSvgPaths.p3b836fc0} fill="white" />
            <path d={kitsLogoSvgPaths.p8af4f00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3adc800} fill="white" />
            <path d={kitsLogoSvgPaths.p12a84180} fill="white" />
            <path d={kitsLogoSvgPaths.p155d0500} fill="white" />
            <path d={kitsLogoSvgPaths.p36375f40} fill="white" />
            <path d={kitsLogoSvgPaths.p157c5200} fill="white" />
            <path d={kitsLogoSvgPaths.p3184c900} fill="white" />
            <path d={kitsLogoSvgPaths.p246c8780} fill="white" />
            <path d={kitsLogoSvgPaths.pe014d80} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3d0c6272} fill="white" />
            <path d={kitsLogoSvgPaths.p184b9400} fill="white" />
            <path d={kitsLogoSvgPaths.p36fcc5f0} fill="white" />
            <path d={kitsLogoSvgPaths.pd9afb00} fill="white" />
            <path d={kitsLogoSvgPaths.p216b680} fill="white" />
            <path d={kitsLogoSvgPaths.p1e22c100} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p9f2900} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p302eca80} fill="white" />
            <path d={kitsLogoSvgPaths.p2ba4f40} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p26d13a00} fill="white" />
            <path d={kitsLogoSvgPaths.p34ea6380} fill="white" />
            <path d={kitsLogoSvgPaths.p2128cd00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p559ba80} fill="white" />
            <path d={kitsLogoSvgPaths.p3e1880} fill="white" />
            <path d={kitsLogoSvgPaths.p2be3c80} fill="white" />
            <path d={kitsLogoSvgPaths.p21233540} fill="white" />
            <path d={kitsLogoSvgPaths.p10621c00} fill="white" />
            <path d={kitsLogoSvgPaths.p9e73f00} fill="white" />
            <path d={kitsLogoSvgPaths.p19e8c400} fill="white" />
            <path d={kitsLogoSvgPaths.p2c4da080} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p22b47400} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p3a763800} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p32533e00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p20154400} fill="white" />
            <path d={kitsLogoSvgPaths.p2922b100} fill="white" />
            <path d={kitsLogoSvgPaths.p18a02c00} fill="white" />
            <path d={kitsLogoSvgPaths.p19b3ff00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p38efc800} fill="white" />
            <path d={kitsLogoSvgPaths.p3d87b2f1} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p19328980} fill="white" />
            <path d={kitsLogoSvgPaths.p11374380} fill="white" />
            <path d={kitsLogoSvgPaths.p3da48b00} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2ec8eb80} fill="white" />
            <path d={kitsLogoSvgPaths.p3c3dd180} fill="white" />
            <path d={kitsLogoSvgPaths.p23d77d00} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p11fe7c00} fill="white" />
            <path d={kitsLogoSvgPaths.p12d2f800} fill="white" />
            <path d={kitsLogoSvgPaths.p254d2400} fill="white" />
            <path d={kitsLogoSvgPaths.p1a78a580} fill="white" />
            <path d={kitsLogoSvgPaths.pd934a00} fill="white" />
            <path d={kitsLogoSvgPaths.p91f7940} fill="white" />
            <path d={kitsLogoSvgPaths.p31381900} fill="white" />
            <path d={kitsLogoSvgPaths.p1db3db00} fill="white" />
            <path d={kitsLogoSvgPaths.p162db80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p31392e40} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p572fd80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p42ca9f0} fill="white" />
            <path d={kitsLogoSvgPaths.p1fbea800} fill="white" />
            <path d={kitsLogoSvgPaths.p347900} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p32f3e700} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p137e4be0} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3cec4d00} fill="white" />
            <path d={kitsLogoSvgPaths.p1789f800} fill="white" />
            <path d={kitsLogoSvgPaths.p2f0e9f00} fill="white" />
            <path d={kitsLogoSvgPaths.p25a75680} fill="white" />
            <path d={kitsLogoSvgPaths.pe806e80} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p1370a872} fill="white" />
            <path d={kitsLogoSvgPaths.p22494b80} fill="white" />
            <path d={kitsLogoSvgPaths.p148f1100} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p338d2480} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.pa0f7100} fill="white" />
            <path d={kitsLogoSvgPaths.p14237240} fill="white" />
            <path d={kitsLogoSvgPaths.p36867000} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p299b6480} fill="white" />
            <path d={kitsLogoSvgPaths.p2193f600} fill="white" />
            <path d={kitsLogoSvgPaths.p1eba2900} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p39c14300} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p2b6dba20} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p33378000} fill="white" />
            <path d={kitsLogoSvgPaths.p11285380} fill="white" />
            <path d={kitsLogoSvgPaths.p2c94a680} fill="white" />
            <path d={kitsLogoSvgPaths.pee7f300} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p3c991700} fill="white" />
            <path d={kitsLogoSvgPaths.p22fabb00} fill="white" />
            <path d={kitsLogoSvgPaths.p29132500} fill="#C9C9C9" />
            <path d={kitsLogoSvgPaths.p34ae3780} fill="white" />
            <path d={kitsLogoSvgPaths.p2f4f77b0} fill="#E4E4E4" />
            <path d={kitsLogoSvgPaths.p18ae7800} fill="white" />
            <path d={kitsLogoSvgPaths.p28140d00} fill="white" />
            <path d={kitsLogoSvgPaths.p3dc4d900} fill="#FEFEFE" />
            <path d={kitsLogoSvgPaths.p28671f70} fill="#C9C9C9" />
            <path clipRule="evenodd" d={kitsLogoSvgPaths.p32c23e60} fill="#FEFEFE" fillRule="evenodd" />
            
            {/* Orange/Amber badge paths */}
            <path d={kitsLogoSvgPaths.p50b5e40} fill="#FEBD1A" />
            <path d={kitsLogoSvgPaths.p1bfe4700} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p1be47a00} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p1ce31b90} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p47dcc00} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p29c5df2} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.pc3a8a00} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p32aec470} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p1166ff00} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p1f02b700} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p5889300} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p3c994fc0} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p34df1ff0} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p387da480} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p1b53a200} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p10dc9900} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p2b78fc0} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.p2000b080} fill="#FFBE1A" />
            <path d={kitsLogoSvgPaths.pde71f00} fill="#FFBE1A" />
            
            {/* More white paths */}
            <path d={kitsLogoSvgPaths.p3f8c2df0} fill="white" />
            <path d={kitsLogoSvgPaths.p27947c80} fill="white" />
            <path d={kitsLogoSvgPaths.p3e340e00} fill="white" />
            <path d={kitsLogoSvgPaths.p3081f6f0} fill="white" />
            <path d={kitsLogoSvgPaths.p37b01100} fill="white" />
            <path d={kitsLogoSvgPaths.p9e2c400} fill="white" />
            <path d={kitsLogoSvgPaths.p1bbc9200} fill="#C9C9C9" />
          </g>
        </svg>
      );
    }

    return (
      <div style={{
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: `${fullHeight * 0.5}px`,
        fontWeight: 'var(--font-weight-semibold)',
        color: textColor,
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 'var(--font-weight-bold)' }}>
          nook
        </span>
        <span style={{ fontWeight: 'var(--font-weight-normal)', opacity: 0.5 }}>
          web
        </span>
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap}px`,
        ...containerStyles,
        ...style,
      }}
      role="img"
      aria-label={`${config.text} logo`}
    >
      {/* Icon part - ALWAYS white + yellow (#FFBE1A) */}
      <svg
        width={iconWidth}
        height={fullHeight}
        viewBox="0 0 40 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <g>
          {/* Always white for the main W shape */}
          <path d={iconSvgPaths.p35c7bb40} fill="#FFFFFF" />
          <path d={iconSvgPaths.p32a31380} fill="#FFFFFF" />
          {/* ALWAYS yellow (#FFBE1A) for the dots - never brand color */}
          <path d={iconSvgPaths.p7f9bb00} fill="#FFBE1A" />
          <path d={iconSvgPaths.p2661f200} fill="#FFBE1A" />
        </g>
      </svg>

      {/* Text part */}
      {renderBrandText()}
    </div>
  );
}