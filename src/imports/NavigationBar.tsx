import svgPaths from "./svg-8u8p2vd9em";

function LogoFull() {
  return (
    <div className="[grid-area:1_/_1] h-[25.222px] ml-0 mt-0 relative w-[100px]" data-name="Logo Full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 26">
        <g clipPath="url(#clip0_83_2648)" id="Logo Full">
          <path d={svgPaths.p25a60500} fill="var(--fill-0, white)" id="b" />
          <path d={svgPaths.p237b9b80} fill="var(--fill-0, white)" id="c" />
          <path d={svgPaths.pf635f00} fill="var(--fill-0, #C9C9C9)" id="d" />
          <path d={svgPaths.p1eebb380} fill="var(--fill-0, #C9C9C9)" id="Vector" />
          <path d={svgPaths.p388d8d00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p33f10b00} fill="var(--fill-0, #C9C9C9)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_83_2648">
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
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center px-0 py-[4px] relative rounded-[10px] shrink-0" data-name="Wugweb Logo">
      <Container />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center relative shrink-0 w-[120px]" data-name="Logo">
      <WugwebLogo />
    </div>
  );
}

function Frame() {
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
      <Frame />
    </div>
  );
}

function Frame1() {
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
      <Frame1 />
    </div>
  );
}

function Frame2() {
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
      <Frame2 />
    </div>
  );
}

function Frame3() {
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
      <Frame3 />
    </div>
  );
}

function Frame4() {
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
      <Frame4 />
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

function Frame5() {
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
        <div className="box-border content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Logo />
          <MenuLinks />
        </div>
      </div>
    </div>
  );
}

export default function NavigationBar() {
  return (
    <div className="relative size-full" data-name="Navigation Bar">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[40px] py-[10px] relative size-full">
          <FloatingHeader />
        </div>
      </div>
    </div>
  );
}