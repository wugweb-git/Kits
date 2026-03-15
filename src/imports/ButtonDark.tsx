import svgPaths from "./svg-uze7llgubc";

function IconsNew() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p34a7f440} fill="var(--fill-0, #DFDFDF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-nowrap text-white">
        <p className="leading-[30px] whitespace-pre">Button</p>
      </div>
    </div>
  );
}

function IconsNew1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p349e1af0} fill="var(--fill-0, #DFDFDF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export default function ButtonDark() {
  return (
    <div className="bg-[#2b2b2b] relative rounded-[12px] size-full" data-name="Button (Dark)">
      <div aria-hidden="true" className="absolute border border-[#444444] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[20px] relative size-full">
          <IconsNew />
          <Container />
          <IconsNew1 />
        </div>
      </div>
    </div>
  );
}