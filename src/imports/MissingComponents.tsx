import svgPaths from "./svg-ov77aqfoog";
import imgAvatar from "figma:asset/f696e50d914cf017f3f0dedc0a291546425bc149.png";
import imgRoundedRectangle from "figma:asset/f9dc26a47e5bf70b8cc0cb58506e6e83ba15efc9.png";

function IconsNew() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d={svgPaths.p9026100} fill="var(--fill-0, #BABABA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <IconsNew />
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#313335] text-[13px]">
        <p className="css-ew64yg leading-[normal]">Placeholder</p>
      </div>
    </div>
  );
}

function IconsNew1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons New">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #BABABA)" strokeLinecap="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function C() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between max-h-[32px] p-[8px] relative rounded-[10px] shrink-0 w-[281px]" data-name="c">
      <div aria-hidden="true" className="absolute border border-[#2b2b2b] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Content />
      <IconsNew1 />
    </div>
  );
}

function Accordians() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[11px] top-[23px] w-[281px]" data-name="Accordians">
      <C />
    </div>
  );
}

function IconsNew2() {
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
      <IconsNew2 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px relative text-[14px] text-white">
        <p className="css-4hzbpn leading-[21px]">Alert title</p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative" data-name="Content">
      <AlertHeader />
      <p className="css-4hzbpn font-['Inter_Tight:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#dfdfdf] text-[14px] w-full">Pull request #9999 merged after a successful build</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p21d6ac00} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Close() {
  return (
    <div className="content-stretch flex items-center overflow-clip p-[4px] relative rounded-[4px] shrink-0" data-name="Close">
      <Icon />
    </div>
  );
}

function Alert() {
  return (
    <div className="absolute bg-white left-[19px] rounded-[8px] top-[92px] w-[432px]" data-name="Alert">
      <div className="content-stretch flex gap-[8px] items-start overflow-clip p-[16px] relative rounded-[inherit] w-full">
        <Content1 />
        <Close />
      </div>
      <div aria-hidden="true" className="absolute border border-[#1a1a1a] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Avatar() {
  return (
    <div className="absolute content-stretch flex items-center left-[28px] top-[203px]" data-name="avatar">
      <div className="relative rounded-[50px] shrink-0 size-[30px]" data-name="avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[50px] size-full" src={imgAvatar} />
      </div>
    </div>
  );
}

function IconMInterfaceSelected() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">Today</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem />
    </div>
  );
}

function IconMInterfaceSelected1() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft1() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">Yesterday</p>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected1 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft1 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall1() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem1 />
    </div>
  );
}

function IconMInterfaceSelected2() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft2() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">This week</p>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected2 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft2 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall2() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem2 />
    </div>
  );
}

function IconMInterfaceSelected3() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft3() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">Last week</p>
      </div>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected3 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft3 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall3() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem3 />
    </div>
  );
}

function IconMInterfaceSelected4() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft4() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">This month</p>
      </div>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected4 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft4 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall4() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem4 />
    </div>
  );
}

function IconMInterfaceSelected5() {
  return <div className="bg-black h-[24px] shrink-0 w-[4px]" data-name="Icon / M / Interface / selected" />;
}

function ListItemIconLeft5() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">Last month</p>
      </div>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected5 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft5 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall5() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem5 />
    </div>
  );
}

function IconMInterfaceSelected6() {
  return (
    <div className="bg-black h-[24px] overflow-clip relative shrink-0 w-[4px]" data-name="Icon / M / Interface / selected">
      <div className="absolute bottom-0 flex items-center justify-center left-0 top-0 w-[4px]">
        <div className="flex-none h-[4px] rotate-[-90deg] w-[24px]">
          <div className="bg-black rounded-bl-[2px] rounded-br-[2px] size-full" data-name="Rectangle 41.1" />
        </div>
      </div>
    </div>
  );
}

function ListItemIconLeft6() {
  return (
    <div className="content-stretch flex h-full items-center overflow-clip relative shrink-0" data-name="List item / icon-left">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white">
        <p className="css-ew64yg leading-[21px]">Custom</p>
      </div>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="List item">
      <IconMInterfaceSelected6 />
      <div className="flex flex-row items-center self-stretch">
        <ListItemIconLeft6 />
      </div>
    </div>
  );
}

