import svgPaths from "./svg-pf4qyoc9yb";
import imgBottom from "figma:asset/f74093c82e0ebc8a763f5aa1b28cb70db79a2621.png";
import imgAvatar from "figma:asset/f696e50d914cf017f3f0dedc0a291546425bc149.png";

function Group4() {
  return (
    <div className="absolute contents inset-[34.11%_28.73%_33.38%_29.65%]">
      <div className="absolute flex inset-[47.06%_51.33%_33.53%_29.65%] items-center justify-center">
        <div className="flex-none h-[2.639px] rotate-[45.6deg] skew-x-[1.2deg] w-[7.687px]">
          <div className="bg-[#ecedee] rounded-[2.838px] size-full" />
        </div>
      </div>
      <div className="absolute flex inset-[34.11%_28.73%_33.38%_39.42%] items-center justify-center">
        <div className="flex-none h-[2.639px] rotate-[134.4deg] skew-x-[-1.2deg] w-[14.654px]">
          <div className="bg-[#ecedee] rounded-[2.838px] size-full" />
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[-3.57%_-4.46%_-4.46%_-3.57%]">
      <div className="absolute inset-[-3.57%_-4.46%_-4.46%_-3.57%]">
        <div className="absolute inset-[4.53%_4.31%_3.92%_4.31%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.5168 37.5851">
            <g filter="url(#filter0_ii_145_8881)" id="Star 7">
              <path d={svgPaths.p1e0aef00} fill="var(--fill-0, #D9DBDD)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="43.0136" id="filter0_ii_145_8881" width="44.3025" x="-4.07143" y="-2.71429">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.71429" dy="2.71429" />
                <feGaussianBlur stdDeviation="3.05357" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 1 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_145_8881" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-4.07143" dy="-2.71429" />
                <feGaussianBlur stdDeviation="3.39286" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0.5 0" />
                <feBlend in2="effect1_innerShadow_145_8881" mode="normal" result="effect2_innerShadow_145_8881" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Group4 />
      <div className="absolute inset-[14.34%_13.79%_13.47%_14.78%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.1429 27.4321">
          <path d={svgPaths.p39e5bf00} fill="var(--fill-0, #ECEDEE)" id="Ellipse 12" />
        </svg>
      </div>
    </div>
  );
}

function TopicTileMedallionsNotStarted() {
  return (
    <div className="relative shrink-0 size-[38px]" data-name="Topic Tile Medallions /Not Started">
      <Group5 />
    </div>
  );
}

function LibraryTopicProgressWCerts() {
  return (
    <div className="absolute content-stretch flex items-start left-[204px] top-[178px]" data-name="library-topic-progress (w/certs)">
      <TopicTileMedallionsNotStarted />
    </div>
  );
}

function Bottom() {
  return (
    <div className="absolute inset-0 rounded-[12px]" data-name="Bottom">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBottom} />
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 230">
            <path d="M0 0H256V230H0V0Z" data-figma-bg-blur-radius="50" fill="var(--fill-0, white)" id="Blur" />
            <defs>
              <clipPath id="bgblur_0_145_8874_clip_path" transform="translate(50 50)">
                <path d="M0 0H256V230H0V0Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="absolute h-[94px] left-1/2 rounded-[12px] top-[calc(50%-53px)] translate-x-[-50%] translate-y-[-50%] w-[226px]" data-name="Artwork">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBottom} />
        </div>
        <LibraryTopicProgressWCerts />
      </div>
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bottom-[23.48%] contents left-[16px] top-[52.17%]" data-name="Text">
      <p className="absolute bottom-[110px] css-4hzbpn font-['Inter_Tight:SemiBold',sans-serif] font-semibold leading-[28px] left-[16px] text-[#444] text-[18px] translate-y-[100%] w-[215px]">A Topic Name That Is Two Lines</p>
    </div>
  );
}

function Progress() {
  return (
    <div className="absolute contents inset-[86.09%_41.88%_6.91%_6.25%]" data-name="Progress">
      <p className="absolute css-4hzbpn font-['Inter_Tight:Regular',sans-serif] font-normal inset-[86.09%_41.88%_6.91%_6.25%] leading-[21px] opacity-70 text-[#7d7d7d] text-[14px]">80% Complete</p>
    </div>
  );
}

