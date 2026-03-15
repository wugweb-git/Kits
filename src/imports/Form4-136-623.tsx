import svgPaths from "./svg-ch0zulm78p";

function Title() {
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

function IconsNew() {
  return <div className="shrink-0 size-[24px]" data-name="Icons New" />;
}

function Container() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Inter_Tight:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-black">
        <p className="css-ew64yg leading-[30px]">Lets Talk</p>
      </div>
    </div>
  );
}

function IconsNew1() {
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
          <IconsNew />
          <Container />
          <IconsNew1 />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[150px]" data-name="Button">
      <ButtonDarkXlDefaultPrimaryDefaultDark />
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Button Container">
      <Button />
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

export default function Form1() {
  return (
    <div className="bg-[#ffbe1a] relative rounded-[20px] size-full" data-name="Form 4">
      <Title />
      <Form />
    </div>
  );
}