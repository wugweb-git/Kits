import svgPaths from "./svg-mr2z6t7ryd";

export default function Embed() {
  return (
    <div className="bg-[#080101] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[10px] size-full" data-name="Embed">
      <div className="flex flex-col font-['Inter_Tight:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">
        <p className="leading-[28px] whitespace-pre">{`Empowered  by`}</p>
      </div>
      <div className="content-stretch flex flex-col items-center justify-center py-[4px] relative shrink-0" data-name="Wugweb Logo">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
          <div className="col-1 h-[25.222px] ml-0 mt-0 relative row-1 w-[100px]" data-name="Logo Full">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 25.222">
              <g clipPath="url(#clip0_213_634)" id="Logo Full">
                <path d={svgPaths.p25a60500} fill="var(--fill-0, white)" id="b" />
                <path d={svgPaths.p237b9b80} fill="var(--fill-0, white)" id="c" />
                <path d={svgPaths.pf635f00} fill="var(--fill-0, #C9C9C9)" id="d" />
                <path d={svgPaths.p1eebb380} fill="var(--fill-0, #C9C9C9)" id="Vector" />
                <path d={svgPaths.p388d8d00} fill="var(--fill-0, white)" id="Vector_2" />
                <path d={svgPaths.p33f10b00} fill="var(--fill-0, #C9C9C9)" id="Vector_3" />
              </g>
              <defs>
                <clipPath id="clip0_213_634">
                  <rect fill="white" height="25.222" width="100" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}