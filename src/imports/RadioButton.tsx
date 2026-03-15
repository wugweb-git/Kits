import svgPaths from "./svg-06tsmfufdw";

function RadioInput() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Radio Input">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Radio Input">
          <circle cx="8" cy="8" fill="var(--fill-0, #FFBE1A)" id="Ellipse 1" r="5" />
          <g id="Input">
            <mask fill="white" id="path-2-inside-1_62_314">
              <path d={svgPaths.p36ca9a00} />
            </mask>
            <path d={svgPaths.p3837fff0} fill="var(--stroke-0, #FFBE1A)" mask="url(#path-2-inside-1_62_314)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function RadioLabel() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="Radio Label">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0b0000] text-[16px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Radio Button</p>
      </div>
    </div>
  );
}

export default function RadioButton() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full" data-name="Radio button">
      <RadioInput />
      <RadioLabel />
    </div>
  );
}