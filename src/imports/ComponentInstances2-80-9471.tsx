import svgPaths from "./svg-irl81iwgqe";
import imgAvatar from "figma:asset/203a84312764c875d96421e89cb7a492bb418a19.png";
import imgPhoto from "figma:asset/04477cbda1713d97acf3aace694c77ff7d2e5040.png";

function GooglePlayLogo() {
  return (
    <div className="h-[25px] relative shrink-0 w-[22.431px]" data-name="Google Play logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 25">
        <g id="Google Play logo">
          <path d={svgPaths.p3a423f0} fill="url(#paint0_linear_80_10211)" id="Vector" />
          <path d={svgPaths.p23049080} fill="url(#paint1_linear_80_10211)" id="Vector_2" />
          <path d={svgPaths.p308e7700} fill="url(#paint2_linear_80_10211)" id="Vector_3" />
          <path d={svgPaths.pfc00b80} fill="url(#paint3_linear_80_10211)" id="Vector_4" />
          <path d={svgPaths.p96bc800} fill="var(--fill-0, black)" id="Vector_5" opacity="0.2" />
          <path d={svgPaths.p2acae040} fill="var(--fill-0, black)" id="Vector_6" opacity="0.12" />
          <path d={svgPaths.p3fa3d800} fill="var(--fill-0, black)" id="Vector_7" opacity="0.12" />
          <path d={svgPaths.p39b95d00} fill="var(--fill-0, white)" id="Vector_8" opacity="0.25" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_80_10211" x1="11.491" x2="-4.80941" y1="1.53308" y2="17.8334">
            <stop stopColor="#00A0FF" />
            <stop offset="0.00657" stopColor="#00A1FF" />
            <stop offset="0.2601" stopColor="#00BEFF" />
            <stop offset="0.5122" stopColor="#00D2FF" />
            <stop offset="0.7604" stopColor="#00DFFF" />
            <stop offset="1" stopColor="#00E3FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_80_10211" x1="23.1799" x2="-0.321955" y1="12.5005" y2="12.5005">
            <stop stopColor="#FFE000" />
            <stop offset="0.4087" stopColor="#FFBD00" />
            <stop offset="0.7754" stopColor="#FFA500" />
            <stop offset="1" stopColor="#FF9C00" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_80_10211" x1="14.4312" x2="-7.67338" y1="14.7292" y2="36.8338">
            <stop stopColor="#FF3A44" />
            <stop offset="1" stopColor="#C31162" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_80_10211" x1="-2.5949" x2="7.27572" y1="-6.75534" y2="3.11528">
            <stop stopColor="#32A071" />
            <stop offset="0.0685" stopColor="#2DA771" />
            <stop offset="0.4762" stopColor="#15CF74" />
            <stop offset="0.8009" stopColor="#06E775" />
            <stop offset="1" stopColor="#00F076" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-center pb-[5px] pt-0 px-0 relative shrink-0 text-center text-nowrap text-white whitespace-pre" data-name="Text">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[12px]">Get it on</p>
      <p className="font-['Inter_Tight:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[16px]">Google Play</p>
    </div>
  );
}

function AppBadges() {
  return (
    <div className="absolute bg-[#2d2d2d] bottom-[91.27%] box-border content-stretch flex gap-[12px] items-center justify-center left-[calc(50%+10.5px)] px-[30px] py-[16px] rounded-[10px] top-[3.01%] translate-x-[-50%] w-[200px]" data-name="App Badges">
      <GooglePlayLogo />
      <Text />
    </div>
  );
}

function LogoFull() {
  return (
    <div className="[grid-area:1_/_1] h-[25.222px] ml-0 mt-0 relative w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 26">
        <g clipPath="url(#clip0_80_10177)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, #191919)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, #191919)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #999999)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #999999)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, #191919)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #999999)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_80_10177">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
      <LogoFull />
    </div>
  );
}

function WugwebLogo() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-0 py-[4px] relative shrink-0" data-name="Wugweb Logo">
      <Container />
    </div>
  );
}

