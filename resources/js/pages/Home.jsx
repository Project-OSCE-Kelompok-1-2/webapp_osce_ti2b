const Home = () => {
    return <div className="container w-full h-screen flex justify-center items-center bg-yellow-100" >
        <div className="bg-yellow-200 w-5/12 m-3 h-4/6 p-3 text-6xl font-bold  flex flex-col justify-between rounded-lg items-start border-2 border-yellow-500" >
        <span>
            Welcome page
        </span>
        <div className="flex flex-col gap-3" >
            <span className="text-sm font-normal text-justify opacity-75" >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eveniet reiciendis voluptatum delectus doloribus non exercitationem officiis? Quasi odit esse, pariatur doloribus quo, eum adipisci incidunt deleniti id illum minus?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eveniet reiciendis voluptatum delectus doloribus non exercitationem officiis? Quasi odit esse, pariatur doloribus quo, eum adipisci incidunt deleniti id illum minus?
        </span>
        <button className="bg-yellow-600 text-black text-sm font-normal text-justify p-2 w-3/12 rounded-lg hover:bg-yellow-500 border-2 border-yellow-800" >More info</button>
        </div>
    </div>
    </div>
};

export default Home;