function TopicTileDesktop() {
  return (
    <div className="absolute h-[230px] left-[68px] top-[56px] w-[256px]" data-name="Topic Tile (desktop)">
      <Bottom />
      <Text />
      <Progress />
    </div>
  );
}

function LogoFull() {
  return (
    <div className="col-1 h-[25.222px] ml-0 mt-0 relative row-1 w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 25.222">
        <g clipPath="url(#clip0_145_8803)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, white)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, white)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #C9C9C9)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #C9C9C9)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #C9C9C9)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_145_8803">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Container">
      <LogoFull />
    </div>
  );
}

function WugwebLogo() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center py-[4px] relative rounded-[10px] shrink-0" data-name="Wugweb Logo">
      <Container />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-center justify-center relative shrink-0 w-[120px]" data-name="Logo">
      <WugwebLogo />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">About</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="bg-black content-stretch flex h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="About">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">Services</p>
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="bg-black content-stretch flex h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Services">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">Work</p>
      </div>
    </div>
  );
}

function Work() {
  return (
    <div className="bg-black content-stretch flex h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Work">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">Blog</p>
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div className="bg-black content-stretch flex h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Blog">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">Contact</p>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="bg-black content-stretch flex h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Contact">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame4 />
    </div>
  );
}

function Contact1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[24.667px]" data-name="Contact">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.6667 24">
        <g id="Contact">
          <rect fill="#C9C9C9" height="24" width="24.6667" />
          <path d={svgPaths.p1d840a00} fill="var(--fill-0, #1A1A1A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center py-[8px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center">
        <p className="css-ew64yg leading-[normal]">{`Let's Talk`}</p>
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div className="bg-[#c9c9c9] content-stretch flex gap-[6px] h-[44px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Quote">
      <div aria-hidden="true" className="absolute border border-[#979797] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Contact1 />
      <Frame5 />
    </div>
  );
}

function MenuLinks() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Menu Links">
      <About />
      <Services />
      <Work />
      <Blog />
      <Contact />
      <Quote />
    </div>
  );
}

function FloatingHeader() {
  return (
    <div className="bg-[#191919] relative rounded-[12px] shrink-0 w-full" data-name="Floating Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Logo />
          <MenuLinks />
        </div>
      </div>
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="content-stretch flex flex-col items-center pointer-events-auto px-[40px] py-[10px] sticky top-0 w-[1440px]" data-name="Navigation Bar">
      <FloatingHeader />
    </div>
  );
}

function LogoFull1() {
  return (
    <div className="col-1 h-[25.222px] ml-0 mt-0 relative row-1 w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 25.222">
        <g clipPath="url(#clip0_145_8863)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, white)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, white)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #999999)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #999999)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #999999)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_145_8863">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Container">
      <LogoFull1 />
    </div>
  );
}

function WugwebLogo1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center py-[4px] relative shrink-0" data-name="Wugweb Logo">
      <Container2 />
    </div>
  );
}

function MenuItem() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#f4f4f4] text-[14px]">Menu Item 1</p>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#f4f4f4] text-[14px]">Menu Item 2</p>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#f4f4f4] text-[14px]">Menu Item 3</p>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#f4f4f4] text-[14px]">Menu Item 4</p>
    </div>
  );
}

function MenuItem4() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#f4f4f4] text-[14px]">Menu Item 5</p>
    </div>
  );
}

function HeaderMenuItems() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0" data-name="Header Menu Items">
      <MenuItem />
      <MenuItem1 />
      <MenuItem2 />
      <MenuItem3 />
      <MenuItem4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Container">
      <WugwebLogo1 />
      <HeaderMenuItems />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center">
        <p className="css-ew64yg leading-[21px]">Sign in</p>
      </div>
    </div>
  );
}