function MenuItem() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 1</p>
    </div>
  );
}

function MenuItem1() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 2</p>
    </div>
  );
}

function MenuItem2() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 3</p>
    </div>
  );
}

function MenuItem3() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 4</p>
    </div>
  );
}

function MenuItem4() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 5</p>
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
      <WugwebLogo />
      <HeaderMenuItems />
    </div>
  );
}

function Frame() {
  return (
    <div className="box-border content-stretch flex gap-[4px] items-center px-0 py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-black text-center text-nowrap">
        <p className="leading-[16px] whitespace-pre">Sign in</p>
      </div>
    </div>
  );
}

function IconsNewDefault() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New/Default">
          <path d={svgPaths.p4b36d00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSmDefaultSecondary() {
  return (
    <div className="bg-[#ebebea] box-border content-stretch flex gap-[4px] h-[36px] items-center px-[8px] py-[6px] relative rounded-[6px] shrink-0" data-name="Button/sm/Default/Secondary">
      <div aria-hidden="true" className="absolute border border-[#ebebea] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame />
      <IconsNewDefault />
    </div>
  );
}

function Frame1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center px-[6px] py-[4px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[16px] whitespace-pre">Get Started</p>
      </div>
    </div>
  );
}

function ButtonSmDefaultPrimary() {
  return (
    <div className="bg-[#191919] box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0" data-name="Button/sm/Default/Primary">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Frame1 />
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
        <div className="box-border content-stretch flex items-center justify-between px-[48px] py-[20px] relative w-full">
          <Container1 />
          <ButtonGroups />
        </div>
      </div>
    </div>
  );
}

function HeaderNavigation() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[21px] overflow-clip rounded-[12px] top-[33px] w-[1440px]" data-name="Header Navigation">
      <Header />
    </div>
  );
}

function LogoFull1() {
  return (
    <div className="[grid-area:1_/_1] h-[25.222px] ml-0 mt-0 relative w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 26">
        <g clipPath="url(#clip0_80_10177)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, #191919)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, #191919)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #999999)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #999999)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, #191919)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #999999)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_80_10177">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
      <LogoFull1 />
    </div>
  );
}

function WugwebLogo1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] h-[40px] items-center justify-center px-0 py-[4px] relative shrink-0 w-[120px]" data-name="Wugweb Logo">
      <Container2 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem5() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Menu Item 1</p>
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
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem6() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon1 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Menu Item 2</p>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem7() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon2 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px opacity-50 relative shrink-0 text-[#313335] text-[14px]">Menu Item 3</p>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem8() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon3 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Menu Item 4</p>
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
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p120c8200} id="Vector_2" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem9() {
  return (
    <div className="bg-[#f4f4f4] relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <Icon4 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Menu Item 5</p>
        </div>
      </div>
    </div>
  );
}

function ListContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="List container">
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
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Section">
      <ListContainer />
    </div>
  );
}

function SectionTitle() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section title">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[8px] py-0 relative w-full">
          <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#7d7d7d] text-[14px] text-nowrap">
            <p className="leading-[20px] whitespace-pre">Section 1</p>
          </div>
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
          <path d={svgPaths.p3855dc00} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #313335)" strokeWidth="0.666667" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem10() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsNewDefault1 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 1</p>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trash Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trash Icon">
          <path d={svgPaths.p109c03f0} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #313335)" strokeWidth="0.666667" />
          <path d={svgPaths.p24caba00} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function IconsDefault() {
  return (
    <div className="bg-[#f2f2f2] box-border content-stretch flex flex-col items-center justify-center overflow-clip p-[6.667px] relative rounded-[33.333px] shrink-0 size-[16px]" data-name="Icons/Default">
      <TrashIcon />
    </div>
  );
}

function MenuItem11() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsDefault />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 2</p>
        </div>
      </div>
    </div>
  );
}

function IconsNewDefault2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <path d={svgPaths.p8e0d170} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem12() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsNewDefault2 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 3</p>
        </div>
      </div>
    </div>
  );
}