function ListItemIconLeftSmall6() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start overflow-clip py-[8px] relative shrink-0 w-[232px]" data-name="List item / icon left small">
      <ListItem6 />
    </div>
  );
}

function MenuList() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[200px]" data-name="Menu List">
      <ListItemIconLeftSmall />
      <ListItemIconLeftSmall1 />
      <ListItemIconLeftSmall2 />
      <ListItemIconLeftSmall3 />
      <ListItemIconLeftSmall4 />
      <ListItemIconLeftSmall5 />
      <ListItemIconLeftSmall6 />
    </div>
  );
}

function MenuBlock() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-name="Menu Block">
      <MenuList />
    </div>
  );
}

function SelectionMenu() {
  return (
    <div className="bg-black content-stretch flex h-[332px] items-start overflow-clip relative shrink-0" data-name="Selection menu">
      <MenuBlock />
    </div>
  );
}

function IconsNew3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d="M15 6L9 12L15 18" id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function DataPickerTitleBar() {
  return (
    <div className="bg-black content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-[202px]" data-name="data picker / title bar">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white w-[220px]">
        <p className="css-4hzbpn leading-[21px]">December 2020</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative size-full" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Vector 1" />
        </g>
      </svg>
    </div>
  );
}

function Component24X24ArrowsChevronLeftStroke() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="24x24 / Arrows / Chevron_left / stroke">
      <div className="absolute flex inset-[16.67%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[16px]">
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function HackForRighPadding() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="hack for righ padding">
      <Component24X24ArrowsChevronLeftStroke />
    </div>
  );
}

function Title() {
  return (
    <div className="bg-black content-stretch flex items-center overflow-clip py-[8px] relative shrink-0" data-name="Title">
      <IconsNew3 />
      <DataPickerTitleBar />
      <HackForRighPadding />
    </div>
  );
}

function RoundedButtonXsManual() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-bl-[100px] rounded-tl-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">M</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual1() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">T</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual2() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">W</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual3() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">T</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual4() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">F</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual5() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">S</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual6() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">S</p>
      </div>
    </div>
  );
}

function MenuList1() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Menu List">
      <RoundedButtonXsManual />
      <RoundedButtonXsManual1 />
      <RoundedButtonXsManual2 />
      <RoundedButtonXsManual3 />
      <RoundedButtonXsManual4 />
      <RoundedButtonXsManual5 />
      <RoundedButtonXsManual6 />
    </div>
  );
}

function RoundedButtonXsManual7() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="css-4hzbpn leading-[18px]">1</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">2</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">3</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">4</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual11() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">5</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">6</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual13() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">7</p>
      </div>
    </div>
  );
}

function MenuList2() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex gap-[4px] items-center overflow-clip relative rounded-bl-[16px] rounded-br-[4px] rounded-tl-[16px] rounded-tr-[4px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual7 />
      <RoundedButtonXsManual8 />
      <RoundedButtonXsManual9 />
      <RoundedButtonXsManual10 />
      <RoundedButtonXsManual11 />
      <RoundedButtonXsManual12 />
      <RoundedButtonXsManual13 />
    </div>
  );
}

function RoundedButtonXsManual14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">8</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual15() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">9</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative rounded-[26px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">10</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual17() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">11</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual18() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">12</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual19() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">13</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual20() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">14</p>
      </div>
    </div>
  );
}

function MenuList3() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex gap-[4px] items-center overflow-clip relative rounded-[4px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual14 />
      <RoundedButtonXsManual15 />
      <RoundedButtonXsManual16 />
      <RoundedButtonXsManual17 />
      <RoundedButtonXsManual18 />
      <RoundedButtonXsManual19 />
      <RoundedButtonXsManual20 />
    </div>
  );
}

function RoundedButtonXsManual21() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">15</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual22() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">16</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual23() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">17</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual24() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">18</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual25() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">19</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual26() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">20</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual27() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">21</p>
      </div>
    </div>
  );
}

