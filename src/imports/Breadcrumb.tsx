function Component1stItem() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="1st-item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">Home</p>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[10px] items-center overflow-clip px-[8px] py-0 relative shrink-0" data-name="Separator">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191919] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">/</p>
      </div>
    </div>
  );
}

function LastItem() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="last-item">
      <div className="flex flex-col font-['Inter_Tight:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#313335] text-[14px] text-nowrap">
        <p className="leading-[16px] whitespace-pre">An Application</p>
      </div>
    </div>
  );
}

export default function Breadcrumb() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="Breadcrumb">
      <Component1stItem />
      <Separator />
      <LastItem />
    </div>
  );
}