function ListContainer1() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="List container">
      <MenuItem10 />
      <MenuItem11 />
      <MenuItem12 />
    </div>
  );
}

function Section1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Section">
      <SectionTitle />
      <ListContainer1 />
    </div>
  );
}

function SectionTitle1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section title">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[8px] py-0 relative w-full">
          <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#7d7d7d] text-[14px] text-nowrap">
            <p className="leading-[20px] whitespace-pre">Section 2</p>
          </div>
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
          <rect fill="var(--fill-0, #F2F2F2)" height="16" rx="8" width="16" />
          <path d={svgPaths.p1eac0e00} fill="var(--fill-0, black)" id="Vector" stroke="var(--stroke-0, #313335)" strokeWidth="0.666667" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem13() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsNewDefault3 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 1</p>
        </div>
      </div>
    </div>
  );
}

function IconsNew() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p187a01c0} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem14() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsNew />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 2</p>
        </div>
      </div>
    </div>
  );
}

function IconsNewDefault4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New/Default">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New/Default">
          <rect fill="var(--fill-0, #F2F2F2)" height="16" rx="8" width="16" />
          <path d={svgPaths.p23cbd540} id="Vector" stroke="var(--stroke-0, #313335)" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function MenuItem15() {
  return (
    <div className="relative shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative w-full">
          <IconsNewDefault4 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[16px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Title 3</p>
        </div>
      </div>
    </div>
  );
}

function ListContainer2() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="List container">
      <MenuItem13 />
      <MenuItem14 />
      <MenuItem15 />
    </div>
  );
}

function Section2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Section">
      <SectionTitle1 />
      <ListContainer2 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="avatar">
      <img alt="" className="block max-w-none size-full" height="40" src={imgAvatar} width="40" />
    </div>
  );
}

function Section3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Section">
      <Avatar />
    </div>
  );
}

function DesktopSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Desktop Section">
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(223, 223, 223, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 1">
            <line id="Divider" stroke="var(--stroke-0, #DFDFDF)" x2="232" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section3 />
    </div>
  );
}

function SideMenu() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[16px] items-start left-[54px] p-[24px] rounded-[12px] top-[138px] w-[280px]" data-name="Side Menu">
      <WugwebLogo1 />
      <Section />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(223, 223, 223, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 1">
            <line id="Divider" stroke="var(--stroke-0, #DFDFDF)" x2="232" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(223, 223, 223, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 1">
            <line id="Divider" stroke="var(--stroke-0, #DFDFDF)" x2="232" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Section2 />
      <DesktopSection />
    </div>
  );
}

function LogoFull2() {
  return (
    <div className="[grid-area:1_/_1] h-[25.222px] ml-0 mt-0 relative w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 26">
        <g clipPath="url(#clip0_80_10169)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, white)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, white)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #C9C9C9)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #C9C9C9)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #C9C9C9)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_80_10169">
            <rect fill="white" height="25.222" width="100" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
      <LogoFull2 />
    </div>
  );
}

function WugwebLogo2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-0 py-[4px] relative rounded-[10px] shrink-0" data-name="Wugweb Logo">
      <Container3 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center relative shrink-0 w-[120px]" data-name="Logo">
      <WugwebLogo2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">About</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="About">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Services</p>
      </div>
    </div>
  );
}

function Services() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Services">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Work() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Work">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Blog</p>
      </div>
    </div>
  );
}

function Blog() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Blog">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-center text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Contact</p>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="bg-black box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Contact">
      <div aria-hidden="true" className="absolute border border-[#191919] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame6 />
    </div>
  );
}

