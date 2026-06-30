const teams = {
  Galatasaray: {
    name: "Galatasaray",
    captain: "Abdülkerim Bardakcı",
    penaltyTaker: "Victor Osimhen",
    freeKickTaker: "Leroy Sané",
    formation: "4-3-3",
    startingXI: [
      { name: "Uğurcan Çakır", position: "GK" },
      { name: "Wilfried Singo", position: "RB" },
      { name: "Davinson Sánchez", position: "CB" },
      { name: "Abdülkerim Bardakcı", position: "CB" },
      { name: "Ismail Jakobs", position: "LB" },
      { name: "Lucas Torreira", position: "CDM" },
      { name: "Gabriel Sara", position: "CM" },
      { name: "İlkay Gündoğan", position: "CAM" },
      { name: "Leroy Sané", position: "RW" },
      { name: "Barış Alper Yılmaz", position: "LW" },
      { name: "Victor Osimhen", position: "ST" }
    ],
    substitutes: [
      { name: "Günay Güvenç", position: "GK" },
      { name: "Kaan Ayhan", position: "CB" },
      { name: "Eren Elmalı", position: "LB" },
      { name: "Mario Lemina", position: "CDM" },
      { name: "Yunus Akgün", position: "RW" },
      { name: "Noa Lang", position: "LW" },
      { name: "Mauro Icardi", position: "ST" },
      { name: "Roland Sallai", position: "RB" }
    ]
  },
  Fenerbahçe: {
    name: "Fenerbahçe",
    captain: "Edson Álvarez",
    penaltyTaker: "Talisca",
    freeKickTaker: "Marco Asensio",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Ederson", position: "GK" },
      { name: "Nélson Semedo", position: "RB" },
      { name: "Milan Škriniar", position: "CB" },
      { name: "Çağlar Söyüncü", position: "CB" },
      { name: "Jayden Oosterwolde", position: "LB" },
      { name: "Edson Álvarez", position: "CDM" },
      { name: "Mattéo Guendouzi", position: "CM" },
      { name: "Marco Asensio", position: "RW" },
      { name: "Talisca", position: "CAM" },
      { name: "Kerem Aktürkoğlu", position: "LW" },
      { name: "Jhon Durán", position: "ST" }
    ],
    substitutes: [
      { name: "Mert Günok", position: "GK" },
      { name: "Mert Müldür", position: "RB" },
      { name: "Archie Brown", position: "LB" },
      { name: "İsmail Yüksek", position: "CDM" },
      { name: "Fred", position: "CM" },
      { name: "N'Golo Kanté", position: "CDM" },
      { name: "Dorgeles Nene", position: "RW" },
      { name: "Oğuz Aydın", position: "LW" }
    ]
  },
  Beşiktaş: {
    name: "Beşiktaş",
    captain: "Necip Uysal",
    penaltyTaker: "Orkun Kökçü",
    freeKickTaker: "Orkun Kökçü",
    formation: "4-3-3",
    startingXI: [
      { name: "Ersin Destanoğlu", position: "GK" },
      { name: "Amir Murillo", position: "RB" },
      { name: "Emmanuel Agbadou", position: "CB" },
      { name: "Tiago Djaló", position: "CB" },
      { name: "Rıdvan Yılmaz", position: "LB" },
      { name: "Wilfred Ndidi", position: "CDM" },
      { name: "Orkun Kökçü", position: "CM" },
      { name: "Kristjan Asllani", position: "CM" },
      { name: "Milot Rashica", position: "RW" },
      { name: "El Bilal Touré", position: "LW" },
      { name: "Hyeon-gyu Oh", position: "ST" }
    ],
    substitutes: [
      { name: "Devis Vásquez", position: "GK" },
      { name: "Felix Uduokhai", position: "CB" },
      { name: "Taylan Bulut", position: "RB" },
      { name: "Salih Uçan", position: "CM" },
      { name: "Junior Olaitan", position: "CAM" },
      { name: "Vaclav Cerny", position: "RW" },
      { name: "Cengiz Ünder", position: "RW" },
      { name: "Mustafa Hekimoğlu", position: "ST" }
    ]
  },
  Trabzonspor: {
    name: "Trabzonspor",
    captain: "Okay Yokuşlu",
    penaltyTaker: "Paul Onuachu",
    freeKickTaker: "Edin Visca",
    formation: "4-3-3",
    startingXI: [
      { name: "André Onana", position: "GK" },
      { name: "Wagner Pina", position: "RB" },
      { name: "Arseniy Batagov", position: "CB" },
      { name: "Chibuike Nwaiwu", position: "CB" },
      { name: "Mathias Løvik", position: "LB" },
      { name: "Okay Yokuşlu", position: "CDM" },
      { name: "Tim Jabol-Folcarelli", position: "CM" },
      { name: "Christ Inao Oulaï", position: "CM" },
      { name: "Edin Visca", position: "RW" },
      { name: "Anthony Nwakaeme", position: "LW" },
      { name: "Paul Onuachu", position: "ST" }
    ],
    substitutes: [
      { name: "Onuralp Çevikkan", position: "GK" },
      { name: "Mustafa Eskihellaç", position: "LB" },
      { name: "Stefan Savic", position: "CB" },
      { name: "Benjamin Bouchouari", position: "CM" },
      { name: "Ozan Tufan", position: "CM" },
      { name: "Oleksandr Zubkov", position: "RW" },
      { name: "Felipe Augusto", position: "ST" },
      { name: "Ernest Muci", position: "CAM" }
    ]
  },
  Başakşehir: {
    name: "Başakşehir",
    captain: "Volkan Babacan",
    penaltyTaker: "Eldor Shomurodov",
    freeKickTaker: "Amine Harit",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Volkan Babacan", position: "GK" },
      { name: "Ömer Ali Şahiner", position: "RB" },
      { name: "Hamza Güreler", position: "CB" },
      { name: "Jerome Opoku", position: "CB" },
      { name: "Léo Dubois", position: "LB" },
      { name: "Berat Özdemir", position: "CDM" },
      { name: "Miguel Crespo", position: "CM" },
      { name: "Abbosbek Fayzullaev", position: "RW" },
      { name: "Amine Harit", position: "CAM" },
      { name: "Yusuf Sarı", position: "LW" },
      { name: "Eldor Shomurodov", position: "ST" }
    ],
    substitutes: [
      { name: "Deniz Dilmen", position: "GK" },
      { name: "Ahmed Touba", position: "CB" },
      { name: "Jakub Kaluzinski", position: "CDM" },
      { name: "Olivier Kemen", position: "CM" },
      { name: "Umut Güneş", position: "CM" },
      { name: "Ivan Brnic", position: "LW" },
      { name: "Davie Selke", position: "ST" },
      { name: "Nuno da Costa", position: "ST" }
    ]
  },
  Kasımpaşa: {
    name: "Kasımpaşa",
    captain: "Haris Hajradinovic",
    penaltyTaker: "İrfan Can Kahveci",
    freeKickTaker: "Kerem Demirbay",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Andreas Gianniotis", position: "GK" },
      { name: "Kamil Ahmet Çörekçi", position: "RB" },
      { name: "Rodrigo Becão", position: "CB" },
      { name: "Ahmet Taha Dağbaşı", position: "CB" },
      { name: "Godfried Frimpong", position: "LB" },
      { name: "Andri Fannar Baldursson", position: "CDM" },
      { name: "Kerem Demirbay", position: "CM" },
      { name: "İrfan Can Kahveci", position: "RW" },
      { name: "Haris Hajradinovic", position: "CAM" },
      { name: "Mortadha Ben Ouanes", position: "LW" },
      { name: "Pape Habib Guèye", position: "ST" }
    ],
    substitutes: [
      { name: "Ali Emre Yanar", position: "GK" },
      { name: "Emre Taşdemir", position: "LB" },
      { name: "Cláudio Winck", position: "RB" },
      { name: "Burak Gültekin", position: "CDM" },
      { name: "Cafú", position: "CM" },
      { name: "Jim Allevinah", position: "RW" },
      { name: "Fousseni Diabaté", position: "LW" },
      { name: "Cenk Tosun", position: "ST" }
    ]
  },
  Eyüpspor: {
    name: "Eyüpspor",
    captain: "Emre Akbaba",
    penaltyTaker: "Umut Bozok",
    freeKickTaker: "Emre Akbaba",
    formation: "4-3-3",
    startingXI: [
      { name: "Marcos Felipe", position: "GK" },
      { name: "Calegari", position: "RB" },
      { name: "Lucca", position: "CB" },
      { name: "Berhan Kutlay Şatlı", position: "CB" },
      { name: "Talha Ülvan", position: "LB" },
      { name: "Mateusz Legowski", position: "CDM" },
      { name: "Charles-André Raux-Yao", position: "CM" },
      { name: "Emre Akbaba", position: "CAM" },
      { name: "Dorin Rotariu", position: "RW" },
      { name: "Lenny Pintor", position: "LW" },
      { name: "Umut Bozok", position: "ST" }
    ],
    substitutes: [
      { name: "Jankat Yılmaz", position: "GK" },
      { name: "Seyfettin Anıl Yaşar", position: "CB" },
      { name: "Gilbert Mendy", position: "LB" },
      { name: "Taşkın İlter", position: "CDM" },
      { name: "Ismaila Manga", position: "CAM" },
      { name: "Christ Sadia", position: "RW" },
      { name: "Ángel Torres", position: "RW" },
      { name: "Abdou Khadre Sy", position: "ST" }
    ]
  },
  Göztepe: {
    name: "Göztepe",
    captain: "Mateusz Lis",
    penaltyTaker: "Juan",
    freeKickTaker: "Alexis Antunes",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Mateusz Lis", position: "GK" },
      { name: "Arda Okan Kurtulan", position: "RB" },
      { name: "Héliton", position: "CB" },
      { name: "Allan Godói", position: "CB" },
      { name: "İsmail Köybaşı", position: "LB" },
      { name: "Anthony Dennis", position: "CDM" },
      { name: "Musah Mohammed", position: "CM" },
      { name: "Filip Krastev", position: "RW" },
      { name: "Alexis Antunes", position: "CAM" },
      { name: "Amin Cherni", position: "LW" },
      { name: "Juan", position: "ST" }
    ],
    substitutes: [
      { name: "Ekrem Kılıçarslan", position: "GK" },
      { name: "Furkan Bayır", position: "CB" },
      { name: "Uğur Kaan Yıldız", position: "RB" },
      { name: "Novatus Miroshi", position: "CDM" },
      { name: "Efkan Bekiroğlu", position: "CAM" },
      { name: "Ogün Bayrak", position: "RM" },
      { name: "Janderson", position: "ST" },
      { name: "Guilherme Luiz", position: "ST" }
    ]
  },
  Konyaspor: {
    name: "Konyaspor",
    captain: "Enis Bardhi",
    penaltyTaker: "Kazeem Olaigbe",
    freeKickTaker: "Enis Bardhi",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Deniz Ertaş", position: "GK" },
      { name: "Yhoan Andzouana", position: "RB" },
      { name: "Adamo Nagalo", position: "CB" },
      { name: "Adil Demirbağ", position: "CB" },
      { name: "Yasir Subaşı", position: "LB" },
      { name: "Jin-ho Jo", position: "CDM" },
      { name: "Morten Bjørlo", position: "CM" },
      { name: "Kazeem Olaigbe", position: "RW" },
      { name: "Enis Bardhi", position: "CAM" },
      { name: "Diogo Gonçalves", position: "LW" },
      { name: "Jackson Muleka", position: "ST" }
    ],
    substitutes: [
      { name: "Bahadır Güngördü", position: "GK" },
      { name: "Riechedly Bazoer", position: "CB" },
      { name: "Arif Boşluk", position: "LB" },
      { name: "Marko Jevtovic", position: "CDM" },
      { name: "Berkan Kutlu", position: "CM" },
      { name: "Melih İbrahimoğlu", position: "CM" },
      { name: "Deniz Türüç", position: "RW" },
      { name: "Blaz Kramer", position: "ST" }
    ]
  },
  "Çaykur Rizespor": {
    name: "Çaykur Rizespor",
    captain: "Taylan Antalyalı",
    penaltyTaker: "Frantzdy Pierrot",
    freeKickTaker: "Valentin Mihăilă",
    formation: "4-3-3",
    startingXI: [
      { name: "Yahia Fofana", position: "GK" },
      { name: "Mithat Pala", position: "RB" },
      { name: "Attila Mocsi", position: "CB" },
      { name: "Samet Akaydin", position: "CB" },
      { name: "Casper Højer", position: "LB" },
      { name: "Taylan Antalyalı", position: "CDM" },
      { name: "Qazim Laci", position: "CM" },
      { name: "Ibrahim Olawoyin", position: "CM" },
      { name: "Valentin Mihăilă", position: "LW" },
      { name: "Loide Augusto", position: "RW" },
      { name: "Frantzdy Pierrot", position: "ST" }
    ],
    substitutes: [
      { name: "Erdem Canpolat", position: "GK" },
      { name: "Khusniddin Alikulov", position: "CB" },
      { name: "Emir Ortakaya", position: "CB" },
      { name: "Giannis Papanikolaou", position: "CDM" },
      { name: "Muhamed Buljubasic", position: "CM" },
      { name: "Altin Zeqiri", position: "LW" },
      { name: "Ali Sowe", position: "ST" },
      { name: "Emrecan Bulut", position: "LW" }
    ]
  },
  "Gaziantep FK": {
    name: "Gaziantep FK",
    captain: "Maxim",
    penaltyTaker: "Maxim",
    freeKickTaker: "Maxim",
    formation: "4-2-3-1",
    startingXI: [
      { name: "Günay Güvenç", position: "GK" },
      { name: "Ömürcan Artan", position: "RB" },
      { name: "Ertuğrul Ersoy", position: "CB" },
      { name: "Arda Kızıldağ", position: "CB" },
      { name: "Moustapha Kondé", position: "LB" },
      { name: "Marko Jevtovic", position: "CDM" },
      { name: "Oğuz Ceylan", position: "CM" },
      { name: "Maxim", position: "CAM" },
      { name: "Ognjen Ozegovic", position: "RW" },
      { name: "Alexandru Maxim", position: "LW" },
      { name: "Denis Drăguş", position: "ST" }
    ],
    substitutes: [
      { name: "Burak Bozan", position: "GK" },
      { name: "Ulaş Zengin", position: "CB" },
      { name: "Papy Djilobodji", position: "CB" },
      { name: "Furkan Soyalp", position: "CM" },
      { name: "Mirza Cihan", position: "CM" },
      { name: "Muhammed Gümüşkaya", position: "CAM" },
      { name: "Joel Figueroa", position: "LW" },
      { name: "Eren Derdiyok", position: "ST" }
    ]
  },
  "Erzurumspor FK": {
    name: "Erzurumspor FK",
    captain: "Giovanni Crociata",
    penaltyTaker: "Fernando Andrade",
    freeKickTaker: "Martín Rodríguez",
    formation: "4-3-3",
    startingXI: [
      { name: "Göktuğ Bakırbaş", position: "GK" },
      { name: "Mert Önal", position: "RB" },
      { name: "Ömer Arda Kara", position: "CB" },
      { name: "Uğurcan Sönmez", position: "CB" },
      { name: "Mücahit Albayrak", position: "LB" },
      { name: "Brandon Baiye", position: "CDM" },
      { name: "Giovanni Crociata", position: "CM" },
      { name: "Sefa Akgün", position: "CM" },
      { name: "Benhur Keser", position: "RW" },
      { name: "Fernando Andrade", position: "LW" },
      { name: "Martín Rodríguez", position: "ST" }
    ],
    substitutes: [
      { name: "Alperen Karaca", position: "GK" },
      { name: "Adem Eren Kabak", position: "CDM" },
      { name: "Furkan Özhan", position: "LW" },
      { name: "Murat Cem Akpınar", position: "CM" },
      { name: "Mustafa Fettahoğlu", position: "LW" },
      { name: "Muhammed Emin Yavaş", position: "CM" },
      { name: "Batuhan Artarslan", position: "CDM" },
      { name: "Marko Bozic", position: "LW" }
    ]
  },
  Gençlerbirliği: {
    name: "Gençlerbirliği",
    captain: "Tom Dele-Bashiru",
    penaltyTaker: "Henry Onyekuru",
    freeKickTaker: "Dal Varesanovic",
    formation: "4-3-3",
    startingXI: [
      { name: "Berk Deniz Çukurcu", position: "GK" },
      { name: "Pedro Pereira", position: "RB" },
      { name: "Abdurrahim Dursun", position: "CB" },
      { name: "Arda Çağan Çelik", position: "CB" },
      { name: "Matej Hanousek", position: "LB" },
      { name: "Tom Dele-Bashiru", position: "CDM" },
      { name: "Franco Tongya", position: "CM" },
      { name: "Dal Varesanovic", position: "CAM" },
      { name: "Adama Traoré", position: "RW" },
      { name: "Henry Onyekuru", position: "LW" },
      { name: "Metehan Mimaroğlu", position: "ST" }
    ],
    substitutes: [
      { name: "Ricardo Velho", position: "GK" },
      { name: "Mikail Okyar", position: "CB" },
      { name: "Fıratcan Üzüm", position: "RB" },
      { name: "Oğulcan Ülgün", position: "CM" },
      { name: "Peter Etebo", position: "CDM" },
      { name: "Cihan Çanak", position: "RW" },
      { name: "Göktan Gürpüz", position: "CAM" },
      { name: "Samed Onur", position: "CM" }
    ]
  },
  "Çorum FK": {
    name: "Çorum FK",
    captain: "Ferhat Yazgan",
    penaltyTaker: "Mame Thiam",
    freeKickTaker: "Danijel Aleksic",
    formation: "4-3-3",
    startingXI: [
      { name: "Hasan Hüseyin Akınay", position: "GK" },
      { name: "Kerem Kalafat", position: "RB" },
      { name: "Joseph Attamah", position: "CB" },
      { name: "Arda Şengül", position: "CB" },
      { name: "Cemali Sertel", position: "LB" },
      { name: "Ferhat Yazgan", position: "CDM" },
      { name: "Atakan Akkaynak", position: "CM" },
      { name: "Danijel Aleksic", position: "CAM" },
      { name: "İbrahim Zubairu", position: "LW" },
      { name: "Yusuf Erdoğan", position: "RW" },
      { name: "Mame Thiam", position: "ST" }
    ],
    substitutes: [
      { name: "İbrahim Sehic", position: "GK" },
      { name: "Sinan Osmanoğlu", position: "CB" },
      { name: "Erkan Kaş", position: "LB" },
      { name: "Atakan Cangöz", position: "CDM" },
      { name: "Ahmed Ildız", position: "CM" },
      { name: "Oğuz Gürbulak", position: "CM" },
      { name: "Burak Çoban", position: "LW" },
      { name: "Braian Samudio", position: "ST" }
    ]
  },
  Kocaelispor: {
    name: "Kocaelispor",
    captain: "Muharrem Cinan",
    penaltyTaker: "Bruno Petkovic",
    freeKickTaker: "Karol Linetty",
    formation: "4-3-3",
    startingXI: [
      { name: "Aleksandar Jovanovic", position: "GK" },
      { name: "Ahmet Oğuz", position: "RB" },
      { name: "Botond Balogh", position: "CB" },
      { name: "Hrvoje Smolcic", position: "CB" },
      { name: "Massadio Haïdara", position: "LB" },
      { name: "Mahamadou Susoho", position: "CDM" },
      { name: "Karol Linetty", position: "CM" },
      { name: "Habib Keïta", position: "CM" },
      { name: "Dan Agyei", position: "RW" },
      { name: "Darko Churlinov", position: "LW" },
      { name: "Bruno Petkovic", position: "ST" }
    ],
    substitutes: [
      { name: "Serhat Öztaşdelen", position: "GK" },
      { name: "Muharrem Cinan", position: "LB" },
      { name: "Anfernee Dijksteel", position: "RB" },
      { name: "Joseph Nonge", position: "CM" },
      { name: "Tayfur Bingöl", position: "CM" },
      { name: "Samet Yalçın", position: "CM" },
      { name: "Rigoberto Rivas", position: "LW" },
      { name: "Serdar Dursun", position: "ST" }
    ]
  },
  Amedspor: {
    name: "Amedspor",
    captain: "Hasan Ali Kaldırım",
    penaltyTaker: "Mbaye Diagne",
    freeKickTaker: "Dia Saba",
    formation: "4-3-3",
    startingXI: [
      { name: "Erce Kardeşler", position: "GK" },
      { name: "Celal Hanalp", position: "RB" },
      { name: "Kahraman Demirtaş", position: "CB" },
      { name: "Oleksandr Syrota", position: "CB" },
      { name: "Hasan Ali Kaldırım", position: "LB" },
      { name: "Sinan Kurt", position: "CDM" },
      { name: "Adama Traoré", position: "CM" },
      { name: "Dia Saba", position: "CAM" },
      { name: "Daniel Moreno", position: "RW" },
      { name: "Felix Afena-Gyan", position: "LW" },
      { name: "Mbaye Diagne", position: "ST" }
    ],
    substitutes: [
      { name: "Abdulsamed Damlu", position: "GK" },
      { name: "Mehmet Yeşil", position: "CB" },
      { name: "Murat Uçar", position: "LB" },
      { name: "Atakan Müjde", position: "CDM" },
      { name: "Cem Üstündağ", position: "CM" },
      { name: "Çekdar Orhan", position: "CAM" },
      { name: "Emrah Başsan", position: "RW" },
      { name: "Zdravko Dimitrov", position: "LW" }
    ]
  }
};

module.exports = teams;
