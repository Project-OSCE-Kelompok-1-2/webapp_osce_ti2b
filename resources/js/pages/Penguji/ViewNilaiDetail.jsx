import React, {useState} from "react";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	const [input2, onChangeInput2] = useState('');
	const [input3, onChangeInput3] = useState('');
	return (
		<div className="items-start bg-white">
			<div className="flex flex-col items-start bg-white w-[1440px]">
				<div className="flex flex-col self-stretch bg-white pb-0.5 mt-6 mb-2.5 mx-6 gap-5">
					<div className="flex items-start self-stretch gap-[13px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/mvu5av4h_expires_30_days.png"} 
							className="w-[54px] h-[54px] object-fill"
						/>
						<input
							placeholder={"OSCE / OSCE Radiologi 01-A / Detail OSCE/Detail Stase/ Penilaian Stase/Lihat Penilaian"}
							value={input1}
							onChange={(event)=>onChangeInput1(event.target.value)}
							className="text-black bg-white text-xl w-[1324px] py-[15px] px-[19px] rounded-xl border border-solid border-black"
						/>
					</div>
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/0myi0jkh_expires_30_days.png"} 
						className="self-stretch h-[1px] object-fill"
					/>
				</div>
				<div className="flex items-center self-stretch py-3 pl-5 mb-3 mx-[53px] rounded-xl border border-solid border-black">
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/9934ah6y_expires_30_days.png"} 
						className="w-[85px] h-[85px] mr-[17px] object-fill"
					/>
					<div className="w-[177px] mr-[291px]">
						<div className="flex flex-col items-center self-stretch mb-[17px] mx-[1px]">
							<span className="text-black text-sm" >
								{"Nama : Putri Levina Agatha"}
							</span>
						</div>
						<div className="flex flex-col items-center self-stretch mb-5 ml-[1px] mr-[26px]">
							<span className="text-black text-sm" >
								{"NIM: 12345689012345"}
							</span>
						</div>
						<div className="flex flex-col items-center self-stretch mr-[37px]">
							<span className="text-black text-sm" >
								{"Jurusan : Kedokteran"}
							</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-start pb-[1px] mb-3 ml-[53px]">
					<span className="text-black text-xl" >
						{"Penilaian Stase"}
					</span>
				</div>
				<div className="flex items-start self-stretch bg-white py-[5px] px-3 mb-3 ml-[53px] mr-[65px] gap-2.5 rounded-xl border border-solid border-black">
					<div className="flex flex-col items-start w-[51px] py-[11px] px-4">
						<span className="text-black text-[15px]" >
							{"No"}
						</span>
					</div>
					<div className="flex flex-col items-start w-[523px] py-[11px] px-[206px]">
						<span className="text-black text-[15px]" >
							{"Aspek Penilaian"}
						</span>
					</div>
					<div className="flex flex-col items-start w-[292px] py-[11px] px-[130px]">
						<span className="text-black text-[15px]" >
							{"Skor"}
						</span>
					</div>
					<div className="flex flex-col items-start w-[206px] py-[11px] px-[83px]">
						<span className="text-black text-[15px]" >
							{"Bobot"}
						</span>
					</div>
					<div className="flex flex-col items-start w-[186px] py-[11px] px-[79px]">
						<span className="text-black text-[15px]" >
							{"Nilai"}
						</span>
					</div>
				</div>
				<div className="flex flex-col self-stretch p-2.5 mx-[53px] gap-2.5" 
					style={{
						boxShadow: "0px 4px 4px #00000040"
					}}>
					<div className="flex flex-col items-start self-stretch bg-white py-4 px-3 rounded-xl border border-solid border-black">
						<span className="text-black text-[15px] font-bold" >
							{"A. Persiapan"}
						</span>
					</div>
					<div className="flex items-center self-stretch bg-white rounded-xl">
						<div className="flex flex-col items-start w-[52px] py-[30px] pl-3 mr-2.5">
							<span className="text-black text-[22px]" >
								{"1"}
							</span>
						</div>
						<div className="w-[9px] py-[13px] mr-2.5">
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<span className="text-black text-[15px]" >
							{"Verifikasi"}
						</span>
						<div className="flex-1 self-stretch">
						</div>
						<div className="w-0.5 py-[13px] mr-3.5">
							<div className="self-stretch h-[61px]">
							</div>
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<div className="flex items-start w-[274px] p-2.5 mr-3.5 gap-[26px]">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/sw54ew2e_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/elvdewr4_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/lny2i3gm_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/s8kgbp25_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/de1nbm1p_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
						</div>
						<div className="w-[1px] py-[13px] mr-2.5">
							<div className="self-stretch h-[61px]">
							</div>
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<div className="flex flex-col items-start w-[195px] py-[35px] px-[93px] mr-2.5">
							<span className="text-black text-[15px]" >
								{"3"}
							</span>
						</div>
						<div className="w-0.5 py-[13px] mr-2.5">
							<div className="self-stretch h-[61px]">
							</div>
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<div className="flex flex-col items-start w-[195px] py-[35px] px-[89px]">
							<span className="text-black text-[15px] font-bold" >
								{"12"}
							</span>
						</div>
					</div>
					<div className="flex items-center self-stretch bg-[#D9D9D9] rounded-xl">
						<div className="flex flex-col items-start w-[52px] py-[30px] pl-3 mr-2.5">
							<span className="text-black text-[22px]" >
								{"2"}
							</span>
						</div>
						<div className="w-[9px] py-[13px] mr-2.5">
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<span className="text-black text-[15px]" >
							{"Menyiapkan Alat"}
						</span>
						<div className="flex-1 self-stretch">
						</div>
						<div className="w-0.5 py-[13px] mr-2.5">
							<div className="self-stretch h-[61px]">
							</div>
							<div className="self-stretch bg-[#00000080] h-[61px]">
							</div>
						</div>
						<div className="flex items-start w-[282px] py-6 px-3.5 mr-2.5 gap-[26px]">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/qtthyr7r_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/7kljc0cr_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/fxmmc5xe_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/64llh4le_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/5sbalie4_expires_30_days.png"} 
								className="w-[30px] h-10 object-fill"
							/>
						</div>
						<div className="w-[1px] py-[13px] mr-2.5"></div>