function Contact1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[24.667px]" data-name="Contact">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 24">
        <g id="Contact">
          <rect fill="#C9C9C9" height="24" width="24.6667" />
          <path d={svgPaths.p1d840a00} fill="var(--fill-0, #1A1A1A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center px-0 py-[8px] relative shrink-0">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-black text-center text-nowrap">
        <p className="leading-[normal] whitespace-pre">{`Let's Talk`}</p>
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div className="bg-[#c9c9c9] box-border content-stretch flex gap-[6px] h-[44px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Quote">
      <div aria-hidden="true" className="absolute border border-[#979797] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Contact1 />
      <Frame7 />
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
        <div className="box-border content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Logo />
          <MenuLinks />
        </div>
      </div>
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center pointer-events-auto px-[40px] py-[10px] sticky top-0 w-[1440px]" data-name="Navigation Bar">
      <FloatingHeader />
    </div>
  );
}

function IconsNew1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d="M15 6L9 12L15 18" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function AlertHeader() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Alert-Header">
      <IconsNew1 />
      <div className="basis-0 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[14px] text-black">
        <p className="leading-[21px]">Alert title</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <AlertHeader />
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#2b2b2b] text-[14px] w-full">Pull request #9999 merged after a successful build</p>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p21d6ac00} id="close" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Close() {
  return (
    <div className="box-border content-stretch flex items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0" data-name="Close">
      <Icon5 />
    </div>
  );
}

function Alert() {
  return (
    <div className="absolute bg-white left-[428px] rounded-[8px] top-[357px] w-[432px]" data-name="Alert">
      <div className="box-border content-stretch flex gap-[8px] items-start overflow-clip p-[16px] relative rounded-[inherit] w-[432px]">
        <Content />
        <Close />
      </div>
      <div aria-hidden="true" className="absolute border border-[#f4f4f4] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Content">
      <div className="flex flex-col font-['DM_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#2b2b2b] text-[14px] text-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        <p className="leading-[24px] whitespace-pre">•</p>
      </div>
    </div>
  );
}

function C() {
  return (
    <div className="bg-white h-[40px] relative rounded-[10px] shrink-0 w-full" data-name="c">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[100px] h-[40px] items-center justify-center p-[8px] relative w-full">
          <Content1 />
        </div>
      </div>
    </div>
  );
}

function Holder() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start justify-center min-h-px min-w-px relative shrink-0 w-full" data-name="Holder">
      <C />
    </div>
  );
}

function InputTextBox() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[56px] items-start relative shrink-0 w-[46px]" data-name="Input Text Box">
      <Holder />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[415px] top-[470px]" data-name="Component 7049">
      {[...Array(4).keys()].map((_, i) => (
        <InputTextBox key={i} />
      ))}
    </div>
  );
}

function DragHandleArea() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-center pb-0 pt-[8px] px-0 relative shrink-0 w-full" data-name="Drag Handle area">
      <div className="h-0 relative shrink-0 w-[40px]" data-name="Drag handle indicator">
        <div className="absolute bottom-0 left-0 right-0 top-[-4px]" style={{ "--stroke-0": "rgba(226, 226, 226, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 4">
            <line id="Drag handle indicator" stroke="var(--stroke-0, #E2E2E2)" strokeLinecap="round" strokeWidth="4" x1="2" x2="38" y1="2" y2="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="basis-0 bg-[#f4f4f4] grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="basis-0 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal grow h-[64px] justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#191919] text-[14px] text-center">
            <p className="leading-[20px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPlaceholder() {
  return (
    <div className="basis-0 bg-white content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Content Placeholder">
      <Container4 />
    </div>
  );
}

function BottomSheet() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[8px] h-[280px] items-center justify-center left-[415px] pb-[8px] pt-0 px-[8px] rounded-[12px] top-[570px] w-[350px]" data-name="Bottom Sheet">
      <DragHandleArea />
      <ContentPlaceholder />
    </div>
  );
}

function Left() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Left">
          <path d={svgPaths.p129dfe00} fill="var(--fill-0, #050505)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ComponentsPaginationPrev() {
  return (
    <div className="box-border content-stretch flex items-start overflow-clip p-[6px] relative rounded-[2px] shrink-0" data-name="Components/Pagination-Prev">
      <Left />
    </div>
  );
}

