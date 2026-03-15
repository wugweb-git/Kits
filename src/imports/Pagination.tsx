import svgPaths from "./svg-ctj8qc7l4z";

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

export default function Pagination() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="Pagination">
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