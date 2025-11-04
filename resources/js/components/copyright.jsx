export default function OsCopyright({ children, className = "" }) {

    return (
        <footer className="relative row-[3_/_4] col-[1_/_2] w-full h-full flex flex-col items-center justify-end bg-white p-4 rounded-xl border-os-1 border-os-black">
          <div className="relative self-stretch w-full">
            <div className="w-full h-full flex">
              <div className="flex-1 flex items-center">
                <p className=" text-os-regular opacity-os-alpha-75 text-base tracking-[0] leading-[normal] whitespace-nowrap">
                  Copyright Porem ipsum dolor sit amet
                </p>
              </div>
            </div>
          </div>
        </footer>
    );
}