function ComponentsPaginationItem() {
  return (
    <div className="bg-[#ffbe1a] box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-px relative rounded-[2px] shrink-0" data-name="Components/Pagination-Item">
      <p className="font-['Inter_Tight:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[14px] text-black text-center w-[8px]">1</p>
    </div>
  );
}

function ComponentsPaginationItem1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-px relative rounded-[2px] shrink-0" data-name="Components/Pagination-Item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-center text-nowrap">
        <p className="leading-[16px] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function ComponentsPaginationItem2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-px relative rounded-[2px] shrink-0" data-name="Components/Pagination-Item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-center text-nowrap">
        <p className="leading-[16px] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function ComponentsPaginationItem3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-px relative rounded-[2px] shrink-0" data-name="Components/Pagination-Item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-center text-nowrap">
        <p className="leading-[16px] whitespace-pre">4</p>
      </div>
    </div>
  );
}

function ComponentsPaginationItem4() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-px relative rounded-[2px] shrink-0" data-name="Components/Pagination-Item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-center text-nowrap">
        <p className="leading-[16px] whitespace-pre">5</p>
      </div>
    </div>
  );
}

function Right() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Right">
          <path d={svgPaths.p3fb02480} fill="var(--fill-0, #191919)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ComponentsPaginationNext() {
  return (
    <div className="box-border content-stretch flex items-start overflow-clip p-[6px] relative rounded-[2px] shrink-0" data-name="Components/Pagination-Next">
      <Right />
    </div>
  );
}

function Pagination() {
  return (
    <div className="absolute content-stretch flex items-center left-[78px] top-[913px]" data-name="Pagination">
      <ComponentsPaginationPrev />
      <ComponentsPaginationItem />
      <ComponentsPaginationItem1 />
      <ComponentsPaginationItem2 />
      <ComponentsPaginationItem3 />
      <ComponentsPaginationItem4 />
      <ComponentsPaginationNext />
    </div>
  );
}

function IconsNew2() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew2 />
    </div>
  );
}

function IconsNew3() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.pd23a300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew3 />
    </div>
  );
}

function MenuItem16() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Icon6 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[21px] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Menu Item 1</p>
          <Icon7 />
        </div>
      </div>
    </div>
  );
}

function IconsNew4() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew4 />
    </div>
  );
}

function IconsNew5() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.pd23a300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew5 />
    </div>
  );
}

function MenuItem17() {
  return (
    <div className="bg-[#f4f4f4] relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Icon8 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[21px] min-h-px min-w-px relative shrink-0 text-[#313335] text-[14px]">Menu Item 2</p>
          <Icon9 />
        </div>
      </div>
    </div>
  );
}

function IconsNew6() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew6 />
    </div>
  );
}

function IconsNew7() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.pd23a300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew7 />
    </div>
  );
}

function MenuItem18() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Icon10 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[21px] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Menu Item 3</p>
          <Icon11 />
        </div>
      </div>
    </div>
  );
}

function IconsNew8() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew8 />
    </div>
  );
}

function IconsNew9() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.pd23a300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew9 />
    </div>
  );
}

function MenuItem19() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Icon12 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[21px] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Menu Item 4</p>
          <Icon13 />
        </div>
      </div>
    </div>
  );
}

function IconsNew10() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew10 />
    </div>
  );
}

function IconsNew11() {
  return (
    <div className="absolute left-1/2 size-[16px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.pd23a300} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <IconsNew11 />
    </div>
  );
}

function MenuItem20() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="menu item">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Icon14 />
          <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[21px] min-h-px min-w-px relative shrink-0 text-[14px] text-black">Menu Item 5</p>
          <Icon15 />
        </div>
      </div>
    </div>
  );
}

function DropDown() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col items-start left-[946px] p-[4px] rounded-[8px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] top-[359px] w-[236px]" data-name="Drop Down">
      <MenuItem16 />
      <MenuItem17 />
      <MenuItem18 />
      <MenuItem19 />
      <MenuItem20 />
    </div>
  );
}