function MenuList4() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex gap-[4px] items-center overflow-clip relative rounded-[4px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual21 />
      <RoundedButtonXsManual22 />
      <RoundedButtonXsManual23 />
      <RoundedButtonXsManual24 />
      <RoundedButtonXsManual25 />
      <RoundedButtonXsManual26 />
      <RoundedButtonXsManual27 />
    </div>
  );
}

function RoundedButtonXsManual28() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">22</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual29() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">23</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual30() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">24</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual31() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">25</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual32() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">26</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual33() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">27</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual34() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">28</p>
      </div>
    </div>
  );
}

function MenuList5() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex gap-[4px] items-center overflow-clip relative rounded-[4px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual28 />
      <RoundedButtonXsManual29 />
      <RoundedButtonXsManual30 />
      <RoundedButtonXsManual31 />
      <RoundedButtonXsManual32 />
      <RoundedButtonXsManual33 />
      <RoundedButtonXsManual34 />
    </div>
  );
}

function RoundedButtonXsManual35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">29</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">30</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual37() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center w-full">
        <p className="css-4hzbpn leading-[18px]">31</p>
      </div>
    </div>
  );
}

function MenuList6() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex gap-[4px] items-center overflow-clip relative rounded-bl-[4px] rounded-br-[16px] rounded-tl-[4px] rounded-tr-[16px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual35 />
      <RoundedButtonXsManual36 />
      <RoundedButtonXsManual37 />
    </div>
  );
}

function DateRangePicker() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0" data-name="date range picker">
      <MenuList1 />
      <MenuList2 />
      <MenuList3 />
      <MenuList4 />
      <MenuList5 />
      <MenuList6 />
    </div>
  );
}

function DatePicker() {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[8px] items-center overflow-clip relative shrink-0" data-name="date picker">
      <Title />
      <DateRangePicker />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative size-full" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Vector 1" />
        </g>
      </svg>
    </div>
  );
}

function Component24X24ArrowsChevronLeftStroke1() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="24x24 / Arrows / Chevron_left / stroke">
      <div className="absolute flex inset-[16.67%] items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[16px]">
          <Icon2 />
        </div>
      </div>
    </div>
  );
}

function HackForLeftPadding() {
  return (
    <div className="relative size-[24px]" data-name="hack for left padding">
      <Component24X24ArrowsChevronLeftStroke1 />
    </div>
  );
}

function DataPickerTitleBar1() {
  return (
    <div className="bg-black content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-name="data picker / title bar">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white w-[220px]">
        <p className="css-4hzbpn leading-[21px]">January 2020</p>
      </div>
    </div>
  );
}

function IconsNew4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d="M9 18L15 12L9 6" id="Vector" stroke="var(--stroke-0, #444444)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Title1() {
  return (
    <div className="bg-black content-stretch flex items-center overflow-clip py-[8px] relative shrink-0" data-name="Title">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <HackForLeftPadding />
        </div>
      </div>
      <DataPickerTitleBar1 />
      <IconsNew4 />
    </div>
  );
}

function RoundedButtonXsManual38() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-bl-[100px] rounded-tl-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">M</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual39() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">T</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual40() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">W</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual41() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">T</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual42() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">F</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual43() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">S</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual44() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#444] text-[12px] text-center w-full">
        <p className="css-4hzbpn leading-[18px]">S</p>
      </div>
    </div>
  );
}

function MenuList7() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Menu List">
      <RoundedButtonXsManual38 />
      <RoundedButtonXsManual39 />
      <RoundedButtonXsManual40 />
      <RoundedButtonXsManual41 />
      <RoundedButtonXsManual42 />
      <RoundedButtonXsManual43 />
      <RoundedButtonXsManual44 />
    </div>
  );
}

function RoundedButtonXsManual45() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">1</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual46() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">2</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual47() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">3</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual48() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">4</p>
      </div>
    </div>
  );
}

function MenuList8() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative rounded-bl-[16px] rounded-tl-[16px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual45 />
      <RoundedButtonXsManual46 />
      <RoundedButtonXsManual47 />
      <RoundedButtonXsManual48 />
    </div>
  );
}

