# Base modul untuk Serice Api Website Portal Public

Prosedur yang harus di patuhi selama pengembangan service dilakukan

1. Ketika membuat variabel, gunakan kosa kata yang relevan agar mudah dipahami
2. Ketika selesai mengerjakan sebuah task & akan mengupdate ke repository, diharapkan membuat branch dengan format : nama_fituryangdikerjakan, TIDAK BOLEH PUSH KE BRANCH MASTER.
3. Setelah update silahkan melakukan broadcast informasi bahwa task sudah di push ke repository via grup telegram
4. Tidak mengotak-atik branch anggota tim yang jika tidak di instuksikan
5. Manfaatkan fitur Migration untuk kebutuhan mapping table.

## Setup

```js
1. git clone ..........
2. cd <folder_name>/....
3. npm install
```

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```
