import React, {useState} from "react";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	const [input2, onChangeInput2] = useState('');
	const [input3, onChangeInput3] = useState('');
	return (
		<div className="items-start bg-white">
			<div className="flex flex-col w-[1391px] gap-2.5">
				<div className="flex flex-col self-stretch bg-white pb-0.5 gap-5">
					<div className="flex items-start self-stretch gap-[13px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/5mxl7yrc_expires_30_days.png"} 
							className="w-[54px] h-[54px] object-fill"
						/>
						<input
							placeholder={"OSCE / OSCE Radiologi 01-A/ Rekap Nilai"}
							value={input1}
							onChange={(event)=>onChangeInput1(event.target.value)}
							className="text-black bg-white text-xl w-[1324px] py-[15px] px-[19px] rounded-xl border border-solid border-black"
						/>
					</div>
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/4jta70x1_expires_30_days.png"} 
						className="self-stretch h-[1px] object-fill"
					/>
				</div>
				<div className="items-start self-stretch bg-white relative py-[39px] px-[55px]">
					<div className="flex flex-col self-stretch rounded-xl border border-solid border-black">
						<button className="flex flex-col items-center self-stretch bg-[#3177C8] text-left py-[29px] mb-2.5 gap-[13px] rounded-tl-xl rounded-tr-xl border-0"
							onClick={()=>alert("Pressed!")}>
							<span className="text-white text-[25px] font-bold" >
								{"Detail OSCE"}
							</span>
							<span className="text-white text-[13px]" >
								{"OSCE Radiologi 01-A"}
							</span>
						</button>
						<div className="flex flex-col items-start self-stretch pb-0.5 mb-[87px]">
							<div className="flex items-start self-stretch p-2.5 mb-[7px] ml-6 mr-[43px] gap-0.5 rounded-xl border border-solid border-black">
								<div className="flex flex-col items-center w-[85px] gap-[3px]">
									<span className="text-black text-[11px]" >
										{"Stasiun"}
									</span>
									<button className="flex flex-col items-center self-stretch bg-[#3177C8] text-left py-[17px] rounded-xl border border-solid border-black"
										onClick={()=>alert("Pressed!")}>
										<span className="text-white text-[35px]" >
											{"01"}
										</span>
									</button>
								</div>
								<div className="flex flex-col items-start w-[275px] pb-1.5 pl-2.5">
									<span className="text-black text-[11px] mb-[1px] mr-[234px]" >
										{"Rubrik"}
									</span>
									<span className="text-black text-[13px] font-bold mb-10 mr-[175px]" >
										{"Stase CT Scan"}
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/f1fzl1ps_expires_30_days.png"} 
										className="w-[17px] h-[17px] mr-[248px] object-fill"
									/>
								</div>
								<div className="flex flex-col items-start w-[275px] py-[3px] pl-2.5">
									<span className="text-black text-[11px] mr-[179px]" >
										{"Waktu per rubrik"}
									</span>
									<span className="text-black text-[13px] font-bold mb-10 mr-[210px]" >
										{"30 Menit"}
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/jg7sr0j6_expires_30_days.png"} 
										className="w-[17px] h-[17px] mr-[247px] object-fill"
									/>
								</div>
								<div className="flex flex-col items-start w-[275px] py-[3px] pl-2.5">
									<span className="text-black text-[11px] mr-[151px]" >
										{"Enrollment Mahasiswa"}
									</span>
									<span className="text-black text-[13px] font-bold mb-10 mr-[169px]" >
										{"135 Mahasiswa"}
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/4q51m1j9_expires_30_days.png"} 
										className="w-[17px] h-[17px] mr-[247px] object-fill"
									/>
								</div>
								<div className="flex flex-col items-start w-[275px] py-[3px] pl-2.5">
									<span className="text-black text-[11px] mr-[228px]" >
										{"Penguji"}
									</span>
									<span className="text-black text-[13px] font-bold w-[135px] mb-6 mr-[129px]" >
										{"Prof. dr. Rudi Hartono, Sp.B, Ph.D"}
									</span>
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/b5evutc1_expires_30_days.png"} 
										className="w-[17px] h-[17px] mr-[247px] object-fill"
									/>
								</div>
							</div>
							<span className="text-black text-[15px] mb-1.5 ml-6" >
								{"Navigasi"}
							</span>
							<button className="flex items-center bg-[#1447E6] text-left p-3 mb-[7px] ml-6 gap-1.5 rounded-xl border-0"
								onClick={()=>alert("Pressed!")}>
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/allwr474_expires_30_days.png"} 
									className="w-[30px] h-[30px] rounded-xl object-fill"
								/>
								<span className="text-white text-[15px]" >
									{"Unduh Rekap Nilai"}
								</span>
							</button>
							<div className="flex items-start self-stretch mb-[7px] ml-6 gap-[15px]">
								<div className="flex items-center bg-white w-[973px] rounded-xl border border-solid border-black">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/2r7wfw9t_expires_30_days.png"} 
										className="w-[21px] h-[21px] ml-3 mr-[13px] rounded-xl object-fill"
									/>
									<input
										placeholder={"cari nama mahasiswa"}
										value={input2}
										onChange={(event)=>onChangeInput2(event.target.value)}
										className="flex-1 self-stretch text-black bg-transparent text-[15px] py-[17px] mr-1 border-0"
									/>
								</div>
								<div className="flex flex-col items-start bg-[#1447E6] w-[268px] py-[17px] px-[120px] rounded-xl border border-solid border-black">
									<span className="text-white text-[15px] font-bold" >
										{"Cari"}
									</span>
								</div>
							</div>
							<span className="text-black text-[15px] mb-[7px] ml-6" >
								{"Mahasiswa | menampilkan 135 Mahasiswa"}
							</span>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/I1JF6HlbfB/e7tlszf3_expires_30_days.png"} 
								className="self-stretch h-[1px] mb-1.5 mx-6 object-fill"
							/>
							<div className="flex items-start self-stretch bg-white py-[5px] px-3 mb-[7px] ml-6 mr-[3px] gap-2.5 rounded-xl border border-solid border-black">
								<div className="flex flex-col items-start w-[51px] py-[9px] px-4">
									<span className="text-black text-[15px]" >
										{"No"}
									</span>
								</div>
								<div className="flex flex-col items-start w-[390px] py-[9px] px-[134px]">
									<span className="text-black text-[15px]" >
										{"Nama Mahasiswa"}
									</span>
								</div>
								<div className="flex flex-col items-start w-[359px] py-[9px] px-[166px]">
									<span className="text-black text-[15px]" >
										{"NIM"}
									</span>
								</div>
								<div className="flex flex-col items-start w-[195px] py-[9px] px-[83px]">
									<span className="text-black text-[15px]" >
										{"Nilai"}
									</span>
								</div>
								<div className="flex flex-col items-start w-[195px] py-[9px] px-[83px]">
									<span className="text-black text-[15px]" >
										{"Aksi"}
									</span>
								</div>
							</div>
							<div className="flex items-center self-stretch bg-white mb-[7px] ml-6 rounded-xl">
								<div className="flex flex-col items-start w-[49px] py-7 pl-3 mr-2.5">
									<span className="text-black text-[22px]" >
										{"1"}
									</span>
								</div>
								<div className="w-[1px] h-[85px]">
								</div>
								<div className="w-[1px] mr-[9px]">
									<div className="self-stretch h-[61px]">
									</div>
									<div className="self-stretch bg-[#00000080] h-[61px]">
									</div>
								</div>
								<span className="text-black text-[15px] font-bold" >
									{"Putri Levina Agatha"}
								</span>
								<div className="flex-1 self-stretch">
								</div>
								<div className="w-0.5 h-[85px]">
								</div>
								<div className="w-[1px] mr-[9px]">
									<div className="self-stretch h-[61px]">
									</div>
									<div className="self-stretch bg-[#00000080] h-[61px]">
									</div>
								</div>
								<span className="text-black text-[15px]" >
									{"4.33.252.6.37"}
								</span>
								<div className="flex-1 self-stretch">
								</div>
								<div className="w-[11px] h-[85px]">
								</div>
								<div className="w-[1px] mr-[83px]"></div>