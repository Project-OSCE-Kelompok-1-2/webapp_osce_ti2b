import React from "react";
import { CopyRight } from "./CopyRight";
import { Icon } from "./Icon";
import { PropertyBack } from "./PropertyBack";
import { PropertySave } from "./PropertySave";
import { PropertyTrash } from "./PropertyTrash";
import line2 from "./line-2.svg";

export const Frame = () => {
  return (
    <div className="grid grid-cols-1 grid-rows-[76.00px_minmax(0,1fr)_55.00px] w-[1440px] h-[1023px] gap-2.5 p-6 relative">
      <div className="relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white">
        <CopyRight
          className="!self-stretch !h-[54.33px] ![display:unset] !left-[unset] !w-full !top-[unset]"
          divClassName="!mt-[0.7px] !text-black"
          frameClassName="!w-[1392px]"
          groupClassName="!h-full !flex-[unset] !w-full"
        />
      </div>

      <div className="relative row-[1_/_2] col-[1_/_2] w-full h-fit flex flex-col items-start gap-5 bg-white">
        <div className="flex items-center gap-[13px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex w-[54px] h-[54px] items-center justify-center gap-[13px] p-3 relative bg-primary rounded-xl border border-solid border-black aspect-[1]">
            <PropertyBack className="!h-[29px] bg-[url(/vector-2.svg)] !left-[unset] !w-7 !top-[unset]" />
          </div>

          <div className="relative flex-1 grow h-[54px]">
            <div className="w-full h-full flex items-center bg-white rounded-xl overflow-hidden border border-solid border-black">
              <p className="h-6 ml-5 w-[540px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                OSCE \ OSCE Radiologi 01-A \ Jadwal Sesi \ Tambah Sesi
              </p>
            </div>
          </div>
        </div>

        <img
          className="relative self-stretch w-full h-px"
          alt="Line"
          src={line2}
        />
      </div>

      <div className="relative row-[2_/_3] col-[1_/_2] w-full h-full flex flex-col items-center justify-center gap-2.5 p-2.5 bg-white">
        <div className="grid grid-cols-1 grid-rows-[114.00px_minmax(0,1fr)_101.00px] w-[544px] h-[405px] gap-2.5 relative top-[210px] left-[424px] rounded-xl overflow-hidden border border-solid border-black">
          <div className="relative row-[1_/_2] col-[1_/_2] w-full h-full flex flex-col items-center justify-center gap-2.5 p-5 bg-[#2c2c2c] rounded-[12px_12px_0px_0px]">
            <div className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-white text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
              Form jadwal Ujian
            </div>

            <p className="relative w-[441.36px] h-[26.74px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#ffffff80] text-[13px] text-center tracking-[0] leading-[normal]">
              Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>

          <div className="relative row-[3_/_4] col-[1_/_2] w-full h-full flex items-end justify-center gap-4 p-6">
            <div className="flex items-center gap-[15px] relative flex-1 grow">
              <div className="flex h-12 items-center justify-center gap-2.5 px-3 py-0 relative flex-1 grow bg-primary rounded-xl overflow-hidden">
                <PropertySave />
                <div className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-white text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
                  Submit
                </div>
              </div>

              <div className="flex flex-col w-12 h-12 items-center justify-center gap-2.5 relative bg-warning rounded-xl aspect-[1]">
                <PropertyTrash className="!h-5 bg-[url(/vector-3.svg)] !left-[unset] !w-[17px] !top-[unset]" />
              </div>
            </div>
          </div>

          <div className="relative row-[2_/_3] col-[1_/_2] w-full h-full flex flex-col items-start gap-2.5 p-6">
            <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-start gap-4 relative flex-1 grow">
                <div className="flex flex-col items-start gap-[3px] relative flex-1 grow">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xs tracking-[0] leading-[normal]">
                    Jadwal mulai
                  </div>

                  <div className="flex h-[54px] items-center justify-end gap-[13px] p-3 relative self-stretch w-full bg-white rounded-xl border border-solid border-black">
                    <div className="relative flex-1 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-[15.4px] tracking-[0] leading-[normal]">
                      Fri 01-01-2025
                    </div>

                    <Icon className="!relative !w-[19px] !h-[19px] !aspect-[1]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