function IconsNewDefault() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New/Default">
          <path d={svgPaths.p2610ef00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSmDefaultSecondary() {
  return (
    <div className="bg-[#ebebea] content-stretch flex gap-[4px] h-[36px] items-center px-[8px] py-[6px] relative rounded-[6px] shrink-0" data-name="Button/sm/Default/Secondary">
      <div aria-hidden="true" className="absolute border border-[#ebebea] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame6 />
      <IconsNewDefault />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center px-[6px] py-[4px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white">
        <p className="css-ew64yg leading-[21px]">Get Started</p>
      </div>
    </div>
  );
}

function ButtonSmDefaultPrimary() {
  return (
    <div className="bg-[#191919] content-stretch flex h-[36px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="Button/sm/Default/Primary">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame7 />
    </div>
  );
}

function ButtonGroups() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Button groups">
      <ButtonSmDefaultSecondary />
      <ButtonSmDefaultPrimary />
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[48px] py-[20px] relative w-full">
          <Container1 />
          <ButtonGroups />
        </div>
      </div>
    </div>
  );
}

function HeaderNavigation() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col items-start left-[24px] overflow-clip rounded-[12px] top-[671px] w-[1440px]" data-name="Header Navigation">
      <Header />
    </div>
  );
}

function WugwebLogo2() {
  return (
    <div className="h-[38px] relative shrink-0 w-[45.333px]" data-name="Wugweb Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 45.3333 38">
        <g id="Wugweb Logo">
          <g id="Vector">
            <path d={svgPaths.p2cc3cd40} fill="white" />
            <path d={svgPaths.p2e508370} fill="white" />
            <path d={svgPaths.p24fb7280} fill="var(--fill-0, #FFBE1A)" />
            <path d={svgPaths.p19950b30} fill="var(--fill-0, #FFBE1A)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem5() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon />
          <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#bababa] text-[14px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem6() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon1 />
          <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#bababa] text-[14px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem7() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon2 />
          <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#bababa] text-[14px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem8() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon3 />
          <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px opacity-50 relative text-[#bababa] text-[14px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #F4F4F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #F4F4F4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem9() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon4 />
          <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#f4f4f4] text-[14px]">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function ListContainer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0" data-name="List container">
      <MenuItem5 />
      <MenuItem6 />
      <MenuItem7 />
      <MenuItem8 />
      <MenuItem9 />
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Section">
      <ListContainer />
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section title">
      <div className="content-stretch flex flex-col items-start px-[8px] relative w-full">
        <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a3a3a3] text-[14px]">
          <p className="css-ew64yg leading-[20px]">Section 1</p>
        </div>
      </div>
    </div>
  );
}

function IconsNewDefault1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <rect fill="var(--fill-0, #F2F2F2)" height="16" rx="8" width="16" />
          <path d={svgPaths.p113228e0} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #F4F4F4)" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem10() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsNewDefault1 />
    </div>
  );
}

function TrashIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Trash Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Trash Icon">
          <path d={svgPaths.pfd00a80} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #F4F4F4)" />
          <path d={svgPaths.p1e87b730} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function IconsDefault() {
  return (
    <div className="bg-[#f2f2f2] relative rounded-[50px] shrink-0 size-[16px]" data-name="Icons/Default">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[10px] relative size-full">
          <TrashIcon />
        </div>
      </div>
    </div>
  );
}

function MenuItem11() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsDefault />
    </div>
  );
}

function IconsNewDefault2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <path d={svgPaths.p2224a970} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem12() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsNewDefault2 />
    </div>
  );
}

function ListContainer1() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0" data-name="List container">
      <MenuItem10 />
      <MenuItem11 />
      <MenuItem12 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0" data-name="Section">
      <SectionTitle />
      <ListContainer1 />
    </div>
  );
}

function SectionTitle1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section title">
      <div className="content-stretch flex flex-col items-start px-[8px] relative w-full">
        <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a3a3a3] text-[14px]">
          <p className="css-ew64yg leading-[20px]">Section 2</p>
        </div>
      </div>
    </div>
  );
}

function IconsNewDefault3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <g clipPath="url(#clip0_145_8821)">
            <rect fill="var(--fill-0, #F2F2F2)" height="16" rx="8" width="16" />
            <path d={svgPaths.p38733c00} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #F4F4F4)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_145_8821">
            <rect fill="white" height="16" rx="8" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MenuItem13() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsNewDefault3 />
    </div>
  );
}

function IconsNew() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p171af900} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem14() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsNew />
    </div>
  );
}