function InputLabel() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Input Label">
      <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow leading-[15px] min-h-px min-w-px relative shrink-0 text-[#2b2b2b] text-[10px]">Title Here</p>
    </div>
  );
}

function Content2() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Content">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-black text-nowrap">
        <p className="leading-[18px] whitespace-pre">Placeholder</p>
      </div>
    </div>
  );
}

function IconsNew12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function C1() {
  return (
    <div className="bg-white h-[34px] relative rounded-[6px] shrink-0 w-full" data-name="c">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[34px] items-center justify-between p-[8px] relative w-full">
          <Content2 />
          <IconsNew12 />
        </div>
      </div>
    </div>
  );
}

function HelperText() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Helper text">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#7d7d7d] text-[11px] text-nowrap text-right whitespace-pre">This is the helper text</p>
    </div>
  );
}

function Holder1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="Holder">
      <C1 />
      <HelperText />
    </div>
  );
}

function ComboBox() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[974px] top-[628px] w-[281px]" data-name="Combo box">
      <InputLabel />
      <Holder1 />
    </div>
  );
}

function Loader() {
  return (
    <div className="absolute left-[970px] size-[24px] top-[818px]" data-name="Loader">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Loader">
          <path d={svgPaths.p1f13b600} fill="var(--fill-0, #DFDFDF)" id="Ellipse 1" opacity="0.3" />
        </g>
      </svg>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Loader">
          <path d={svgPaths.p35f4ca00} fill="var(--fill-0, #FFBE1A)" id="Ellipse 1" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="basis-0 bg-[#f4f4f4] grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="basis-0 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal grow h-[64px] justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#191919] text-[14px] text-center">
            <p className="leading-[20px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="basis-0 bg-white content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full" data-name="Placeholder">
      <Container5 />
    </div>
  );
}

function Drawer() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[842px] items-start left-[1309px] p-[4px] rounded-[8px] top-[319px] w-[448px]" data-name="Drawer">
      <Placeholder />
    </div>
  );
}

function IconsNew13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p8fca100} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function InputContainer() {
  return (
    <div className="box-border content-stretch flex gap-[12px] h-[56px] items-center max-h-[56px] p-[16px] relative shrink-0 w-[480px]" data-name="Input container">
      <div aria-hidden="true" className="absolute border-[#f4f4f4] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <IconsNew13 />
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#7d7d7d] text-[16px] w-[412px]">
        <p className="leading-[24px]">Type here to find your answers ...</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 bg-[#f4f4f4] grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="basis-0 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal grow h-[64px] justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#191919] text-[14px] text-center">
            <p className="leading-[20px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder1() {
  return (
    <div className="basis-0 bg-white content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px relative rounded-[8px] shrink-0 w-full" data-name="Placeholder">
      <Container6 />
    </div>
  );
}

function Search() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[4px] h-[324px] items-center left-[787px] p-[4px] rounded-[10px] top-[810px] w-[480px]" data-name="Search">
      <InputContainer />
      <Placeholder1 />
    </div>
  );
}

function Tabs() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[4px] h-[32px] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tabs">
      <div className="flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-black text-nowrap">
        <p className="leading-[21px] whitespace-pre">Label</p>
      </div>
    </div>
  );
}

function Tabs1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[4px] h-[32px] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-name="Tabs">
      <div className="flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-black text-nowrap">
        <p className="leading-[21px] whitespace-pre">Label</p>
      </div>
    </div>
  );
}

function SegmentedControl() {
  return (
    <div className="absolute bg-[#f4f4f4] box-border content-stretch flex gap-[4px] items-start justify-center left-[453px] max-h-[40px] p-[4px] rounded-[10px] top-[920px]" data-name="Segmented-control">
      <Tabs />
      <Tabs1 />
    </div>
  );
}

