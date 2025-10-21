# Props Contract

## login
Endpoint: /login
Method: POST
Deskripsi: mengirim data dari table pengguna field username dan password

pengguna {
  username : string
  password : string
}

flash? : string

## Dashboard admin
??

## Setting akun admin
Endpoint : /admin/profil
Method : GET
Deskripsi: Mengambil data dari table admin field username, password, gambar profil

admin {
  username : string
  password : string
  gambar : string
}

flash? : string

---

Endpoint : /admin/profil
Method : POST / PUT ?
Deskripsi: Mengubah data password di table admin

admin {
  new_password : string
}

flash? : string

## Rubrik 
Endpoint : /rubrik
Method : GET
Deskripsi : Mengambil data dari table aspek_penilaian

aspek_penilaian {
  id : integer
  nama : string
  jumlah_kompetensi : integer
}

poin_aspek_penilaian {
  status : boolean
}

flash? : string

// filter untuk page ini masih binugng

## Tambah Rubrik
Endpoint : /rubrik/tambah
Method : POST
Deskripsi : Menambah data di table aspek_penilaian

aspek_penilaian {
  nama : string
  jumlah_kompetensi : integer
  jurusan_rubrik : string
}

flash? : string

## Menu Kompetensi
Endpoint : /rubrik/:id/kompentensi
Method : GET
Deskripsi : Mengambil data dari table poin_aspek_penilaian

poin_aspek_penilaian {
  id : integer
  nama : string
  deskripsi : string
  bobot : integer
  skor : integer
  keterangan_skor : string
}


## Dashboard mahasiswa
??

## Dashboard penguji
??
