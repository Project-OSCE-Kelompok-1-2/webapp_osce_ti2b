const Profil2 = () => {
    const {flash} = usePage().props;
    const {data, setData, patch} = useForm({
        "new_password" : ""
    })

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route("admin.profil.update_password"));
    }
        return (
        <div>
            <label htmlFor="">Masukkan password baru</label>
            <input type="text" 
            onChange={e => setData("new_password", e.target.value)}
            />
            <button onClick={onSubmit}>Kirim password baru</button>
        </div>
    )
}

export default Profil2;