function IconsNew14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p19079300} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Tag() {
  return (
    <div className="absolute bg-black box-border content-stretch flex gap-[4px] items-center justify-center left-[395px] overflow-clip px-[8px] py-[4px] rounded-[4px] top-[1011px]" data-name="Tag">
      <IconsNew14 />
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-center text-nowrap text-white">
        <p className="leading-[18px] whitespace-pre">YOUR LABEL</p>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[20px] h-[78px] items-center justify-center left-[21px] overflow-clip p-[20px] rounded-[3px] top-[1006px] w-[256px]" data-name="TextArea">
      <div className="absolute bg-white inset-0 rounded-[3px]" data-name="border">
        <div aria-hidden="true" className="absolute border border-[#f4f4f4] border-solid inset-0 pointer-events-none rounded-[3px]" />
      </div>
      <p className="basis-0 font-['Inter_Tight:Regular',sans-serif] font-normal grow h-full leading-[24px] min-h-px min-w-px relative shrink-0 text-[#2b2b2b] text-[16px]">text area</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute inset-[12.5%_12.5%_11.39%_12.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p14abea00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p86a5400} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EssentialsHomeOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Essentials / Home / Outline">
      <Icon16 />
    </div>
  );
}

function Menu() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter box-border content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative rounded-[1000px] shrink-0 w-[44px]" data-name="menu 1">
      <EssentialsHomeOutline />
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute inset-[12.5%_12.5%_11.39%_12.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p14abea00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p86a5400} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EssentialsHomeOutline1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Essentials / Home / Outline">
      <Icon17 />
    </div>
  );
}

function Menu1() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter box-border content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative rounded-[1000px] shrink-0 w-[44px]" data-name="menu 2">
      <EssentialsHomeOutline1 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute inset-[12.5%_12.5%_11.39%_12.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p14abea00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p86a5400} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EssentialsHomeOutline2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Essentials / Home / Outline">
      <Icon18 />
    </div>
  );
}

function Menu2() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter box-border content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative rounded-[1000px] shrink-0 w-[44px]" data-name="menu 3">
      <EssentialsHomeOutline2 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute inset-[12.5%_12.5%_11.39%_12.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p14abea00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p86a5400} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EssentialsHomeOutline3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Essentials / Home / Outline">
      <Icon19 />
    </div>
  );
}

function Menu3() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter box-border content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative rounded-[1000px] shrink-0 w-[44px]" data-name="menu 4">
      <EssentialsHomeOutline3 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute inset-[12.5%_12.5%_11.39%_12.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 19">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p14abea00} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p86a5400} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function EssentialsHomeOutline4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Essentials / Home / Outline">
      <Icon20 />
    </div>
  );
}

function Menu4() {
  return (
    <div className="backdrop-blur-[10px] backdrop-filter box-border content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative rounded-[1000px] shrink-0 w-[44px]" data-name="menu 5">
      <EssentialsHomeOutline4 />
    </div>
  );
}

function MenuWrapper() {
  return (
    <div className="basis-0 content-stretch flex grow items-center justify-between min-h-px min-w-px relative shrink-0 w-full z-[2]" data-name="menu-wrapper">
      <Menu />
      <Menu1 />
      <Menu2 />
      <Menu3 />
      <Menu4 />
    </div>
  );
}

function Background() {
  return <div className="absolute bg-white h-[80px] left-0 right-0 rounded-tl-[24px] rounded-tr-[24px] top-0 z-[1]" data-name="Background" />;
}

function Navbar() {
  return (
    <div className="h-[80px] relative shrink-0 w-full z-[3]" data-name="Navbar">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col h-[80px] isolate items-start justify-between px-[32px] py-0 relative w-full">
          <MenuWrapper />
          <Background />
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="bg-white relative shrink-0 w-full z-[2]" data-name="Home-indicator">
      <div className="flex flex-col items-center justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-end pb-[8px] pt-[11px] px-[10px] w-full" />
      </div>
    </div>
  );
}

