# Access Control List
Dokumen berikut merupakan dokumentasi dari ACL yang digunakan pada aplikasi ini

## Deskripsi ACL
ACL yang digunakan pada aplikasi ini bersifat *coarse* (tidak mendetil) dan *module-based*. Module ditentukan berdasarkan prefix pertama setelah prefix version. Misalkan, semua rute dengan prefix /v1/activity berada di bawah modul activity

## Privileges
Setiap grup memiliki privilege module yang berbeda. Priviliges sudah mencakup read + write untuk semua endpoint pada route tersebut

## Menu
Karena privilege terkait dengan user, maka menu dari user tertentu diikutkan pada detail user

## Pengecualian
Terdapat backdoor untuk pengguna admin -> pengguna admin dapat mengakses modul manapun, namun menu harus disesuaikan dengan semua privilege

Terdapat endpoint tertentu yang tidak diharuskan dilindungi dengan ACL, misal regional dan university

## List Roles + Modules :
* Admin : semua (activity, members, student care, university, acl) 
* Konselor : student care, member
* Kapro : activity, members, university

### Modules :
activity, members, student-care (ACL for admin group only)