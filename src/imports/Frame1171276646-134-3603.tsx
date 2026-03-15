import svgPaths from "./svg-wposm5d7bh";
import imgBottom from "figma:asset/f74093c82e0ebc8a763f5aa1b28cb70db79a2621.png";

function LibraryTopicProgressNoCerts() {
  return (
    <div className="absolute left-[204px] size-[35.286px] top-[178px]" data-name="library-topic-progress (no certs)">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.2857 35.2857">
        <g id="library-topic-progress (no certs)">
          <g id="Non-Cert Progress">
            <g id="Wheel">
              <path d={svgPaths.p374d3500} fill="var(--fill-0, black)" fillOpacity="0.5" id="Full Circle (10%)" />
            </g>
            <path d={svgPaths.p1ed008f0} fill="var(--fill-0, black)" fillOpacity="0.7" id="Vector" />
          </g>
          <path d={svgPaths.p22be1f80} fill="var(--fill-0, black)" fillOpacity="0.7" id="Full Circle (10%)_2" />
        </g>
      </svg>
    </div>
  );
}

function Bottom() {
  return (
    <div className="absolute inset-0 overflow-clip rounded-[12px]" data-name="Bottom">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBottom} />
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 256 230">
        <path d="M0 0H256V230H0V0Z" data-figma-bg-blur-radius="50" fill="var(--fill-0, white)" id="Blur" />
        <defs>
          <clipPath id="bgblur_0_134_3607_clip_path" transform="translate(50 50)">
            <path d="M0 0H256V230H0V0Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute h-[94px] left-1/2 rounded-[12px] top-[calc(50%-53px)] translate-x-[-50%] translate-y-[-50%] w-[226px]" data-name="Artwork">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBottom} />
      </div>
      <LibraryTopicProgressNoCerts />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute bottom-[23.48%] contents left-[16px] top-[52.17%]" data-name="Text">
      <p className="absolute bottom-[110px] css-4hzbpn font-['Inter_Tight:SemiBold',sans-serif] font-semibold leading-[28px] left-[16px] text-[#bababa] text-[18px] translate-y-[100%] w-[215px]">A Topic Name That Is Two Lines</p>
    </div>
  );
}

function Progress() {
  return (
    <div className="absolute contents inset-[86.09%_41.88%_6.91%_6.25%]" data-name="Progress">
      <p className="absolute css-4hzbpn font-['Inter_Tight:Regular',sans-serif] font-normal inset-[86.09%_41.88%_6.91%_6.25%] leading-[21px] opacity-70 text-[#7d7d7d] text-[14px]">80% Complete</p>
    </div>
  );
}

function TopicTileDesktop() {
  return (
    <div className="absolute h-[230px] left-[60px] top-[31px] w-[256px]" data-name="Topic Tile (desktop)">
      <Bottom />
      <Text />
      <Progress />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <TopicTileDesktop />
    </div>
  );
}