function NavbarComponent() {
  return (
    <div className="absolute bottom-[-79px] content-stretch flex flex-col isolate items-start left-[694px] w-[375px]" data-name="Navbar-component">
      <Navbar />
      <HomeIndicator />
      <div className="absolute bg-white bottom-[24px] left-0 right-0 rounded-tl-[24px] rounded-tr-[24px] shadow-[0px_1px_82px_0px_rgba(10,14,18,0.1)] top-0 z-[1]" data-name="Shadow" />
    </div>
  );
}

function PersonDetails() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 text-center w-full" data-name="Person Details">
      <p className="font-['Inter_Tight:SemiBold',sans-serif] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-gray-900 w-full">John Doe</p>
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[14px] text-gray-700 w-full">Vice President @ Google</p>
    </div>
  );
}

function ClientInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip relative shrink-0 w-[280px]" data-name="Client Info">
      <div className="relative shrink-0 size-[56px]" data-name="Photo">
        <img alt="" className="block max-w-none size-full" height="56" src={imgPhoto} width="56" />
      </div>
      <PersonDetails />
    </div>
  );
}

function StarIcon() {
  return (
    <div className="h-[23.085px] relative shrink-0 w-[24px]" data-name="Star Icon">
      <div className="absolute inset-[-4.33%_-4.15%_-4.38%_-4.15%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
          <g id="Star Icon">
            <path d={svgPaths.p25805ec0} fill="var(--fill-0, #F8D57E)" id="Vector" stroke="var(--stroke-0, #F8D57E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function StarRating() {
  return (
    <div className="content-stretch flex gap-[5px] items-start relative shrink-0 w-full" data-name="Star Rating">
      {[...Array(5).keys()].map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

function TextStarRating() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-[310px]" data-name="Text & Star Rating">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[#2d2d2d] text-[16px] w-full">Write short, specific quote that highlight benefits, use relatable language, add credibility, and focus on the positive aspects of the product or service.</p>
      <StarRating />
    </div>
  );
}

function TestimonialInfo() {
  return (
    <div className="content-stretch flex gap-[30px] items-center justify-center relative shrink-0" data-name="Testimonial Info">
      <ClientInfo />
      <TextStarRating />
    </div>
  );
}

function TestimonialCard() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[30px] items-center left-[-63px] px-[30px] py-[40px] rounded-[20px] top-[1174px]" data-name="Testimonial Card">
      <div aria-hidden="true" className="absolute border border-[#e5f4f2] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[34.854px_29.626px_48.34px_0px_rgba(51,102,255,0.05)]" />
      <TestimonialInfo />
    </div>
  );
}

function MenuItem21() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 1</p>
    </div>
  );
}

function MenuItem22() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 2</p>
    </div>
  );
}

function MenuItem23() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 3</p>
    </div>
  );
}

function MenuItem24() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 4</p>
    </div>
  );
}

function MenuItem25() {
  return (
    <div className="box-border content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0" data-name="menu item">
      <p className="font-['Inter_Tight:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#313335] text-[14px] text-nowrap whitespace-pre">Menu Item 5</p>
    </div>
  );
}

function MenuItems() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start left-[1335px] top-[1312px]" data-name="Menu Items">
      <MenuItem21 />
      <MenuItem22 />
      <MenuItem23 />
      <MenuItem24 />
      <MenuItem25 />
    </div>
  );
}

export default function ComponentInstances() {
  return (
    <div className="bg-white relative size-full" data-name="Component Instances-2">
      <AppBadges />
      <HeaderNavigation />
      <SideMenu />
      <div className="absolute bottom-0 h-[calc(100%-210px)] left-[357px] pointer-events-none top-[210px]">
        <NavigationBar />
      </div>
      <Alert />
      <Component />
      <BottomSheet />
      <Pagination />
      <DropDown />
      <ComboBox />
      <Loader />
      <Drawer />
      <Search />
      <SegmentedControl />
      <Tag />
      <TextArea />
      <NavbarComponent />
      <TestimonialCard />
      <MenuItems />
    </div>
  );
}