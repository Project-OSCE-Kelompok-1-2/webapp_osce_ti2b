import Home from "./Home";

const Login = () => {
  return (
    <div className="text-blue-500 text-xl">
      <p>Halaman Login</p>
      {/* Memanggil komponen Home */}
        <Home />
    </div>
  );
};

export default Login;