function RoundedButtonXsManual49() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">5</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual50() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">6</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual51() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[26px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">7</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual52() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">8</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual53() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">9</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual54() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">10</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual55() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">11</p>
      </div>
    </div>
  );
}

function MenuList9() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Menu List">
      <RoundedButtonXsManual49 />
      <RoundedButtonXsManual50 />
      <RoundedButtonXsManual51 />
      <RoundedButtonXsManual52 />
      <RoundedButtonXsManual53 />
      <RoundedButtonXsManual54 />
      <RoundedButtonXsManual55 />
    </div>
  );
}

function RoundedButtonXsManual56() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">12</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual57() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">13</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual58() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">14</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual59() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">15</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual60() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">16</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual61() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">17</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual62() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">18</p>
      </div>
    </div>
  );
}

function MenuList10() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Menu List">
      <RoundedButtonXsManual56 />
      <RoundedButtonXsManual57 />
      <RoundedButtonXsManual58 />
      <RoundedButtonXsManual59 />
      <RoundedButtonXsManual60 />
      <RoundedButtonXsManual61 />
      <RoundedButtonXsManual62 />
    </div>
  );
}

function RoundedButtonXsManual63() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[55px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">19</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual64() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">20</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual65() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">21</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual66() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">22</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual67() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">23</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual68() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">24</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual69() {
  return (
    <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[8px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">25</p>
      </div>
    </div>
  );
}

function MenuList11() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-name="Menu List">
      <RoundedButtonXsManual63 />
      <RoundedButtonXsManual64 />
      <RoundedButtonXsManual65 />
      <RoundedButtonXsManual66 />
      <RoundedButtonXsManual67 />
      <RoundedButtonXsManual68 />
      <RoundedButtonXsManual69 />
    </div>
  );
}

function RoundedButtonXsManual70() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">26</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual71() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">27</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual72() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">28</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual73() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">29</p>
      </div>
    </div>
  );
}

function RoundedButtonXsManual74() {
  return (
    <div className="bg-black content-stretch flex flex-col items-start p-[8px] relative rounded-[100px] shrink-0 w-[32px]" data-name="Rounded Button / XS / Manual">
      <div className="flex flex-col font-['Inter_Tight:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white w-full">
        <p className="css-4hzbpn leading-[18px]">30</p>
      </div>
    </div>
  );
}

function MenuList12() {
  return (
    <div className="bg-black content-stretch flex gap-[4px] items-center overflow-clip relative rounded-br-[16px] rounded-tr-[16px] shrink-0" data-name="Menu List">
      <RoundedButtonXsManual70 />
      <RoundedButtonXsManual71 />
      <RoundedButtonXsManual72 />
      <RoundedButtonXsManual73 />
      <RoundedButtonXsManual74 />
    </div>
  );
}

function DateRangePicker1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0" data-name="date range picker">
      <MenuList7 />
      <MenuList8 />
      <MenuList9 />
      <MenuList10 />
      <MenuList11 />
      <MenuList12 />
    </div>
  );
}

function DatePicker1() {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[8px] items-center overflow-clip relative shrink-0" data-name="date picker">
      <Title1 />
      <DateRangePicker1 />
    </div>
  );
}

function Calendar() {
  return (
    <div className="bg-black content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-name="Calendar">
      <DatePicker />
      <DatePicker1 />
    </div>
  );
}

function IconsNew5() {
  return <div className="rounded-[4px] shrink-0 size-[16px]" data-name="Icons New" />;
}

function Container() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-black">
        <p className="css-ew64yg leading-[21px]">Apply</p>
      </div>
    </div>
  );
}

function IconsNew6() {
  return <div className="shrink-0 size-[16px]" data-name="Icons New" />;
}

function ButtonDarkSmDefaultPrimaryDefaultDark() {
  return (
    <div className="bg-[#dfdfdf] content-stretch flex gap-[4px] h-[38px] items-center p-[8px] relative rounded-[6px] shrink-0" data-name="Button (Dark)/sm/Default/Primary/Default/Dark">
      <div aria-hidden="true" className="absolute border border-[#bababa] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <IconsNew5 />
      <Container />
      <IconsNew6 />
    </div>
  );
}

