import svgPaths from "./svg-x1paahvyat";

function IconsNew() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p34a7f440} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-white">
        <p className="css-ew64yg leading-[30px]">Button</p>
      </div>
    </div>
  );
}

function IconsNew1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons New">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons New">
          <path d={svgPaths.p349e1af0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonDark() {
  return (
    <div className="absolute bg-[#1a1a1a] content-stretch flex gap-[8px] h-[70px] items-center justify-center left-[47px] p-[20px] rounded-[12px] top-[30px] w-[157px]" data-name="Button (Dark)">
      <div aria-hidden="true" className="absolute border border-[#444] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconsNew />
      <Container />
      <IconsNew1 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <ButtonDark />
    </div>
  );
}