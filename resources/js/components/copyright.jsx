export default function OsCopyright({ children, className = "" }) {

    return (
        <nav className={`w-full border-os-1 border-os-black p-os-8 bg-os-white rounded-lg text-os-regular flex flex-wrap gap-1 ${className}`}>
            <p className="opacity-os-alpha-75" >Copyright by who idk</p>
        </nav>
    );
}