function Picker() {
  return (
    <div className="bg-black content-stretch flex flex-col gap-[16px] items-end overflow-clip relative shrink-0" data-name="Picker">
      <Calendar />
      <ButtonDarkSmDefaultPrimaryDefaultDark />
    </div>
  );
}

function Calender() {
  return (
    <div className="absolute bg-black content-stretch flex gap-[16px] items-center left-[27px] overflow-clip p-[8px] rounded-[24px] top-[270px]" data-name="Calender">
      <SelectionMenu />
      <Picker />
    </div>
  );
}

function ImageRounded() {
  return (
    <div className="col-1 h-[200px] ml-0 mt-0 relative row-1 w-[334px]" data-name="image/rounded">
      <div className="absolute inset-0 rounded-[16px]" data-name="Rounded Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgRoundedRectangle} />
      </div>
    </div>
  );
}

function ContentText() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-name="Content text">
      <div className="flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#16192c] text-[18px] w-[302px]">
        <p className="css-4hzbpn leading-[24px]">Headline</p>
      </div>
      <p className="css-4hzbpn font-['Inter_Tight:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#191919] text-[14px] w-[302px]">{`Write an amazing description in this dedicated card section. Each word counts. `}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center overflow-clip px-[4px] py-[2px] relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] text-center text-white">
        <p className="css-ew64yg leading-[normal]">Complete</p>
      </div>
    </div>
  );
}

function ButtonXsDefaultPrimaryNo() {
  return (
    <div className="bg-[#191919] h-[24px] relative rounded-[4px] shrink-0 w-full" data-name="Button/XS/Default/Primary/No">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[4px] py-[3px] relative size-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function XButton() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-button">
      <ButtonXsDefaultPrimaryNo />
    </div>
  );
}

function Frame() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[24px] items-start ml-[16px] mt-[224px] relative row-1">
      <ContentText />
      <XButton />
    </div>
  );
}

function Content2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0" data-name="Content">
      <ImageRounded />
      <Frame />
    </div>
  );
}

function CardImage() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-center justify-center left-[827px] overflow-clip pb-[24px] pt-[8px] px-[8px] rounded-[16px] shadow-[0px_0px_1px_0px_rgba(12,26,75,0.24),0px_3px_8px_-1px_rgba(50,50,71,0.05)] top-[47px]" data-name="card-image/1">
      <Content2 />
    </div>
  );
}

function HeaderTextContainer() {
  return (
    <div className="flex-[1_0_0] grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] min-h-px min-w-px relative" data-name="Header Text Container">
      <p className="col-1 css-4hzbpn font-['Inter_Tight:SemiBold',sans-serif] font-semibold leading-[20px] ml-0 mt-0 relative row-1 text-[14px] text-black w-[278px]">@peduarte stared 3 repositories</p>
    </div>
  );
}

function IconChevronsDownUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="icon/chevrons-down-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="icon/chevrons-down-up">
          <path d={svgPaths.p327f4380} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p390962c0} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[6px] shrink-0" data-name="Button">
      <IconChevronsDownUp />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[16px] relative shrink-0 w-[350px]" data-name="Header">
      <HeaderTextContainer />
      <Button />
    </div>
  );
}

function Field() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[12px] pr-[56px] py-[8px] relative w-full">
          <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-black">@radix-ui/primitives</p>
        </div>
      </div>
    </div>
  );
}

function Default() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="default">
      <Field />
    </div>
  );
}

function InputWithButton() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="input/with button">
      <Default />
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[350px]" data-name="input">
      <InputWithButton />
    </div>
  );
}

function Field1() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[12px] pr-[56px] py-[8px] relative w-full">
          <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-black">@radix-ui/colors</p>
        </div>
      </div>
    </div>
  );
}

function Default1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="default">
      <Field1 />
    </div>
  );
}

function InputWithButton1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="input/with button">
      <Default1 />
    </div>
  );
}