function IconsNewDefault4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <rect fill="var(--fill-0, #F2F2F2)" height="16" rx="8" width="16" />
          <path d={svgPaths.pf727100} id="Vector" stroke="var(--stroke-0, #F4F4F4)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem15() {
  return (
    <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <IconsNewDefault4 />
    </div>
  );
}

function ListContainer2() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0" data-name="List container">
      <MenuItem13 />
      <MenuItem14 />
      <MenuItem15 />
    </div>
  );
}

function Section2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Section">
      <SectionTitle1 />
      <ListContainer2 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="avatar">
      <div className="relative rounded-[50px] shrink-0 size-[40px]" data-name="avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[50px] size-full" src={imgAvatar} />
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Section">
      <Avatar />
    </div>
  );
}

function SideMenu() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col gap-[16px] items-start left-[1507px] p-[24px] rounded-[12px] top-[445px]" data-name="Side Menu">
      <WugwebLogo2 />
      <Section />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(43, 43, 43, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 1">
            <line id="Divider" stroke="var(--stroke-0, #2B2B2B)" x2="73" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(43, 43, 43, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 1">
            <line id="Divider" stroke="var(--stroke-0, #2B2B2B)" x2="73" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section2 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(43, 43, 43, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73 1">
            <line id="Divider" stroke="var(--stroke-0, #2B2B2B)" x2="73" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#1a1a1a] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[10px]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:Regular',sans-serif] font-normal h-[64px] justify-center leading-[0] min-h-px min-w-px relative text-[#a3a3a3] text-[14px] text-center">
            <p className="css-4hzbpn leading-[21px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPlaceholder() {
  return (
    <div className="bg-black content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative w-full" data-name="Content Placeholder">
      <Container3 />
    </div>
  );
}

function Popover() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[198px] items-start left-[493px] p-[4px] rounded-[10px] top-[147.96px] w-[304px]" data-name="Popover">
      <ContentPlaceholder />
    </div>
  );
}

function Divider() {
  return (
    <div className="absolute h-px left-[545px] top-[46px] w-[375px]" data-name="Divider">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 375 1">
        <g id="Divider">
          <path clipRule="evenodd" d="M375 1H0V0H375V1Z" fill="var(--fill-0, black)" fillOpacity="0.1" fillRule="evenodd" id="divider" />
        </g>
      </svg>
    </div>
  );
}

function DragHandleArea() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[8px] relative shrink-0 w-full" data-name="Drag Handle area">
      <div className="h-0 relative shrink-0 w-[40px]" data-name="Drag handle indicator">
        <div className="absolute inset-[-4px_0_0_0]" style={{ "--stroke-0": "rgba(223, 223, 223, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 4">
            <line id="Drag handle indicator" stroke="var(--stroke-0, #DFDFDF)" strokeLinecap="round" strokeWidth="4" x1="2" x2="38" y1="2" y2="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#1a1a1a] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[8px]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:Regular',sans-serif] font-normal h-[64px] justify-center leading-[0] min-h-px min-w-px relative text-[#a3a3a3] text-[14px] text-center">
            <p className="css-4hzbpn leading-[21px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPlaceholder1() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative rounded-[8px] w-full" data-name="Content Placeholder">
      <Container4 />
    </div>
  );
}

function BottomSheet() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[280px] items-center justify-center left-[845.34px] pb-[8px] px-[8px] rounded-[12px] top-[36px] w-[350px]" data-name="Bottom Sheet">
      <DragHandleArea />
      <ContentPlaceholder1 />
    </div>
  );
}

function Surface() {
  return (
    <div className="absolute bg-black content-stretch flex gap-[4px] items-start left-0 px-[6px] py-[4px] rounded-[4px] top-0" data-name="Surface">
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
      <div className="bg-[#1a1a1a] h-[48px] rounded-[2px] shrink-0 w-[8px]" data-name="Cells map item" />
    </div>
  );
}

function Slider() {
  return (
    <div className="absolute h-[48px] left-[73.37%] right-[1.63%] top-[4px]" data-name="Slider">
      <div className="absolute border-2 border-[#ffbe1a] border-solid h-[48px] left-0 right-0 rounded-[4px] top-0" data-name="Highlight area" />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[56px] left-[1296px] top-[158px] w-[368px]" data-name="Table">
      <Surface />
      <Slider />
    </div>
  );
}

