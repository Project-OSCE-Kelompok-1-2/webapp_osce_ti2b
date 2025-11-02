
import Os_button from "../components/button";
import OsBreadCrumb from "../components/breadcrumb";
import OsCopyright from "../components/copyright";
import OsIcon from "../components/icons";

const Home = () => {
    return <div className="container flex flex-col w-full h-screen justify-between p-os-8 items-center bg-yellow-100" >
        <OsBreadCrumb>
            <span>Hello World</span>
            <span>Hello World</span>
            <span>Hello World</span>
            <span>Hello World</span>
        </OsBreadCrumb>
        <div className="bg-yellow-200 w-5/12 m-3 h-4/6 p-os-20 text-os-title text-os-black font-bold  flex flex-col justify-between rounded-lg items-start border-os-2 border-os-black" >
        <div className="flex flex-row items-center justify-center gap-os-8" >
            <OsIcon name="home" className="w-os-24 os-icon-dark" />
            <span>
                Welcome page
            </span>
        </div>
        <div className="flex flex-col gap-3" >
            <span className="os-link os-opa text-sm font-normal text-justify opacity-75" >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eveniet reiciendis voluptatum delectus doloribus non exercitationem officiis? Quasi odit esse, pariatur doloribus quo, eum adipisci incidunt deleniti id illum minus?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat eveniet reiciendis voluptatum delectus doloribus non exercitationem officiis? Quasi odit esse, pariatur doloribus quo, eum adipisci incidunt deleniti id illum minus?
        </span>
        <Os_button 
            onClick={() => alert("More info clicked!")}>
            More info
        </Os_button>
        </div>
        </div>
        <OsCopyright></OsCopyright>
    </div>
};

export default Home;