function Input1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[350px]" data-name="input">
      <InputWithButton1 />
    </div>
  );
}

function Field2() {
  return (
    <div className="bg-white relative rounded-[6px] shrink-0 w-full" data-name="field">
      <div aria-hidden="true" className="absolute border border-[#dfdfdf] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[12px] pr-[56px] py-[8px] relative w-full">
          <p className="css-ew64yg font-['Inter_Tight:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-black">@stitches/react</p>
        </div>
      </div>
    </div>
  );
}

function Default2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="default">
      <Field2 />
    </div>
  );
}

function InputWithButton2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="input/with button">
      <Default2 />
    </div>
  );
}

function Input2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[350px]" data-name="input">
      <InputWithButton2 />
    </div>
  );
}

function CollapsibleOpen() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[1271px] top-[75px]" data-name="collapsible/open">
      <Header />
      <Input />
      <Input1 />
      <Input2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#1a1a1a] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[8px]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:Regular',sans-serif] font-normal h-[64px] justify-center leading-[0] min-h-px min-w-px relative text-[#a3a3a3] text-[14px] text-center">
            <p className="css-4hzbpn leading-[20px]">REPLACE WITH YOUR CONENT COMPONENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="bg-[#1a1a1a] content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative w-full" data-name="Placeholder">
      <Container1 />
    </div>
  );
}

function Drawer() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex flex-col h-[842px] items-start left-[1670px] p-[4px] rounded-[8px] top-[37px] w-[448px]" data-name="Drawer">
      <Placeholder />
    </div>
  );
}

function Title2() {
  return (
    <div className="absolute content-stretch flex h-[72px] items-center left-[40px] top-[40px] w-[1200px]" data-name="Title">
      <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:Bold',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px relative text-[60px] text-black">
        <p className="css-4hzbpn leading-[72px]">Ready to start a project?</p>
      </div>
    </div>
  );
}

function Subtitle() {
  return (
    <div className="content-start flex flex-[1_0_0] flex-wrap gap-[10px] items-start min-h-px min-w-[300px] relative" data-name="Subtitle">
      <div className="flex flex-[1_0_0] flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[30px] min-h-px min-w-px relative text-[20px] text-black">
        <p className="css-4hzbpn mb-0">{`Want to learn more, or interested in working together? `}</p>
        <p className="css-4hzbpn">Provide us with a brief description of what you are going to build.</p>
      </div>
    </div>
  );
}

function IconsNew7() {
  return <div className="shrink-0 size-[24px]" data-name="Icons New" />;
}

function Container2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-black">
        <p className="css-ew64yg leading-[30px]">Lets Talk</p>
      </div>
    </div>
  );
}

function IconsNew8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p349e1af0} fill="var(--fill-0, #2B2B2B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonDarkXlDefaultPrimaryDefaultDark() {
  return (
    <div className="bg-[#dfdfdf] h-[70px] relative rounded-[12px] shrink-0 w-full" data-name="Button (Dark)/xl/Default/Primary/Default/Dark">
      <div aria-hidden="true" className="absolute border border-[#bababa] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center p-[20px] relative size-full">
          <IconsNew7 />
          <Container2 />
          <IconsNew8 />
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[150px]" data-name="Button">
      <ButtonDarkXlDefaultPrimaryDefaultDark />
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Button Container">
      <Button1 />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute content-center flex flex-wrap gap-[24px] items-center left-[40px] min-w-[300px] top-[212px] w-[1200px]" data-name="Form">
      <Subtitle />
      <ButtonContainer />
    </div>
  );
}

function Form1() {
  return (
    <div className="absolute bg-[#ffbe1a] h-[312px] left-[2152px] min-w-[768px] rounded-[20px] top-[101px] w-[1280px]" data-name="Form 4">
      <Title2 />
      <Form />
    </div>
  );
}

export default function MissingComponents() {
  return (
    <div className="bg-white relative size-full" data-name="Missing Components">
      <Accordians />
      <Alert />
      <Avatar />
      <Calender />
      <CardImage />
      <CollapsibleOpen />
      <Drawer />
      <Form1 />
    </div>
  );
}