function Tags() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[1401px] px-[8px] py-[4px] rounded-[20px] top-[102px] w-[65px]" data-name="Tags">
      <div aria-hidden="true" className="absolute border-[0.5px] border-solid border-white inset-0 pointer-events-none rounded-[20px]" />
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-white">
        <p className="css-ew64yg leading-[normal]">Tagname</p>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="absolute content-stretch flex flex-col h-[32px] items-center justify-center left-[1311px] overflow-clip px-[8px] py-[4px] top-[273px]" data-name="Tabs">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1a1a1a] text-[14px]">
        <p className="css-ew64yg leading-[21px]">$link</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="absolute bg-black content-stretch flex gap-[12px] h-[56px] items-start left-[1722px] overflow-clip p-[12px] rounded-[3px] top-[271.5px] w-[200px]" data-name="TextArea">
      <div className="absolute bg-black inset-0 rounded-[3px]" data-name="border">
        <div aria-hidden="true" className="absolute border border-[#1a1a1a] border-solid inset-0 pointer-events-none rounded-[3px]" />
      </div>
      <p className="css-4hzbpn flex-[1_0_0] font-['Inter_Tight:Regular',sans-serif] font-normal h-full leading-[21px] min-h-px min-w-px relative text-[#dfdfdf] text-[14px]">text area</p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a3a3a3] text-[16px]">
        <p className="css-ew64yg leading-[24px]">Username</p>
      </div>
    </div>
  );
}

function IconsNew1() {
  return <div className="shrink-0 size-[24px]" data-name="Icons New" />;
}

function C() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="c">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Content />
          <IconsNew1 />
        </div>
      </div>
    </div>
  );
}

function Holder() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Holder">
      <C />
    </div>
  );
}

function InputTextBox() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Input Text Box">
      <Holder />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a3a3a3] text-[16px]">
        <p className="css-ew64yg leading-[24px]">Password</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute bottom-[27.2%] left-[12.5%] right-[12.5%] top-1/4" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 11.4726">
        <g id="Group">
          <path d={svgPaths.p3650e040} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[27.2%] contents left-[12.5%] right-[12.5%] top-1/4" data-name="Group">
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[33.33%_37%_37%_33.33%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.12094 7.12093">
        <g id="Group">
          <path d={svgPaths.p121eaf80} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[33.33%_37%_37%_33.33%]" data-name="Group">
      <Group3 />
    </div>
  );
}

function IconsNew2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icons New">
      <Group />
      <Group2 />
    </div>
  );
}

function C1() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="c">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Content1 />
          <IconsNew2 />
        </div>
      </div>
    </div>
  );
}

function Holder1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-name="Holder">
      <C1 />
    </div>
  );
}

function InputTextBox1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Input Text Box">
      <Holder1 />
    </div>
  );
}

function TextInputGroup() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col items-start left-[1722px] rounded-[8px] top-[366px] w-[320px]" data-name="Text Input Group">
      <InputTextBox />
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-[180deg] w-full">
          <div className="h-0 relative w-full" data-name="Divider">
            <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(43, 43, 43, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 1">
                <line id="Divider" stroke="var(--stroke-0, #2B2B2B)" x2="320" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <InputTextBox1 />
    </div>
  );
}

function Tooltip() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col h-[40px] items-start left-[1722px] p-[12px] rounded-[4px] top-[550px] w-[314px]" data-name="Tooltip">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_6px_6px_-6px_rgba(0,0,0,0.16),0px_0px_1px_0px_rgba(0,0,0,0.4)]" />
      <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[12px] text-white w-[290px]">
        <p className="css-4hzbpn leading-[18px]">This is a single line tooltip with no wrapping text and</p>
      </div>
    </div>
  );
}

export default function MissingComponents() {
  return (
    <div className="bg-white relative size-full" data-name="Missing components">
      <TopicTileDesktop />
      <div className="absolute bottom-0 h-[755px] left-[49px] pointer-events-none top-[478px]">
        <NavigationBar />
      </div>
      <HeaderNavigation />
      <SideMenu />
      <Popover />
      <Divider />
      <BottomSheet />
      <Table />
      <Tags />
      <Tabs />
      <TextArea />
      <TextInputGroup />
      <Tooltip />
    </div>
  );
}