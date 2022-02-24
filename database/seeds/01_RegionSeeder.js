'use strict'

const Factory = use('Factory')
const Database = use('Database')

class RegionSeeder {
  	async run () {
	  	await Database.insert([
  			{ id: '11', name: 'ACEH' },
  			{ id: '12', name: 'SUMATERA UTARA' }
    ]).into('region_provinces')

    await Database.insert([
      { id: '1101', province_id: '11', name: 'KABUPATEN SIMEULUE' },
      { id: '1102', province_id: '11', name: 'KABUPATEN ACEH SINGKIL' },
      { id: '1201', province_id: '12', name: 'KABUPATEN NIAS' },
      { id: '1202', province_id: '12', name: 'KABUPATEN MANDAILING NATAL' }
    ]).into('region_regencies')

    await Database.insert([
      { id: '1101010', regency_id: '1101', name: 'TEUPAH SELATAN' },
      { id: '1101020', regency_id: '1101', name: 'SIMEULUE TIMUR' },
      { id: '1102010', regency_id: '1102', name: 'PULAU BANYAK' },
      { id: '1102020', regency_id: '1102', name: 'PULAU BANYAK BARAT' },
      { id: '1201060', regency_id: '1201', name: 'IDANO GAWO' },
      { id: '1201061', regency_id: '1201', name: 'BAWOLATO' },
      { id: '1202010', regency_id: '1202', name: 'BATAHAN' },
      { id: '1202011', regency_id: '1202', name: 'SINUNUKAN' }
    ]).into('region_districts')

    await Database.insert([
      { id: '1101010001', district_id: '1101010', name: 'LATIUNG' },
      { id: '1101010002', district_id: '1101010', name: 'LABUHAN BAJAU' },
      { id: '1101020022', district_id: '1101020', name: 'AIR PINANG' },
      { id: '1101020023', district_id: '1101020', name: 'KUALA MAKMUR' },
      { id: '1102010003', district_id: '1102010', name: 'PULAU BAGUK' },
      { id: '1102010004', district_id: '1102010', name: 'PULAU BALAI' },
      { id: '1102020003', district_id: '1102020', name: 'PULO SAROK' },
      { id: '1102020004', district_id: '1102020', name: 'PASAR SINGKIL' },
      { id: '1201060015', district_id: '1201060', name: 'TETE GOENAAI' },
      { id: '1201060016', district_id: '1201060', name: 'LAOWO HILIMBARUZO' },
      { id: '1201061001', district_id: '1201061', name: 'SIOFA BANUA' },
      { id: '1201061002', district_id: '1201061', name: 'SIFAOROASI ULUHOU' },
      { id: '1202010001', district_id: '1202010', name: 'PULAU TAMANG' },
      { id: '1202010002', district_id: '1202010', name: 'PASAR BATAHAN' },
      { id: '1202011001', district_id: '1202011', name: 'SINUNUKAN IV' },
      { id: '1202011002', district_id: '1202011', name: 'SINUNUKAN II' }
    ]).into('region_villages')
  	}
}

module.exports = RegionSeeder
