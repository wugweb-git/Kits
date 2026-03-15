import svgPaths from "./svg-u5cmz8oyto";
import imgBottom from "figma:asset/f74093c82e0ebc8a763f5aa1b28cb70db79a2621.png";

function Group() {
  return (
    <div className="absolute contents inset-[34.11%_28.73%_33.38%_29.65%]">
      <div className="absolute flex inset-[47.06%_51.33%_33.53%_29.65%] items-center justify-center">
        <div className="flex-none h-[2.639px] rotate-[45.599deg] skew-x-[1.198deg] w-[7.687px]">
          <div className="bg-[#ecedee] rounded-[2.838px] size-full" />
        </div>
      </div>
      <div className="absolute flex inset-[34.11%_28.73%_33.38%_39.42%] items-center justify-center">
        <div className="flex-none h-[2.639px] rotate-[134.401deg] skew-x-[358.802deg] w-[14.654px]">
          <div className="bg-[#ecedee] rounded-[2.838px] size-full" />
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[-3.57%_-4.46%_-4.46%_-3.57%]">
      <div className="absolute inset-[-3.57%_-4.46%_-4.46%_-3.57%]">
        <div className="absolute inset-[4.53%_4.31%_3.92%_4.31%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.5168 37.5851">
            <g filter="url(#filter0_ii_132_2372)" id="Star 7">
              <path d={svgPaths.p1e0aef00} fill="var(--fill-0, #D9DBDD)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="43.0136" id="filter0_ii_132_2372" width="44.3025" x="-4.07143" y="-2.71429">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.71429" dy="2.71429" />
                <feGaussianBlur stdDeviation="3.05357" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 0 0.887695 0 0 0 1 0" />
                <feBlend in2="shape" mode="normal" result="effect1_innerShadow_132_2372" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-4.07143" dy="-2.71429" />
                <feGaussianBlur stdDeviation="3.39286" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0 0.829362 0 0 0 0.5 0" />
                <feBlend in2="effect1_innerShadow_132_2372" mode="normal" result="effect2_innerShadow_132_2372" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Group />
      <div className="absolute inset-[14.34%_13.79%_13.47%_14.78%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.1429 27.4321">
          <path d={svgPaths.p39e5bf00} fill="var(--fill-0, #ECEDEE)" id="Ellipse 12" />
        </svg>
      </div>
    </div>
  );
}

function TopicTileMedallionsNotStarted() {
  return (
    <div className="relative shrink-0 size-[38px]" data-name="Topic Tile Medallions /Not Started">
      <Group1 />
    </div>
  );
}

function LibraryTopicProgressWCerts() {
  return (
    <div className="absolute content-stretch flex items-start left-[204px] top-[178px]" data-name="library-topic-progress (w/certs)">
      <TopicTileMedallionsNotStarted />
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
          <clipPath id="bgblur_0_133_2951_clip_path" transform="translate(50 50)">
            <path d="M0 0H256V230H0V0Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute h-[94px] left-1/2 rounded-[12px] top-[calc(50%-53px)] translate-x-[-50%] translate-y-[-50%] w-[226px]" data-name="Artwork">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgBottom} />
      </div>
      <LibraryTopicProgressWCerts />
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

export default function TopicTileDesktop() {
  return (
    <div className="relative size-full" data-name="Topic Tile (desktop)">
      <Bottom />
      <Text />
      <Progress />
    </div>
  );
}