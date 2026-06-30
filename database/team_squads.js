const db = require('./db');

const SQUADS = {
  "galatasaray": {
    "name": "Galatasaray",
    "starting": [
      {
        "pos": "GK",
        "name": "Uğurcan Çakır"
      },
      {
        "pos": "RB",
        "name": "Wilfried Singo"
      },
      {
        "pos": "CB",
        "name": "Davinson Sánchez"
      },
      {
        "pos": "CB",
        "name": "Abdülkerim Bardakcı"
      },
      {
        "pos": "LB",
        "name": "Ismail Jakobs"
      },
      {
        "pos": "CDM",
        "name": "Lucas Torreira"
      },
      {
        "pos": "CM",
        "name": "Gabriel Sara"
      },
      {
        "pos": "CAM",
        "name": "İlkay Gündoğan"
      },
      {
        "pos": "RW",
        "name": "Leroy Sané"
      },
      {
        "pos": "LW",
        "name": "Barış Alper Yılmaz"
      },
      {
        "pos": "ST",
        "name": "Victor Osimhen"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Günay Güvenç"
      },
      {
        "pos": "CB",
        "name": "Kaan Ayhan"
      },
      {
        "pos": "LB",
        "name": "Eren Elmalı"
      },
      {
        "pos": "CDM",
        "name": "Mario Lemina"
      },
      {
        "pos": "RW",
        "name": "Yunus Akgün"
      },
      {
        "pos": "LW",
        "name": "Noa Lang"
      },
      {
        "pos": "ST",
        "name": "Mauro Icardi"
      },
      {
        "pos": "RB",
        "name": "Roland Sallai"
      }
    ],
    "roles": {
      "captain": "Abdülkerim Bardakcı",
      "penalty": "Victor Osimhen",
      "freeKick": "Leroy Sané"
    }
  },
  "fenerbahçe": {
    "name": "Fenerbahçe",
    "starting": [
      {
        "pos": "GK",
        "name": "Ederson"
      },
      {
        "pos": "RB",
        "name": "Nélson Semedo"
      },
      {
        "pos": "CB",
        "name": "Milan Škriniar"
      },
      {
        "pos": "CB",
        "name": "Çağlar Söyüncü"
      },
      {
        "pos": "LB",
        "name": "Jayden Oosterwolde"
      },
      {
        "pos": "CDM",
        "name": "Edson Álvarez"
      },
      {
        "pos": "CM",
        "name": "Mattéo Guendouzi"
      },
      {
        "pos": "RW",
        "name": "Marco Asensio"
      },
      {
        "pos": "CAM",
        "name": "Talisca"
      },
      {
        "pos": "LW",
        "name": "Kerem Aktürkoğlu"
      },
      {
        "pos": "ST",
        "name": "Jhon Durán"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Mert Günok"
      },
      {
        "pos": "RB",
        "name": "Mert Müldür"
      },
      {
        "pos": "LB",
        "name": "Archie Brown"
      },
      {
        "pos": "CDM",
        "name": "İsmail Yüksek"
      },
      {
        "pos": "CM",
        "name": "Fred"
      },
      {
        "pos": "CDM",
        "name": "N'Golo Kanté"
      },
      {
        "pos": "RW",
        "name": "Dorgeles Nene"
      },
      {
        "pos": "LW",
        "name": "Oğuz Aydın"
      }
    ],
    "roles": {
      "captain": "Edson Álvarez",
      "penalty": "Talisca",
      "freeKick": "Marco Asensio"
    }
  },
  "beşiktaş": {
    "name": "Beşiktaş",
    "starting": [
      {
        "pos": "GK",
        "name": "Ersin Destanoğlu"
      },
      {
        "pos": "RB",
        "name": "Amir Murillo"
      },
      {
        "pos": "CB",
        "name": "Emmanuel Agbadou"
      },
      {
        "pos": "CB",
        "name": "Tiago Djaló"
      },
      {
        "pos": "LB",
        "name": "Rıdvan Yılmaz"
      },
      {
        "pos": "CDM",
        "name": "Wilfred Ndidi"
      },
      {
        "pos": "CM",
        "name": "Orkun Kökçü"
      },
      {
        "pos": "CM",
        "name": "Kristjan Asllani"
      },
      {
        "pos": "RW",
        "name": "Milot Rashica"
      },
      {
        "pos": "LW",
        "name": "El Bilal Touré"
      },
      {
        "pos": "ST",
        "name": "Hyeon-gyu Oh"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Devis Vásquez"
      },
      {
        "pos": "CB",
        "name": "Felix Uduokhai"
      },
      {
        "pos": "RB",
        "name": "Taylan Bulut"
      },
      {
        "pos": "CM",
        "name": "Salih Uçan"
      },
      {
        "pos": "CAM",
        "name": "Junior Olaitan"
      },
      {
        "pos": "RW",
        "name": "Vaclav Cerny"
      },
      {
        "pos": "RW",
        "name": "Cengiz Ünder"
      },
      {
        "pos": "ST",
        "name": "Mustafa Hekimoğlu"
      }
    ],
    "roles": {
      "captain": "Necip Uysal",
      "penalty": "Orkun Kökçü",
      "freeKick": "Orkun Kökçü"
    }
  },
  "trabzonspor": {
    "name": "Trabzonspor",
    "starting": [
      {
        "pos": "GK",
        "name": "André Onana"
      },
      {
        "pos": "RB",
        "name": "Wagner Pina"
      },
      {
        "pos": "CB",
        "name": "Arseniy Batagov"
      },
      {
        "pos": "CB",
        "name": "Chibuike Nwaiwu"
      },
      {
        "pos": "LB",
        "name": "Mathias Løvik"
      },
      {
        "pos": "CDM",
        "name": "Okay Yokuşlu"
      },
      {
        "pos": "CM",
        "name": "Tim Jabol-Folcarelli"
      },
      {
        "pos": "CM",
        "name": "Christ Inao Oulaï"
      },
      {
        "pos": "RW",
        "name": "Edin Visca"
      },
      {
        "pos": "LW",
        "name": "Anthony Nwakaeme"
      },
      {
        "pos": "ST",
        "name": "Paul Onuachu"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Onuralp Çevikkan"
      },
      {
        "pos": "LB",
        "name": "Mustafa Eskihellaç"
      },
      {
        "pos": "CB",
        "name": "Stefan Savic"
      },
      {
        "pos": "CM",
        "name": "Benjamin Bouchouari"
      },
      {
        "pos": "CM",
        "name": "Ozan Tufan"
      },
      {
        "pos": "RW",
        "name": "Oleksandr Zubkov"
      },
      {
        "pos": "ST",
        "name": "Felipe Augusto"
      },
      {
        "pos": "CAM",
        "name": "Ernest Muci"
      }
    ],
    "roles": {
      "captain": "Okay Yokuşlu",
      "penalty": "Paul Onuachu",
      "freeKick": "Edin Visca"
    }
  },
  "başakşehir": {
    "name": "Başakşehir",
    "starting": [
      {
        "pos": "GK",
        "name": "Volkan Babacan"
      },
      {
        "pos": "RB",
        "name": "Ömer Ali Şahiner"
      },
      {
        "pos": "CB",
        "name": "Hamza Güreler"
      },
      {
        "pos": "CB",
        "name": "Jerome Opoku"
      },
      {
        "pos": "LB",
        "name": "Léo Dubois"
      },
      {
        "pos": "CDM",
        "name": "Berat Özdemir"
      },
      {
        "pos": "CM",
        "name": "Miguel Crespo"
      },
      {
        "pos": "RW",
        "name": "Abbosbek Fayzullaev"
      },
      {
        "pos": "CAM",
        "name": "Amine Harit"
      },
      {
        "pos": "LW",
        "name": "Yusuf Sarı"
      },
      {
        "pos": "ST",
        "name": "Eldor Shomurodov"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Deniz Dilmen"
      },
      {
        "pos": "CB",
        "name": "Ahmed Touba"
      },
      {
        "pos": "CDM",
        "name": "Jakub Kaluzinski"
      },
      {
        "pos": "CM",
        "name": "Olivier Kemen"
      },
      {
        "pos": "CM",
        "name": "Umut Güneş"
      },
      {
        "pos": "LW",
        "name": "Ivan Brnic"
      },
      {
        "pos": "ST",
        "name": "Davie Selke"
      },
      {
        "pos": "ST",
        "name": "Nuno da Costa"
      }
    ],
    "roles": {
      "captain": "Volkan Babacan",
      "penalty": "Eldor Shomurodov",
      "freeKick": "Amine Harit"
    }
  },
  "kasımpaşa": {
    "name": "Kasımpaşa",
    "starting": [
      {
        "pos": "GK",
        "name": "Andreas Gianniotis"
      },
      {
        "pos": "RB",
        "name": "Kamil Ahmet Çörekçi"
      },
      {
        "pos": "CB",
        "name": "Rodrigo Becão"
      },
      {
        "pos": "CB",
        "name": "Ahmet Taha Dağbaşı"
      },
      {
        "pos": "LB",
        "name": "Godfried Frimpong"
      },
      {
        "pos": "CDM",
        "name": "Andri Fannar Baldursson"
      },
      {
        "pos": "CM",
        "name": "Kerem Demirbay"
      },
      {
        "pos": "RW",
        "name": "İrfan Can Kahveci"
      },
      {
        "pos": "CAM",
        "name": "Haris Hajradinovic"
      },
      {
        "pos": "LW",
        "name": "Mortadha Ben Ouanes"
      },
      {
        "pos": "ST",
        "name": "Pape Habib Guèye"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Ali Emre Yanar"
      },
      {
        "pos": "LB",
        "name": "Emre Taşdemir"
      },
      {
        "pos": "RB",
        "name": "Cláudio Winck"
      },
      {
        "pos": "CDM",
        "name": "Burak Gültekin"
      },
      {
        "pos": "CM",
        "name": "Cafú"
      },
      {
        "pos": "RW",
        "name": "Jim Allevinah"
      },
      {
        "pos": "LW",
        "name": "Fousseni Diabaté"
      },
      {
        "pos": "ST",
        "name": "Cenk Tosun"
      }
    ],
    "roles": {
      "captain": "Haris Hajradinovic",
      "penalty": "İrfan Can Kahveci",
      "freeKick": "Kerem Demirbay"
    }
  },
  "eyüpspor": {
    "name": "Eyüpspor",
    "starting": [
      {
        "pos": "GK",
        "name": "Marcos Felipe"
      },
      {
        "pos": "RB",
        "name": "Calegari"
      },
      {
        "pos": "CB",
        "name": "Lucca"
      },
      {
        "pos": "CB",
        "name": "Berhan Kutlay Şatlı"
      },
      {
        "pos": "LB",
        "name": "Talha Ülvan"
      },
      {
        "pos": "CDM",
        "name": "Mateusz Legowski"
      },
      {
        "pos": "CM",
        "name": "Charles-André Raux-Yao"
      },
      {
        "pos": "CAM",
        "name": "Emre Akbaba"
      },
      {
        "pos": "RW",
        "name": "Dorin Rotariu"
      },
      {
        "pos": "LW",
        "name": "Lenny Pintor"
      },
      {
        "pos": "ST",
        "name": "Umut Bozok"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Jankat Yılmaz"
      },
      {
        "pos": "CB",
        "name": "Seyfettin Anıl Yaşar"
      },
      {
        "pos": "LB",
        "name": "Gilbert Mendy"
      },
      {
        "pos": "CDM",
        "name": "Taşkın İlter"
      },
      {
        "pos": "CAM",
        "name": "Ismaila Manga"
      },
      {
        "pos": "RW",
        "name": "Christ Sadia"
      },
      {
        "pos": "RW",
        "name": "Ángel Torres"
      },
      {
        "pos": "ST",
        "name": "Abdou Khadre Sy"
      }
    ],
    "roles": {
      "captain": "Emre Akbaba",
      "penalty": "Umut Bozok",
      "freeKick": "Emre Akbaba"
    }
  },
  "göztepe": {
    "name": "Göztepe",
    "starting": [
      {
        "pos": "GK",
        "name": "Mateusz Lis"
      },
      {
        "pos": "RB",
        "name": "Arda Okan Kurtulan"
      },
      {
        "pos": "CB",
        "name": "Héliton"
      },
      {
        "pos": "CB",
        "name": "Allan Godói"
      },
      {
        "pos": "LB",
        "name": "İsmail Köybaşı"
      },
      {
        "pos": "CDM",
        "name": "Anthony Dennis"
      },
      {
        "pos": "CM",
        "name": "Musah Mohammed"
      },
      {
        "pos": "RW",
        "name": "Filip Krastev"
      },
      {
        "pos": "CAM",
        "name": "Alexis Antunes"
      },
      {
        "pos": "LW",
        "name": "Amin Cherni"
      },
      {
        "pos": "ST",
        "name": "Juan"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Ekrem Kılıçarslan"
      },
      {
        "pos": "CB",
        "name": "Furkan Bayır"
      },
      {
        "pos": "RB",
        "name": "Uğur Kaan Yıldız"
      },
      {
        "pos": "CDM",
        "name": "Novatus Miroshi"
      },
      {
        "pos": "CAM",
        "name": "Efkan Bekiroğlu"
      },
      {
        "pos": "RM",
        "name": "Ogün Bayrak"
      },
      {
        "pos": "ST",
        "name": "Janderson"
      },
      {
        "pos": "ST",
        "name": "Guilherme Luiz"
      }
    ],
    "roles": {
      "captain": "Mateusz Lis",
      "penalty": "Juan",
      "freeKick": "Alexis Antunes"
    }
  },
  "konyaspor": {
    "name": "Konyaspor",
    "starting": [
      {
        "pos": "GK",
        "name": "Deniz Ertaş"
      },
      {
        "pos": "RB",
        "name": "Yhoan Andzouana"
      },
      {
        "pos": "CB",
        "name": "Adamo Nagalo"
      },
      {
        "pos": "CB",
        "name": "Adil Demirbağ"
      },
      {
        "pos": "LB",
        "name": "Yasir Subaşı"
      },
      {
        "pos": "CDM",
        "name": "Jin-ho Jo"
      },
      {
        "pos": "CM",
        "name": "Morten Bjørlo"
      },
      {
        "pos": "RW",
        "name": "Kazeem Olaigbe"
      },
      {
        "pos": "CAM",
        "name": "Enis Bardhi"
      },
      {
        "pos": "LW",
        "name": "Diogo Gonçalves"
      },
      {
        "pos": "ST",
        "name": "Jackson Muleka"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Bahadır Güngördü"
      },
      {
        "pos": "CB",
        "name": "Riechedly Bazoer"
      },
      {
        "pos": "LB",
        "name": "Arif Boşluk"
      },
      {
        "pos": "CDM",
        "name": "Marko Jevtovic"
      },
      {
        "pos": "CM",
        "name": "Berkan Kutlu"
      },
      {
        "pos": "CM",
        "name": "Melih İbrahimoğlu"
      },
      {
        "pos": "RW",
        "name": "Deniz Türüç"
      },
      {
        "pos": "ST",
        "name": "Blaz Kramer"
      }
    ],
    "roles": {
      "captain": "Enis Bardhi",
      "penalty": "Kazeem Olaigbe",
      "freeKick": "Enis Bardhi"
    }
  },
  "rizespor": {
    "name": "Çaykur Rizespor",
    "starting": [
      {
        "pos": "GK",
        "name": "Yahia Fofana"
      },
      {
        "pos": "RB",
        "name": "Mithat Pala"
      },
      {
        "pos": "CB",
        "name": "Attila Mocsi"
      },
      {
        "pos": "CB",
        "name": "Samet Akaydin"
      },
      {
        "pos": "LB",
        "name": "Casper Højer"
      },
      {
        "pos": "CDM",
        "name": "Taylan Antalyalı"
      },
      {
        "pos": "CM",
        "name": "Qazim Laci"
      },
      {
        "pos": "CM",
        "name": "Ibrahim Olawoyin"
      },
      {
        "pos": "LW",
        "name": "Valentin Mihăilă"
      },
      {
        "pos": "RW",
        "name": "Loide Augusto"
      },
      {
        "pos": "ST",
        "name": "Frantzdy Pierrot"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Erdem Canpolat"
      },
      {
        "pos": "CB",
        "name": "Khusniddin Alikulov"
      },
      {
        "pos": "CB",
        "name": "Emir Ortakaya"
      },
      {
        "pos": "CDM",
        "name": "Giannis Papanikolaou"
      },
      {
        "pos": "CM",
        "name": "Muhamed Buljubasic"
      },
      {
        "pos": "LW",
        "name": "Altin Zeqiri"
      },
      {
        "pos": "ST",
        "name": "Ali Sowe"
      },
      {
        "pos": "LW",
        "name": "Emrecan Bulut"
      }
    ],
    "roles": {
      "captain": "Taylan Antalyalı",
      "penalty": "Frantzdy Pierrot",
      "freeKick": "Valentin Mihăilă"
    }
  },
  "gaziantep": {
    "name": "Gaziantep FK",
    "starting": [
      {
        "pos": "GK",
        "name": "Günay Güvenç"
      },
      {
        "pos": "RB",
        "name": "Ömürcan Artan"
      },
      {
        "pos": "CB",
        "name": "Ertuğrul Ersoy"
      },
      {
        "pos": "CB",
        "name": "Arda Kızıldağ"
      },
      {
        "pos": "LB",
        "name": "Moustapha Kondé"
      },
      {
        "pos": "CDM",
        "name": "Marko Jevtovic"
      },
      {
        "pos": "CM",
        "name": "Oğuz Ceylan"
      },
      {
        "pos": "CAM",
        "name": "Alexandru Maxim"
      },
      {
        "pos": "RW",
        "name": "Ognjen Ozegovic"
      },
      {
        "pos": "LW",
        "name": "Muhammed Gümüşkaya"
      },
      {
        "pos": "ST",
        "name": "Denis Drăguş"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Burak Bozan"
      },
      {
        "pos": "CB",
        "name": "Ulaş Zengin"
      },
      {
        "pos": "CB",
        "name": "Papy Djilobodji"
      },
      {
        "pos": "CM",
        "name": "Furkan Soyalp"
      },
      {
        "pos": "CM",
        "name": "Mirza Cihan"
      },
      {
        "pos": "LW",
        "name": "Joel Figueroa"
      },
      {
        "pos": "ST",
        "name": "Eren Derdiyok"
      }
    ],
    "roles": {
      "captain": "Alexandru Maxim",
      "penalty": "Alexandru Maxim",
      "freeKick": "Alexandru Maxim"
    }
  },
  "erzurumspor": {
    "name": "Erzurumspor FK",
    "starting": [
      {
        "pos": "GK",
        "name": "Göktuğ Bakırbaş"
      },
      {
        "pos": "RB",
        "name": "Mert Önal"
      },
      {
        "pos": "CB",
        "name": "Ömer Arda Kara"
      },
      {
        "pos": "CB",
        "name": "Uğurcan Sönmez"
      },
      {
        "pos": "LB",
        "name": "Mücahit Albayrak"
      },
      {
        "pos": "CDM",
        "name": "Brandon Baiye"
      },
      {
        "pos": "CM",
        "name": "Giovanni Crociata"
      },
      {
        "pos": "CM",
        "name": "Sefa Akgün"
      },
      {
        "pos": "RW",
        "name": "Benhur Keser"
      },
      {
        "pos": "LW",
        "name": "Fernando Andrade"
      },
      {
        "pos": "ST",
        "name": "Martín Rodríguez"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Alperen Karaca"
      },
      {
        "pos": "CDM",
        "name": "Adem Eren Kabak"
      },
      {
        "pos": "LW",
        "name": "Furkan Özhan"
      },
      {
        "pos": "CM",
        "name": "Murat Cem Akpınar"
      },
      {
        "pos": "LW",
        "name": "Mustafa Fettahoğlu"
      },
      {
        "pos": "CM",
        "name": "Muhammed Emin Yavaş"
      },
      {
        "pos": "CDM",
        "name": "Batuhan Artarslan"
      },
      {
        "pos": "LW",
        "name": "Marko Bozic"
      }
    ],
    "roles": {
      "captain": "Giovanni Crociata",
      "penalty": "Fernando Andrade",
      "freeKick": "Martín Rodríguez"
    }
  },
  "gençlerbirliği": {
    "name": "Gençlerbirliği",
    "starting": [
      {
        "pos": "GK",
        "name": "Berk Deniz Çukurcu"
      },
      {
        "pos": "RB",
        "name": "Pedro Pereira"
      },
      {
        "pos": "CB",
        "name": "Abdurrahim Dursun"
      },
      {
        "pos": "CB",
        "name": "Arda Çağan Çelik"
      },
      {
        "pos": "LB",
        "name": "Matej Hanousek"
      },
      {
        "pos": "CDM",
        "name": "Tom Dele-Bashiru"
      },
      {
        "pos": "CM",
        "name": "Franco Tongya"
      },
      {
        "pos": "CAM",
        "name": "Dal Varesanovic"
      },
      {
        "pos": "RW",
        "name": "Adama Traoré"
      },
      {
        "pos": "LW",
        "name": "Henry Onyekuru"
      },
      {
        "pos": "ST",
        "name": "Metehan Mimaroğlu"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Ricardo Velho"
      },
      {
        "pos": "CB",
        "name": "Mikail Okyar"
      },
      {
        "pos": "RB",
        "name": "Fıratcan Üzüm"
      },
      {
        "pos": "CM",
        "name": "Oğulcan Ülgün"
      },
      {
        "pos": "CDM",
        "name": "Peter Etebo"
      },
      {
        "pos": "RW",
        "name": "Cihan Çanak"
      },
      {
        "pos": "CAM",
        "name": "Göktan Gürpüz"
      },
      {
        "pos": "CM",
        "name": "Samed Onur"
      }
    ],
    "roles": {
      "captain": "Tom Dele-Bashiru",
      "penalty": "Henry Onyekuru",
      "freeKick": "Dal Varesanovic"
    }
  },
  "çorum": {
    "name": "Çorum FK",
    "starting": [
      {
        "pos": "GK",
        "name": "Hasan Hüseyin Akınay"
      },
      {
        "pos": "RB",
        "name": "Kerem Kalafat"
      },
      {
        "pos": "CB",
        "name": "Joseph Attamah"
      },
      {
        "pos": "CB",
        "name": "Arda Şengül"
      },
      {
        "pos": "LB",
        "name": "Cemali Sertel"
      },
      {
        "pos": "CDM",
        "name": "Ferhat Yazgan"
      },
      {
        "pos": "CM",
        "name": "Atakan Akkaynak"
      },
      {
        "pos": "CAM",
        "name": "Danijel Aleksic"
      },
      {
        "pos": "LW",
        "name": "İbrahim Zubairu"
      },
      {
        "pos": "RW",
        "name": "Yusuf Erdoğan"
      },
      {
        "pos": "ST",
        "name": "Mame Thiam"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "İbrahim Sehic"
      },
      {
        "pos": "CB",
        "name": "Sinan Osmanoğlu"
      },
      {
        "pos": "LB",
        "name": "Erkan Kaş"
      },
      {
        "pos": "CDM",
        "name": "Atakan Cangöz"
      },
      {
        "pos": "CM",
        "name": "Ahmed Ildız"
      },
      {
        "pos": "CM",
        "name": "Oğuz Gürbulak"
      },
      {
        "pos": "LW",
        "name": "Burak Çoban"
      },
      {
        "pos": "ST",
        "name": "Braian Samudio"
      }
    ],
    "roles": {
      "captain": "Ferhat Yazgan",
      "penalty": "Mame Thiam",
      "freeKick": "Danijel Aleksic"
    }
  },
  "kocaelispor": {
    "name": "Kocaelispor",
    "starting": [
      {
        "pos": "GK",
        "name": "Aleksandar Jovanovic"
      },
      {
        "pos": "RB",
        "name": "Ahmet Oğuz"
      },
      {
        "pos": "CB",
        "name": "Botond Balogh"
      },
      {
        "pos": "CB",
        "name": "Hrvoje Smolcic"
      },
      {
        "pos": "LB",
        "name": "Massadio Haïdara"
      },
      {
        "pos": "CDM",
        "name": "Mahamadou Susoho"
      },
      {
        "pos": "CM",
        "name": "Karol Linetty"
      },
      {
        "pos": "CM",
        "name": "Habib Keïta"
      },
      {
        "pos": "RW",
        "name": "Dan Agyei"
      },
      {
        "pos": "LW",
        "name": "Darko Churlinov"
      },
      {
        "pos": "ST",
        "name": "Bruno Petkovic"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Serhat Öztaşdelen"
      },
      {
        "pos": "LB",
        "name": "Muharrem Cinan"
      },
      {
        "pos": "RB",
        "name": "Anfernee Dijksteel"
      },
      {
        "pos": "CM",
        "name": "Joseph Nonge"
      },
      {
        "pos": "CM",
        "name": "Tayfur Bingöl"
      },
      {
        "pos": "CM",
        "name": "Samet Yalçın"
      },
      {
        "pos": "LW",
        "name": "Rigoberto Rivas"
      },
      {
        "pos": "ST",
        "name": "Serdar Dursun"
      }
    ],
    "roles": {
      "captain": "Muharrem Cinan",
      "penalty": "Bruno Petkovic",
      "freeKick": "Karol Linetty"
    }
  },
  "amedspor": {
    "name": "Amedspor",
    "starting": [
      {
        "pos": "GK",
        "name": "Erce Kardeşler"
      },
      {
        "pos": "RB",
        "name": "Celal Hanalp"
      },
      {
        "pos": "CB",
        "name": "Kahraman Demirtaş"
      },
      {
        "pos": "CB",
        "name": "Oleksandr Syrota"
      },
      {
        "pos": "LB",
        "name": "Hasan Ali Kaldırım"
      },
      {
        "pos": "CDM",
        "name": "Sinan Kurt"
      },
      {
        "pos": "CM",
        "name": "Adama Traoré"
      },
      {
        "pos": "CAM",
        "name": "Dia Saba"
      },
      {
        "pos": "RW",
        "name": "Daniel Moreno"
      },
      {
        "pos": "LW",
        "name": "Felix Afena-Gyan"
      },
      {
        "pos": "ST",
        "name": "Mbaye Diagne"
      }
    ],
    "subs": [
      {
        "pos": "GK",
        "name": "Abdulsamed Damlu"
      },
      {
        "pos": "CB",
        "name": "Mehmet Yeşil"
      },
      {
        "pos": "LB",
        "name": "Murat Uçar"
      },
      {
        "pos": "CDM",
        "name": "Atakan Müjde"
      },
      {
        "pos": "CM",
        "name": "Cem Üstündağ"
      },
      {
        "pos": "CAM",
        "name": "Çekdar Orhan"
      },
      {
        "pos": "RW",
        "name": "Emrah Başsan"
      },
      {
        "pos": "LW",
        "name": "Zdravko Dimitrov"
      }
    ],
    "roles": {
      "captain": "Hasan Ali Kaldırım",
      "penalty": "Mbaye Diagne",
      "freeKick": "Dia Saba"
    }
  },
  "real madrid": {
    "name": "Real Madrid",
    "starting": [
      { "pos": "GK", "name": "Thibaut Courtois" },
      { "pos": "RB", "name": "Dani Carvajal" },
      { "pos": "CB", "name": "Antonio Rüdiger" },
      { "pos": "CB", "name": "David Alaba" },
      { "pos": "LB", "name": "Ferland Mendy" },
      { "pos": "CM", "name": "Federico Valverde" },
      { "pos": "CM", "name": "Eduardo Camavinga" },
      { "pos": "CM", "name": "Jude Bellingham" },
      { "pos": "RW", "name": "Rodrygo" },
      { "pos": "LW", "name": "Vinícius Júnior" },
      { "pos": "ST", "name": "Kylian Mbappé" }
    ],
    "subs": [
      { "pos": "CM", "name": "Luka Modrić" },
      { "pos": "CB", "name": "Eder Militão" },
      { "pos": "CAM", "name": "Brahim Díaz" },
      { "pos": "GK", "name": "Thibaut Courtois" }
    ]
  },
  "barcelona": {
    "name": "Barcelona",
    "starting": [
      { "pos": "GK", "name": "Marc-André ter Stegen" },
      { "pos": "RB", "name": "Jules Koundé" },
      { "pos": "CB", "name": "Ronald Araújo" },
      { "pos": "CB", "name": "Andreas Christensen" },
      { "pos": "LB", "name": "Alejandro Balde" },
      { "pos": "CM", "name": "Pedri" },
      { "pos": "CM", "name": "Frenkie de Jong" },
      { "pos": "CM", "name": "Gavi" },
      { "pos": "RW", "name": "Lamine Yamal" },
      { "pos": "LW", "name": "Raphinha" },
      { "pos": "ST", "name": "Robert Lewandowski" }
    ],
    "subs": [
      { "pos": "CM", "name": "İlkay Gündoğan" },
      { "pos": "CB", "name": "Pau Cubarsí" },
      { "pos": "RW", "name": "Ferran Torres" },
      { "pos": "GK", "name": "Marc-André ter Stegen" }
    ]
  },
  "manchester city": {
    "name": "Manchester City",
    "starting": [
      { "pos": "GK", "name": "Ederson" },
      { "pos": "RB", "name": "Kyle Walker" },
      { "pos": "CB", "name": "Rúben Dias" },
      { "pos": "CB", "name": "John Stones" },
      { "pos": "LB", "name": "Joško Gvardiol" },
      { "pos": "CDM", "name": "Rodri" },
      { "pos": "CM", "name": "Kevin De Bruyne" },
      { "pos": "CM", "name": "Bernardo Silva" },
      { "pos": "RW", "name": "Phil Foden" },
      { "pos": "LW", "name": "Jack Grealish" },
      { "pos": "ST", "name": "Erling Haaland" }
    ],
    "subs": [
      { "pos": "ST", "name": "Julián Álvarez" },
      { "pos": "CB", "name": "Manuel Akanji" },
      { "pos": "CM", "name": "Mateo Kovačić" },
      { "pos": "GK", "name": "Ederson" }
    ]
  },
  "bayern munich": {
    "name": "Bayern Munich",
    "starting": [
      { "pos": "GK", "name": "Manuel Neuer" },
      { "pos": "RB", "name": "Joshua Kimmich" },
      { "pos": "CB", "name": "Dayot Upamecano" },
      { "pos": "CB", "name": "Kim Min-jae" },
      { "pos": "LB", "name": "Alphonso Davies" },
      { "pos": "CDM", "name": "Konrad Laimer" },
      { "pos": "CM", "name": "Jamal Musiala" },
      { "pos": "CM", "name": "Leon Goretzka" },
      { "pos": "RW", "name": "Leroy Sané" },
      { "pos": "LW", "name": "Kingsley Coman" },
      { "pos": "ST", "name": "Harry Kane" }
    ],
    "subs": [
      { "pos": "RW", "name": "Serge Gnabry" },
      { "pos": "CB", "name": "Matthijs de Ligt" },
      { "pos": "CM", "name": "Aleksandar Pavlović" },
      { "pos": "GK", "name": "Manuel Neuer" }
    ]
  },
  "psg": {
    "name": "PSG",
    "starting": [
      { "pos": "GK", "name": "Gianluigi Donnarumma" },
      { "pos": "RB", "name": "Achraf Hakimi" },
      { "pos": "CB", "name": "Marquinhos" },
      { "pos": "CB", "name": "Milan Škriniar" },
      { "pos": "LB", "name": "Nuno Mendes" },
      { "pos": "CM", "name": "Vitinha" },
      { "pos": "CM", "name": "Warren Zaïre-Emery" },
      { "pos": "CAM", "name": "Kang-in Lee" },
      { "pos": "RW", "name": "Ousmane Dembélé" },
      { "pos": "LW", "name": "Bradley Barcola" },
      { "pos": "ST", "name": "Gonçalo Ramos" }
    ],
    "subs": [
      { "pos": "CB", "name": "Lucas Hernández" },
      { "pos": "GK", "name": "Gianluigi Donnarumma" }
    ]
  },
  "liverpool": {
    "name": "Liverpool",
    "starting": [
      { "pos": "GK", "name": "Alisson Becker" },
      { "pos": "RB", "name": "Trent Alexander-Arnold" },
      { "pos": "CB", "name": "Virgil van Dijk" },
      { "pos": "CB", "name": "Ibrahima Konaté" },
      { "pos": "LB", "name": "Andy Robertson" },
      { "pos": "CM", "name": "Alexis Mac Allister" },
      { "pos": "CM", "name": "Dominik Szoboszlai" },
      { "pos": "RW", "name": "Mohamed Salah" },
      { "pos": "LW", "name": "Luis Díaz" },
      { "pos": "ST", "name": "Darwin Núñez" },
      { "pos": "LW", "name": "Diogo Jota" }
    ],
    "subs": [
      { "pos": "CM", "name": "Ryan Gravenberch" },
      { "pos": "CB", "name": "Jarell Quansah" },
      { "pos": "GK", "name": "Alisson Becker" }
    ]
  },
  "manchester united": {
    "name": "Manchester United",
    "starting": [
      { "pos": "GK", "name": "André Onana" },
      { "pos": "RB", "name": "Diogo Dalot" },
      { "pos": "CB", "name": "Lisandro Martínez" },
      { "pos": "CB", "name": "Raphaël Varane" },
      { "pos": "LB", "name": "Luke Shaw" },
      { "pos": "CDM", "name": "Casemiro" },
      { "pos": "CAM", "name": "Bruno Fernandes" },
      { "pos": "CM", "name": "Mason Mount" },
      { "pos": "LW", "name": "Marcus Rashford" },
      { "pos": "RW", "name": "Antony" },
      { "pos": "ST", "name": "Rasmus Højlund" }
    ],
    "subs": [
      { "pos": "LW", "name": "Alejandro Garnacho" },
      { "pos": "CM", "name": "Kobbie Mainoo" },
      { "pos": "CB", "name": "Harry Maguire" },
      { "pos": "GK", "name": "André Onana" }
    ]
  },
  "juventus": {
    "name": "Juventus",
    "starting": [
      { "pos": "GK", "name": "Wojciech Szczęsny" },
      { "pos": "RB", "name": "Andrea Cambiaso" },
      { "pos": "CB", "name": "Federico Gatti" },
      { "pos": "CB", "name": "Gleison Bremer" },
      { "pos": "LB", "name": "Alex Sandro" },
      { "pos": "CDM", "name": "Manuel Locatelli" },
      { "pos": "CM", "name": "Adrien Rabiot" },
      { "pos": "CM", "name": "Teun Koopmeiners" },
      { "pos": "LW", "name": "Federico Chiesa" },
      { "pos": "ST", "name": "Dušan Vlahović" },
      { "pos": "LW", "name": "Kenan Yıldız" }
    ],
    "subs": [
      { "pos": "CM", "name": "Nicolò Fagioli" },
      { "pos": "CB", "name": "Pierre Kalulu" },
      { "pos": "GK", "name": "Wojciech Szczęsny" }
    ]
  },
  "ac milan": {
    "name": "AC Milan",
    "starting": [
      { "pos": "GK", "name": "Mike Maignan" },
      { "pos": "RB", "name": "Davide Calabria" },
      { "pos": "CB", "name": "Fikayo Tomori" },
      { "pos": "CB", "name": "Ronald Araújo" },
      { "pos": "LB", "name": "Theo Hernández" },
      { "pos": "CM", "name": "Tijjani Reijnders" },
      { "pos": "CM", "name": "Yunus Musah" },
      { "pos": "LW", "name": "Rafael Leão" },
      { "pos": "RW", "name": "Christian Pulisic" },
      { "pos": "RW", "name": "Samuel Chukwueze" },
      { "pos": "ST", "name": "Olivier Giroud" }
    ],
    "subs": [
      { "pos": "ST", "name": "Luka Jović" },
      { "pos": "GK", "name": "Mike Maignan" }
    ]
  },
  "inter milan": {
    "name": "Inter Milan",
    "starting": [
      { "pos": "GK", "name": "Yann Sommer" },
      { "pos": "RB", "name": "Denzel Dumfries" },
      { "pos": "CB", "name": "Francesco Acerbi" },
      { "pos": "CB", "name": "Alessandro Bastoni" },
      { "pos": "LB", "name": "Federico Dimarco" },
      { "pos": "CM", "name": "Nicolò Barella" },
      { "pos": "CM", "name": "Hakan Çalhanoğlu" },
      { "pos": "CM", "name": "Henrikh Mkhitaryan" },
      { "pos": "ST", "name": "Lautaro Martínez" },
      { "pos": "ST", "name": "Marcus Thuram" },
      { "pos": "CB", "name": "Matteo Darmian" }
    ],
    "subs": [
      { "pos": "CM", "name": "Kristjan Asllani" },
      { "pos": "GK", "name": "Yann Sommer" }
    ]
  },
  "arsenal": {
    "name": "Arsenal",
    "starting": [
      { "pos": "GK", "name": "David Raya" },
      { "pos": "RB", "name": "Ben White" },
      { "pos": "CB", "name": "William Saliba" },
      { "pos": "CB", "name": "Gabriel Magalhães" },
      { "pos": "LB", "name": "Kieran Tierney" },
      { "pos": "CDM", "name": "Declan Rice" },
      { "pos": "CAM", "name": "Martin Ødegaard" },
      { "pos": "CM", "name": "Mikel Merino" },
      { "pos": "RW", "name": "Bukayo Saka" },
      { "pos": "LW", "name": "Leandro Trossard" },
      { "pos": "ST", "name": "Gabriel Jesus" }
    ],
    "subs": [
      { "pos": "CAM", "name": "Kai Havertz" },
      { "pos": "GK", "name": "David Raya" }
    ]
  },
  "atletico madrid": {
    "name": "Atletico Madrid",
    "starting": [
      { "pos": "GK", "name": "Jan Oblak" },
      { "pos": "RB", "name": "Nahuel Molina" },
      { "pos": "CB", "name": "José Giménez" },
      { "pos": "CB", "name": "Mario Hermoso" },
      { "pos": "LB", "name": "Reinildo Mandava" },
      { "pos": "CM", "name": "Rodrigo De Paul" },
      { "pos": "CM", "name": "Marcos Llorente" },
      { "pos": "CAM", "name": "Antoine Griezmann" },
      { "pos": "ST", "name": "Julián Alvarez" },
      { "pos": "ST", "name": "Ángel Correa" },
      { "pos": "LW", "name": "Samuel Lino" }
    ],
    "subs": [
      { "pos": "GK", "name": "Jan Oblak" }
    ]
    },

    "chelsea_fc": {
    "name": "Chelsea FC",
    "starting": [
    { "pos": "GK", "name": "Robert Sánchez" },
    { "pos": "GK", "name": "Filip Jørgensen" },
    { "pos": "GK", "name": "Gabriel Slonina" },
    { "pos": "GK", "name": "Teddy Sharman-Lowe" },
    { "pos": "CB", "name": "Levi Colwill" },
    { "pos": "CB", "name": "Trevoh Chalobah" },
    { "pos": "CB", "name": "Wesley Fofana" },
    { "pos": "CB", "name": "Mamadou Sarr" },
    { "pos": "CB", "name": "Tosin Adarabioyo" },
    { "pos": "CB", "name": "Benoît Badiashile" },
    { "pos": "LB", "name": "Marc Cucurella" },
    ],
    "subs": [
    { "pos": "LB", "name": "Jorrel Hato" },
    { "pos": "RB", "name": "Malo Gusto" },
    { "pos": "RB", "name": "Josh Acheampong" },
    { "pos": "CDM", "name": "Moisés Caicedo" },
    { "pos": "CDM", "name": "Roméo Lavia" },
    { "pos": "CDM", "name": "Dário Essugo" },
    { "pos": "CM", "name": "Enzo Fernández" },
    { "pos": "CM", "name": "Andrey Santos" },
    { "pos": "CAM", "name": "Cole Palmer" },
    { "pos": "LW", "name": "Jamie Gittens" },
    { "pos": "LW", "name": "Alejandro Garnacho" },
    { "pos": "RW", "name": "Pedro Neto" },
    ]
    },
    "tottenham_hotspur": {
    "name": "Tottenham Hotspur",
    "starting": [
    { "pos": "GK", "name": "Guglielmo Vicario" },
    { "pos": "GK", "name": "Antonín Kinský" },
    { "pos": "GK", "name": "Brandon Austin" },
    { "pos": "CB", "name": "Micky van de Ven" },
    { "pos": "CB", "name": "Kevin Danso" },
    { "pos": "CB", "name": "Radu Drăgușin" },
    { "pos": "CB", "name": "Ashley Phillips" },
    { "pos": "CB", "name": "Ben Davies" },
    { "pos": "LB", "name": "Destiny Udogie" },
    { "pos": "LB", "name": "Djed Spence" },
    { "pos": "LB", "name": "Souza" },
    ],
    "subs": [
    { "pos": "RB", "name": "Pedro Porro" },
    { "pos": "CDM", "name": "Rodrigo Bentancur" },
    { "pos": "CDM", "name": "João Palhinha" },
    { "pos": "CDM", "name": "Yves Bissouma" },
    { "pos": "CM", "name": "Archie Gray" },
    { "pos": "CM", "name": "Lucas Bergvall" },
    { "pos": "CM", "name": "Conor Gallagher" },
    { "pos": "CM", "name": "Pape Matar Sarr" },
    { "pos": "CAM", "name": "James Maddison" },
    { "pos": "RW", "name": "Mohammed Kudus" },
    { "pos": "CF", "name": "Dominic Solanke" },
    { "pos": "CF", "name": "Richarlison" },
    ]
    },
    "newcastle_united": {
    "name": "Newcastle United",
    "starting": [
    { "pos": "GK", "name": "Aaron Ramsdale" },
    { "pos": "GK", "name": "Nick Pope" },
    { "pos": "GK", "name": "John Ruddy" },
    { "pos": "GK", "name": "Mark Gillespie" },
    { "pos": "CB", "name": "Malick Thiaw" },
    { "pos": "CB", "name": "Sven Botman" },
    { "pos": "CB", "name": "Fabian Schär" },
    { "pos": "CB", "name": "Dan Burn" },
    { "pos": "LB", "name": "Lewis Hall" },
    { "pos": "LB", "name": "Matt Targett" },
    { "pos": "LB", "name": "Alex Murphy" },
    ],
    "subs": [
    { "pos": "RB", "name": "Kieran Trippier" },
    { "pos": "RB", "name": "Harrison Ashby" },
    { "pos": "RB", "name": "Emil Krafth" },
    { "pos": "CDM", "name": "Sandro Tonali" },
    { "pos": "CM", "name": "Bruno Guimarães" },
    { "pos": "CM", "name": "Jacob Ramsey" },
    { "pos": "CM", "name": "Joelinton" },
    { "pos": "CM", "name": "Joe Willock" },
    { "pos": "CAM", "name": "Joe White" },
    { "pos": "LW", "name": "Anthony Gordon" },
    { "pos": "LW", "name": "Harvey Barnes" },
    { "pos": "RW", "name": "Anthony Elanga" },
    ]
    },
    "borussia_dortmund": {
    "name": "Borussia Dortmund",
    "starting": [
    { "pos": "GK", "name": "Gregor Kobel" },
    { "pos": "GK", "name": "Alexander Meyer" },
    { "pos": "GK", "name": "Patrick Drewes" },
    { "pos": "GK", "name": "Silas Ostrzinski" },
    { "pos": "CB", "name": "Waldemar Anton" },
    { "pos": "CB", "name": "Luca Reggiani" },
    { "pos": "CB", "name": "Ramy Bensebaini" },
    { "pos": "CB", "name": "Niklas Süle" },
    { "pos": "CB", "name": "Filippo Mane" },
    { "pos": "LB", "name": "Daniel Svensson" },
    { "pos": "LB", "name": "Almugera Kabar" },
    ],
    "subs": [
    { "pos": "RB", "name": "Julian Ryerson" },
    { "pos": "CDM", "name": "Salih Özcan" },
    { "pos": "CM", "name": "Felix Nmecha" },
    { "pos": "CM", "name": "Jobe Bellingham" },
    { "pos": "CM", "name": "Carney Chukwuemeka" },
    { "pos": "CM", "name": "Marcel Sabitzer" },
    { "pos": "CM", "name": "Yan Couto" },
    { "pos": "CAM", "name": "Julian Brandt" },
    { "pos": "RW", "name": "Karim Adeyemi" },
    { "pos": "ST", "name": "Samuele Inácio" },
    { "pos": "CF", "name": "Maximilian Beier" },
    { "pos": "CF", "name": "Serhou Guirassy" },
    ]
    },
    "sporting_cp": {
    "name": "Sporting CP",
    "starting": [
    { "pos": "GK", "name": "Rui Silva" },
    { "pos": "GK", "name": "João Virgínia" },
    { "pos": "CB", "name": "Ousmane Diomande" },
    { "pos": "CB", "name": "Gonçalo Inácio" },
    { "pos": "CB", "name": "Eduardo Quaresma" },
    { "pos": "LB", "name": "Maxi Araújo" },
    { "pos": "LB", "name": "Nuno Santos" },
    { "pos": "LB", "name": "Ricardo Mangas" },
    { "pos": "RB", "name": "Georgios Vagiannidis" },
    { "pos": "RB", "name": "Salvador Blopa" },
    { "pos": "CM", "name": "Daniel Bragança" },
    ],
    "subs": [
    { "pos": "CM", "name": "Hidemasa Morita" },
    { "pos": "CM", "name": "Giorgi Kochorashvili" },
    { "pos": "CAM", "name": "Francisco Trincão" },
    { "pos": "LW", "name": "Pedro Gonçalves" },
    { "pos": "RW", "name": "Geovany Quenda" },
    { "pos": "RW", "name": "Geny Catamo" },
    { "pos": "RW", "name": "Luís Guilherme" },
    { "pos": "RW", "name": "Souleymane Faye" },
    { "pos": "CF", "name": "Luis Suárez" },
    { "pos": "CF", "name": "Fotis Ioannidis" },
    { "pos": "CF", "name": "Rafael Nel" },
    ]
    },
    "bayer_04_leverkusen": {
    "name": "Bayer 04 Leverkusen",
    "starting": [
    { "pos": "GK", "name": "Mark Flekken" },
    { "pos": "GK", "name": "Jonas Omlin" },
    { "pos": "GK", "name": "Janis Blaswich" },
    { "pos": "GK", "name": "Niklas Lomb" },
    { "pos": "CB", "name": "Jarell Quansah" },
    { "pos": "CB", "name": "Edmond Tapsoba" },
    { "pos": "CB", "name": "Loïc Badé" },
    { "pos": "CB", "name": "Axel Tape" },
    { "pos": "CB", "name": "Tim Oermann" },
    { "pos": "CB", "name": "Issa Traoré" },
    { "pos": "LB", "name": "Alejandro Grimaldo" },
    ],
    "subs": [
    { "pos": "RB", "name": "Arthur" },
    { "pos": "RB", "name": "Lucas Vázquez" },
    { "pos": "CDM", "name": "Equi Fernández" },
    { "pos": "CM", "name": "Exequiel Palacios" },
    { "pos": "CM", "name": "Aleix García" },
    { "pos": "CAM", "name": "Ibrahim Maza" },
    { "pos": "CAM", "name": "Malik Tillman" },
    { "pos": "CAM", "name": "Jonas Hofmann" },
    { "pos": "LW", "name": "Eliesse Ben Seghir" },
    { "pos": "RW", "name": "Ernest Poku" },
    { "pos": "RW", "name": "Montrell Culbreath" },
    { "pos": "CF", "name": "Patrik Schick" },
    ]
    },
    "atalanta_bc": {
    "name": "Atalanta BC",
    "starting": [
    { "pos": "GK", "name": "Marco Carnesecchi" },
    { "pos": "GK", "name": "Marco Sportiello" },
    { "pos": "GK", "name": "Francesco Rossi" },
    { "pos": "CB", "name": "Giorgio Scalvini" },
    { "pos": "CB", "name": "Honest Ahanor" },
    { "pos": "CB", "name": "Isak Hien" },
    { "pos": "CB", "name": "Odilon Kossounou" },
    { "pos": "CB", "name": "Berat Djimsiti" },
    { "pos": "CB", "name": "Sead Kolasinac" },
    { "pos": "CM", "name": "Éderson" },
    { "pos": "CM", "name": "Yunus Musah" },
    ],
    "subs": [
    { "pos": "CM", "name": "Mario Pašalić" },
    { "pos": "CM", "name": "Raoul Bellanova" },
    { "pos": "CM", "name": "Davide Zappacosta" },
    { "pos": "CM", "name": "Nicola Zalewski" },
    { "pos": "CM", "name": "Mitchel Bakker" },
    { "pos": "CAM", "name": "Charles De Ketelaere" },
    { "pos": "CAM", "name": "Lazar Samardžić" },
    { "pos": "LW", "name": "Kamaldeen Sulemana" },
    { "pos": "ST", "name": "Giacomo Raspadori" },
    { "pos": "CF", "name": "Nikola Krstović" },
    { "pos": "CF", "name": "Gianluca Scamacca" },
    ]
    },
    "ssc_napoli": {
    "name": "SSC Napoli",
    "starting": [
    { "pos": "GK", "name": "Vanja Milinković-Savić" },
    { "pos": "GK", "name": "Alex Meret" },
    { "pos": "GK", "name": "Nikita Contini" },
    { "pos": "GK", "name": "Mathias Ferrante" },
    { "pos": "CB", "name": "Alessandro Buongiorno" },
    { "pos": "CB", "name": "Sam Beukema" },
    { "pos": "CB", "name": "Amir Rrahmani" },
    { "pos": "CB", "name": "Juan Jesus" },
    { "pos": "LB", "name": "Miguel Gutiérrez" },
    { "pos": "LB", "name": "Mathías Olivera" },
    { "pos": "LB", "name": "Leonardo Spinazzola" },
    ],
    "subs": [
    { "pos": "RB", "name": "Pasquale Mazzocchi" },
    { "pos": "CDM", "name": "Stanislav Lobotka" },
    { "pos": "CM", "name": "Scott McTominay" },
    { "pos": "CM", "name": "Frank Anguissa" },
    { "pos": "CAM", "name": "Antonio Vergara" },
    { "pos": "CAM", "name": "Eljif Elmas" },
    { "pos": "CAM", "name": "Kevin De Bruyne" },
    { "pos": "LW", "name": "Alisson Santos" },
    { "pos": "RW", "name": "David Neres" },
    { "pos": "RW", "name": "Matteo Politano" },
    { "pos": "CF", "name": "Rasmus Højlund" },
    { "pos": "CF", "name": "Giovane" },
    ]
    },
    "monaco": {
    "name": "AS Monaco",
    "starting": [
    { "pos": "GK", "name": "Philipp Köhn" },
    { "pos": "GK", "name": "Lukas Hradecky" },
    { "pos": "GK", "name": "Jules Stawiecki" },
    { "pos": "GK", "name": "Yann Lienard" },
    { "pos": "CB", "name": "Christian Mawissa" },
    { "pos": "CB", "name": "Thilo Kehrer" },
    { "pos": "CB", "name": "Wout Faes" },
    { "pos": "CB", "name": "Eric Dier" },
    { "pos": "LB", "name": "Caio Henrique" },
    { "pos": "RB", "name": "Vanderson" },
    { "pos": "RB", "name": "Jordan Teze" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Aladji Bamba" },
    { "pos": "CM", "name": "Lamine Camara" },
    { "pos": "CM", "name": "Mamadou Coulibaly" },
    { "pos": "CM", "name": "Paul Pogba" },
    { "pos": "CM", "name": "Krépin Diatta" },
    { "pos": "CAM", "name": "Aleksandr Golovin" },
    { "pos": "LW", "name": "Simon Adingra" },
    { "pos": "LW", "name": "Ansu Fati" },
    { "pos": "RW", "name": "Maghnes Akliouche" },
    { "pos": "CF", "name": "Folarin Balogun" },
    { "pos": "CF", "name": "Mika Biereth" },
    { "pos": "CF", "name": "Paris Brunner" },
    ]
    },
    "eintracht_frankfurt": {
    "name": "Eintracht Frankfurt",
    "starting": [
    { "pos": "GK", "name": "Kauã Santos" },
    { "pos": "GK", "name": "Michael Zetterer" },
    { "pos": "GK", "name": "Jens Grahl" },
    { "pos": "GK", "name": "Amil Siljevic" },
    { "pos": "CB", "name": "Arthur Theate" },
    { "pos": "CB", "name": "Aurèle Amenda" },
    { "pos": "LB", "name": "Nathaniel Brown" },
    { "pos": "LB", "name": "Keita Kosugi" },
    { "pos": "RB", "name": "Rasmus Kristensen" },
    { "pos": "RB", "name": "Elias Baum" },
    { "pos": "RB", "name": "Timothy Chandler" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Ellyes Skhiri" },
    { "pos": "CM", "name": "Hugo Larsson" },
    { "pos": "CM", "name": "Mahmoud Dahoud" },
    { "pos": "CAM", "name": "Can Uzun" },
    { "pos": "CAM", "name": "Farès Chaïbi" },
    { "pos": "CAM", "name": "Love Arrhov" },
    { "pos": "CAM", "name": "Mario Götze" },
    { "pos": "LW", "name": "Jean-Mattéo Bahoya" },
    { "pos": "RW", "name": "Ritsu Doan" },
    { "pos": "RW", "name": "Ansgar Knauff" },
    { "pos": "RW", "name": "Ayoube Amaimouni-Echghouyab" },
    { "pos": "CF", "name": "Jonathan Burkardt" },
    ]
    },
    "olympique_marseille": {
    "name": "Olympique Marseille",
    "starting": [
    { "pos": "GK", "name": "Gerónimo Rulli" },
    { "pos": "GK", "name": "Jeffrey de Lange" },
    { "pos": "GK", "name": "Jelle Van Neck" },
    { "pos": "CB", "name": "Facundo Medina" },
    { "pos": "CB", "name": "Benjamin Pavard" },
    { "pos": "CB", "name": "Derek Cornelius" },
    { "pos": "LB", "name": "Emerson" },
    { "pos": "CDM", "name": "Arthur Vermeeren" },
    { "pos": "CDM", "name": "Pierre-Emile Højbjerg" },
    { "pos": "CDM", "name": "Tochukwu Nnadi" },
    { "pos": "CM", "name": "Bilal Nadir" },
    ],
    "subs": [
    { "pos": "CM", "name": "Timothy Weah" },
    { "pos": "CAM", "name": "Ethan Nwaneri" },
    { "pos": "CAM", "name": "Himad Abdelli" },
    { "pos": "LW", "name": "Igor Paixão" },
    { "pos": "RW", "name": "Mason Greenwood" },
    { "pos": "CF", "name": "Amine Gouiri" },
    { "pos": "CF", "name": "Pierre-Emerick Aubameyang" },
    { "pos": "CF", "name": "Ange Lago" },
    ]
    },
    "sl_benfica": {
    "name": "SL Benfica",
    "starting": [
    { "pos": "GK", "name": "Anatoliy Trubin" },
    { "pos": "GK", "name": "Samuel Soares" },
    { "pos": "CB", "name": "Tomás Araújo" },
    { "pos": "CB", "name": "António Silva" },
    { "pos": "LB", "name": "Samuel Dahl" },
    { "pos": "LB", "name": "Sidny Lopes Cabral" },
    { "pos": "LB", "name": "José Neto" },
    { "pos": "RB", "name": "Amar Dedić" },
    { "pos": "RB", "name": "Alexander Bah" },
    { "pos": "RB", "name": "Daniel Banjaqui" },
    { "pos": "CDM", "name": "Richard Ríos" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Enzo Barrenechea" },
    { "pos": "CDM", "name": "Manu Silva" },
    { "pos": "CM", "name": "Leandro Barreiro" },
    { "pos": "CM", "name": "Fredrik Aursnes" },
    { "pos": "CM", "name": "João Veloso" },
    { "pos": "CAM", "name": "Georgiy Sudakov" },
    { "pos": "CAM", "name": "João Rego" },
    { "pos": "LW", "name": "Andreas Schjelderup" },
    { "pos": "LW", "name": "Bruma" },
    { "pos": "RW", "name": "Dodi Lukébakio" },
    { "pos": "ST", "name": "Rafa Silva" },
    { "pos": "CF", "name": "Vangelis Pavlidis" },
    ]
    },
    "psv_eindhoven": {
    "name": "PSV Eindhoven",
    "starting": [
    { "pos": "GK", "name": "Matej Kovar" },
    { "pos": "GK", "name": "Nick Olij" },
    { "pos": "GK", "name": "Niek Schiks" },
    { "pos": "CB", "name": "Yarek Gasiorowski" },
    { "pos": "CB", "name": "Ryan Flamingo" },
    { "pos": "CB", "name": "Armando Obispo" },
    { "pos": "LB", "name": "Mauro Júnior" },
    { "pos": "LB", "name": "Anass Salah-Eddine" },
    { "pos": "RB", "name": "Sergiño Dest" },
    { "pos": "RB", "name": "Kiliann Sildillia" },
    { "pos": "CM", "name": "Joey Veerman" },
    ],
    "subs": [
    { "pos": "CM", "name": "Paul Wanner" },
    { "pos": "CM", "name": "Noah Fernandez" },
    { "pos": "CM", "name": "Joël van den Berg" },
    { "pos": "CAM", "name": "Ismael Saibari" },
    { "pos": "CAM", "name": "Guus Til" },
    { "pos": "LW", "name": "Couhaib Driouech" },
    { "pos": "LW", "name": "Ivan Perišić" },
    { "pos": "RW", "name": "Esmir Bajraktarevic" },
    { "pos": "CF", "name": "Ricardo Pepi" },
    { "pos": "CF", "name": "Myron Boadu" },
    ]
    },
    "villarreal_cf": {
    "name": "Villarreal CF",
    "starting": [
    { "pos": "GK", "name": "Luiz Júnior" },
    { "pos": "GK", "name": "Arnau Tenas" },
    { "pos": "GK", "name": "Diego Conde" },
    { "pos": "CB", "name": "Renato Veiga" },
    { "pos": "CB", "name": "Logan Costa" },
    { "pos": "CB", "name": "Pau Navarro" },
    { "pos": "CB", "name": "Rafa Marín" },
    { "pos": "CB", "name": "Willy Kambwala" },
    { "pos": "LB", "name": "Sergi Cardona" },
    { "pos": "LB", "name": "Alfonso Pedraza" },
    { "pos": "RB", "name": "Santiago Mouriño" },
    ],
    "subs": [
    { "pos": "RB", "name": "Alex Freeman" },
    { "pos": "CDM", "name": "Thomas Partey" },
    { "pos": "CM", "name": "Pape Gueye" },
    { "pos": "CM", "name": "Santi Comesaña" },
    { "pos": "CM", "name": "Carlos Macià" },
    { "pos": "CM", "name": "Dani Parejo" },
    { "pos": "LW", "name": "Alberto Moleiro" },
    { "pos": "LW", "name": "Alfon González" },
    { "pos": "LW", "name": "Hugo López" },
    { "pos": "RW", "name": "Tajon Buchanan" },
    { "pos": "RW", "name": "Nicolas Pépé" },
    { "pos": "CF", "name": "Georges Mikautadze" },
    ]
    },
    "athletic_bilbao": {
    "name": "Athletic Bilbao",
    "starting": [
    { "pos": "GK", "name": "Unai Simón" },
    { "pos": "GK", "name": "Álex Padilla" },
    { "pos": "CB", "name": "Dani Vivian" },
    { "pos": "CB", "name": "Aymeric Laporte" },
    { "pos": "CB", "name": "Aitor Paredes" },
    { "pos": "CB", "name": "Yeray Álvarez" },
    { "pos": "CB", "name": "Unai Egiluz" },
    { "pos": "LB", "name": "Adama Boiro" },
    { "pos": "LB", "name": "Yuri Berchiche" },
    { "pos": "RB", "name": "Jesús Areso" },
    { "pos": "RB", "name": "Andoni Gorosabel" },
    ],
    "subs": [
    { "pos": "RB", "name": "Iñigo Lekue" },
    { "pos": "CDM", "name": "Mikel Vesga" },
    { "pos": "CM", "name": "Mikel Jauregizar" },
    { "pos": "CM", "name": "Beñat Prados" },
    { "pos": "CM", "name": "Alejandro Rego" },
    { "pos": "CM", "name": "Selton Sánchez" },
    { "pos": "CM", "name": "Iñigo Ruiz de Galarreta" },
    { "pos": "CAM", "name": "Oihan Sancet" },
    { "pos": "CAM", "name": "Unai Gómez" },
    { "pos": "LW", "name": "Nico Williams" },
    { "pos": "LW", "name": "Álex Berenguer" },
    { "pos": "LW", "name": "Nico Serrano" },
    ]
    },
    "club_brugge_kv": {
    "name": "Club Brugge KV",
    "starting": [
    { "pos": "GK", "name": "Nordin Jackers" },
    { "pos": "GK", "name": "Simon Mignolet" },
    { "pos": "GK", "name": "Dani van den Heuvel" },
    { "pos": "GK", "name": "Axl De Corte" },
    { "pos": "CB", "name": "Joel Ordóñez" },
    { "pos": "CB", "name": "Jorne Spileers" },
    { "pos": "CB", "name": "Brandon Mechele" },
    { "pos": "CB", "name": "Vince Osuji" },
    { "pos": "LB", "name": "Joaquin Seys" },
    { "pos": "LB", "name": "Bjorn Meijer" },
    { "pos": "RB", "name": "Kyriani Sabbe" },
    ],
    "subs": [
    { "pos": "RB", "name": "Hugo Siquet" },
    { "pos": "CDM", "name": "Raphael Onyedika" },
    { "pos": "CDM", "name": "Lynnt Audoor" },
    { "pos": "CM", "name": "Hugo Vetlesen" },
    { "pos": "CM", "name": "Ludovit Reis" },
    { "pos": "CM", "name": "Alejandro Granados" },
    { "pos": "CAM", "name": "Félix Lemaréchal" },
    { "pos": "CAM", "name": "Cisse Sandra" },
    { "pos": "LW", "name": "Christos Tzolis" },
    { "pos": "LW", "name": "Mamadou Diakhon" },
    { "pos": "LW", "name": "Shandre Campbell" },
    { "pos": "RW", "name": "Carlos Forbs" },
    ]
    },
    "ajax_amsterdam": {
    "name": "Ajax Amsterdam",
    "starting": [
    { "pos": "GK", "name": "Maarten Paes" },
    { "pos": "GK", "name": "Paul Reverson" },
    { "pos": "CB", "name": "Youri Baas" },
    { "pos": "CB", "name": "Josip Sutalo" },
    { "pos": "CB", "name": "Ko Itakura" },
    { "pos": "CB", "name": "Takehiro Tomiyasu" },
    { "pos": "CB", "name": "Aaron Bouwman" },
    { "pos": "RB", "name": "Lucas Rosa" },
    { "pos": "RB", "name": "Anton Gaaei" },
    { "pos": "CDM", "name": "Jorthy Mokio" },
    { "pos": "CDM", "name": "Youri Regeer" },
    ],
    "subs": [
    { "pos": "CM", "name": "Sean Steur" },
    { "pos": "CAM", "name": "Oscar Gloukh" },
    { "pos": "CAM", "name": "Rayane Bounida" },
    { "pos": "LW", "name": "Mika Godts" },
    { "pos": "RW", "name": "Maher Carrizo" },
    { "pos": "RW", "name": "Steven Berghuis" },
    { "pos": "CF", "name": "Kasper Dolberg" },
    { "pos": "CF", "name": "Wout Weghorst" },
    { "pos": "CF", "name": "Don-Angelo Konadu" },
    ]
    },
    "olympiacos_piraeus": {
    "name": "Olympiacos Piraeus",
    "starting": [
    { "pos": "GK", "name": "Konstantinos Tzolakis" },
    { "pos": "GK", "name": "Nikolaos Botis" },
    { "pos": "GK", "name": "Alexandros Paschalakis" },
    { "pos": "GK", "name": "Georgios Kouraklis" },
    { "pos": "CB", "name": "Lorenzo Pirola" },
    { "pos": "CB", "name": "Giulian Biancone" },
    { "pos": "CB", "name": "Alexios Kalogeropoulos" },
    { "pos": "LB", "name": "Francisco Ortega" },
    { "pos": "LB", "name": "Bruno Onyemaechi" },
    { "pos": "RB", "name": "Costinha" },
    { "pos": "RB", "name": "Rodinei" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Santiago Hezze" },
    { "pos": "CDM", "name": "Lorenzo Scipioni" },
    { "pos": "CDM", "name": "Dani García" },
    { "pos": "CDM", "name": "Argyrios Liatsikouras" },
    { "pos": "CM", "name": "Christos Mouzakitis" },
    { "pos": "CM", "name": "Diogo Nascimento" },
    { "pos": "CAM", "name": "Chiquinho" },
    { "pos": "LW", "name": "Daniel Podence" },
    { "pos": "RW", "name": "André Luiz" },
    { "pos": "RW", "name": "Gelson Martins" },
    { "pos": "CF", "name": "Clayton" },
    { "pos": "CF", "name": "Ayoub El Kaabi" },
    ]
    },
    "union_saintgilloise": {
    "name": "Union Saint-Gilloise",
    "starting": [
    { "pos": "GK", "name": "Kjell Scherpen" },
    { "pos": "GK", "name": "Vic Chambaere" },
    { "pos": "GK", "name": "Giorgi Kavlashvili" },
    { "pos": "GK", "name": "Jens Teunckens" },
    { "pos": "CB", "name": "Kevin Mac Allister" },
    { "pos": "CB", "name": "Ross Sykes" },
    { "pos": "CB", "name": "Fedde Leysen" },
    { "pos": "CB", "name": "Mamadou Thierno Barry" },
    { "pos": "CB", "name": "Massiré Sylla" },
    { "pos": "RB", "name": "Louis Patris" },
    { "pos": "RB", "name": "Guillaume François" },
    ],
    "subs": [
    { "pos": "CM", "name": "Adem Zorgane" },
    { "pos": "CM", "name": "Kamiel Van De Perre" },
    { "pos": "CM", "name": "Besfort Zeneli" },
    { "pos": "CM", "name": "Rob Schoofs" },
    { "pos": "CM", "name": "Ivan Pavlic" },
    { "pos": "CM", "name": "Anan Khalaili" },
    { "pos": "CM", "name": "Ousseynou Niang" },
    { "pos": "CAM", "name": "Anouar Ait El Hadj" },
    { "pos": "LW", "name": "Guilherme Smith" },
    { "pos": "CF", "name": "Promise David" },
    { "pos": "CF", "name": "Kevin Rodríguez" },
    { "pos": "CF", "name": "Raul Florucz" },
    ]
    },
    "slavia_prague": {
    "name": "SK Slavia Prague",
    "starting": [
    { "pos": "GK", "name": "Jakub Markovic" },
    { "pos": "GK", "name": "Jindrich Stanek" },
    { "pos": "GK", "name": "Ondrej Kolar" },
    { "pos": "CB", "name": "Stepan Chaloupek" },
    { "pos": "CB", "name": "David Zima" },
    { "pos": "CB", "name": "Tomas Vlcek" },
    { "pos": "CB", "name": "Tomas Holes" },
    { "pos": "LB", "name": "Youssoupha Mbodji" },
    { "pos": "LB", "name": "Dominik Javorcek" },
    { "pos": "RB", "name": "Samuel Isife" },
    { "pos": "CM", "name": "Michal Sadílek" },
    ],
    "subs": [
    { "pos": "CM", "name": "Oscar" },
    { "pos": "CM", "name": "Mubarak Suleiman" },
    { "pos": "CM", "name": "Alexandr Buzek" },
    { "pos": "CM", "name": "Petr Sevcik" },
    { "pos": "CM", "name": "David Doudera" },
    { "pos": "CAM", "name": "Muhammed Cham" },
    { "pos": "LW", "name": "Lukas Provod" },
    { "pos": "LW", "name": "Vasil Kusej" },
    { "pos": "LW", "name": "Youssoupha Sanyang" },
    { "pos": "RW", "name": "Ivan Schranz" },
    { "pos": "CF", "name": "Mojmír Chytil" },
    { "pos": "CF", "name": "Tomas Chory" },
    ]
    },
    "bodglimt": {
    "name": "FK Bodø/Glimt",
    "starting": [
    { "pos": "GK", "name": "Nikita Haikin" },
    { "pos": "GK", "name": "Julian Faye Lund" },
    { "pos": "GK", "name": "Isak Sjong" },
    { "pos": "CB", "name": "Odin Bjørtuft" },
    { "pos": "CB", "name": "Villads Nielsen" },
    { "pos": "CB", "name": "Jostein Gundersen" },
    { "pos": "CB", "name": "Haitam Aleesami" },
    { "pos": "LB", "name": "Fredrik Bjørkan" },
    { "pos": "LB", "name": "Isak Dybvik Määttä" },
    { "pos": "RB", "name": "Fredrik Sjøvold" },
    { "pos": "CM", "name": "Håkon Evjen" },
    ],
    "subs": [
    { "pos": "CM", "name": "Sondre Auklend" },
    { "pos": "CM", "name": "Magnus Riisnæs" },
    { "pos": "CM", "name": "Sondre Brunstad Fet" },
    { "pos": "CM", "name": "Anders Klynge" },
    { "pos": "LW", "name": "Jens Petter Hauge" },
    { "pos": "LW", "name": "Daniel Bassi" },
    { "pos": "RW", "name": "Ole Didrik Blomberg" },
    { "pos": "ST", "name": "August Mikkelsen" },
    { "pos": "CF", "name": "Kasper Høgh" },
    { "pos": "CF", "name": "Ola Brynhildsen" },
    { "pos": "CF", "name": "Andreas Helmersen" },
    { "pos": "CF", "name": "Mikkel Bro Hansen" },
    ]
    },
    "copenhagen": {
    "name": "FC Copenhagen",
    "starting": [
    { "pos": "GK", "name": "Dominik Kotarski" },
    { "pos": "GK", "name": "Rúnar Alex Rúnarsson" },
    { "pos": "GK", "name": "Oscar Buur" },
    { "pos": "CB", "name": "Gabriel Pereira" },
    { "pos": "CB", "name": "Junnosuke Suzuki" },
    { "pos": "CB", "name": "Pantelis Hatzidiakos" },
    { "pos": "CB", "name": "Zanka" },
    { "pos": "LB", "name": "Marcos López" },
    { "pos": "LB", "name": "Birger Meling" },
    { "pos": "RB", "name": "Aurélio Buta" },
    { "pos": "RB", "name": "Kenay Myrie" },
    ],
    "subs": [
    { "pos": "CDM", "name": "William Clem" },
    { "pos": "CM", "name": "Amir Richardson" },
    { "pos": "CM", "name": "Mads Emil Madsen" },
    { "pos": "CM", "name": "Thomas Delaney" },
    { "pos": "CM", "name": "Oliver Højer" },
    { "pos": "CM", "name": "Jonathan Moalem" },
    { "pos": "LW", "name": "Elias Achouri" },
    { "pos": "RW", "name": "Jordan Larsson" },
    { "pos": "ST", "name": "Mohamed Elyounoussi" },
    { "pos": "CF", "name": "Youssoufa Moukoko" },
    { "pos": "CF", "name": "Viktor Dadason" },
    { "pos": "CF", "name": "Geovanni Vianney Ndjee" },
    ]
    },
    "qaraba_fk": {
    "name": "Qarabağ FK",
    "starting": [
    { "pos": "GK", "name": "Mateusz Kochalski" },
    { "pos": "GK", "name": "Shahrudin Mahammadaliyev" },
    { "pos": "GK", "name": "Fabijan Buntic" },
    { "pos": "GK", "name": "Amin Ramazanov" },
    { "pos": "CB", "name": "Bahlul Mustafazada" },
    { "pos": "CB", "name": "Samy Mmaee" },
    { "pos": "CB", "name": "Kevin Medina" },
    { "pos": "CB", "name": "Badavi Hüseynov" },
    { "pos": "LB", "name": "Toral Bayramov" },
    { "pos": "LB", "name": "Elvin Cafarquliyev" },
    { "pos": "LB", "name": "Jérémie Gnali" },
    ],
    "subs": [
    { "pos": "RB", "name": "Matheus Silva" },
    { "pos": "RB", "name": "Dani Bolt" },
    { "pos": "RB", "name": "Abbas Hüseynov" },
    { "pos": "CDM", "name": "Pedro Bicalho" },
    { "pos": "CM", "name": "Marko Jankovic" },
    { "pos": "CAM", "name": "Kady Borges" },
    { "pos": "CAM", "name": "Joni Montiel" },
    { "pos": "CAM", "name": "Hikmat Cabrayilzada" },
    { "pos": "LW", "name": "Emmanuel Addai" },
    { "pos": "RW", "name": "Leandro Andrade" },
    { "pos": "RW", "name": "Oleksiy Kashchuk" },
    { "pos": "CF", "name": "Camilo Durán" },
    ]
    },
    "pafos_fc": {
    "name": "Pafos FC",
    "starting": [
    { "pos": "GK", "name": "Jay Gorter" },
    { "pos": "GK", "name": "Neofytos Michail" },
    { "pos": "GK", "name": "Athanasios Papadoudis" },
    { "pos": "CB", "name": "Derrick Luckassen" },
    { "pos": "CB", "name": "Axel Guessand" },
    { "pos": "CB", "name": "David Luiz" },
    { "pos": "LB", "name": "Ken Sema" },
    { "pos": "LB", "name": "Nikolas Ioannou" },
    { "pos": "LB", "name": "Kostas Pileas" },
    { "pos": "RB", "name": "Ognjen Mimović" },
    { "pos": "RB", "name": "Bruno" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Ivan Šunjić" },
    { "pos": "CDM", "name": "Alexandre Brito" },
    { "pos": "CM", "name": "Pêpê" },
    { "pos": "CM", "name": "Dani Silva" },
    { "pos": "CM", "name": "Domingos Quina" },
    { "pos": "CAM", "name": "Vlad Dragomir" },
    { "pos": "CAM", "name": "Wilmer Odefalk" },
    { "pos": "CAM", "name": "Andreas Mavroudis" },
    { "pos": "LW", "name": "Mislav Orsic" },
    { "pos": "RW", "name": "Jajá" },
    { "pos": "RW", "name": "João Correia" },
    { "pos": "RW", "name": "Pedro Caldieraro" },
    ]
    },
    "kairat_almaty": {
    "name": "Kairat Almaty",
    "starting": [
    { "pos": "GK", "name": "Temirlan Anarbekov" },
    { "pos": "GK", "name": "Sherkhan Kalmurza" },
    { "pos": "GK", "name": "Danila Buch" },
    { "pos": "CB", "name": "Aleksandr Shirobokov" },
    { "pos": "CB", "name": "Lucas Áfrico" },
    { "pos": "LB", "name": "Luís Mata" },
    { "pos": "LB", "name": "Lev Kurgin" },
    { "pos": "LB", "name": "Daniyar Tashpulatov" },
    { "pos": "RB", "name": "Aleksandr Mrynskiy" },
    { "pos": "RB", "name": "Erkin Tapalov" },
    { "pos": "CDM", "name": "Dan Glazer" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Damir Kasabulat" },
    { "pos": "CDM", "name": "Adilet Sadybekov" },
    { "pos": "CDM", "name": "Olzhas Baybek" },
    { "pos": "CM", "name": "Jaakko Oksanen" },
    { "pos": "CAM", "name": "Azamat Tuyakbaev" },
    { "pos": "CAM", "name": "Mukhamedali Abish" },
    { "pos": "LW", "name": "Oiva Jukkola" },
    { "pos": "RW", "name": "Sebastián Zeballos" },
    { "pos": "RW", "name": "Ismail Bekbolat" },
    { "pos": "CF", "name": "Dastan Satpaev" },
    { "pos": "CF", "name": "Jorginho" },
    { "pos": "CF", "name": "Ricardinho" },
    ]
    },
    "nottingham_forest": {
    "name": "Nottingham Forest",
    "starting": [
    { "pos": "GK", "name": "John Victor" },
    { "pos": "GK", "name": "Stefan Ortega" },
    { "pos": "GK", "name": "Matz Sels" },
    { "pos": "GK", "name": "Angus Gunn" },
    { "pos": "CB", "name": "Murillo" },
    { "pos": "CB", "name": "Nikola Milenković" },
    { "pos": "CB", "name": "Jair Cunha" },
    { "pos": "CB", "name": "Morato" },
    { "pos": "CB", "name": "Zach Abbott" },
    { "pos": "LB", "name": "Neco Williams" },
    { "pos": "LB", "name": "Luca Netz" },
    ],
    "subs": [
    { "pos": "RB", "name": "Ola Aina" },
    { "pos": "RB", "name": "Nicolò Savona" },
    { "pos": "RB", "name": "Eric da Silva Moreira" },
    { "pos": "CDM", "name": "Ibrahim Sangaré" },
    { "pos": "CM", "name": "Elliot Anderson" },
    { "pos": "CM", "name": "Nicolás Domínguez" },
    { "pos": "CAM", "name": "Morgan Gibbs-White" },
    { "pos": "CAM", "name": "Omari Hutchinson" },
    { "pos": "CAM", "name": "James McAtee" },
    { "pos": "RW", "name": "Dan Ndoye" },
    { "pos": "RW", "name": "Dilane Bakwa" },
    { "pos": "CF", "name": "Igor Jesus" },
    ]
    },
    "aston_villa": {
    "name": "Aston Villa",
    "starting": [
    { "pos": "GK", "name": "Emiliano Martínez" },
    { "pos": "GK", "name": "Marco Bizot" },
    { "pos": "CB", "name": "Ezri Konsa" },
    { "pos": "CB", "name": "Pau Torres" },
    { "pos": "CB", "name": "Victor Lindelöf" },
    { "pos": "CB", "name": "Tyrone Mings" },
    { "pos": "LB", "name": "Ian Maatsen" },
    { "pos": "LB", "name": "Lucas Digne" },
    { "pos": "RB", "name": "Matty Cash" },
    { "pos": "RB", "name": "Andrés García" },
    { "pos": "CDM", "name": "Amadou Onana" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Lamare Bogarde" },
    { "pos": "CM", "name": "Youri Tielemans" },
    { "pos": "CM", "name": "Douglas Luiz" },
    { "pos": "CM", "name": "Ross Barkley" },
    { "pos": "CAM", "name": "Morgan Rogers" },
    { "pos": "CAM", "name": "Harvey Elliott" },
    { "pos": "LW", "name": "Jadon Sancho" },
    { "pos": "LW", "name": "Emiliano Buendía" },
    { "pos": "LW", "name": "Lewis Dobbin" },
    { "pos": "RW", "name": "Leon Bailey" },
    { "pos": "RW", "name": "Alysson" },
    { "pos": "CF", "name": "Ollie Watkins" },
    ]
    },
    "roma": {
    "name": "AS Roma",
    "starting": [
    { "pos": "GK", "name": "Mile Svilar" },
    { "pos": "GK", "name": "Pierluigi Gollini" },
    { "pos": "GK", "name": "Radoslaw Zelezny" },
    { "pos": "CB", "name": "Evan Ndicka" },
    { "pos": "CB", "name": "Daniele Ghilardi" },
    { "pos": "CB", "name": "Gianluca Mancini" },
    { "pos": "CB", "name": "Jan Ziolkowski" },
    { "pos": "CB", "name": "Mario Hermoso" },
    { "pos": "LB", "name": "Angeliño" },
    { "pos": "LB", "name": "Konstantinos Tsimikas" },
    { "pos": "RB", "name": "Zeki Çelik" },
    ],
    "subs": [
    { "pos": "RB", "name": "Devyne Rensch" },
    { "pos": "CM", "name": "Manu Koné" },
    { "pos": "CM", "name": "Niccolò Pisilli" },
    { "pos": "CM", "name": "Neil El Aynaoui" },
    { "pos": "CAM", "name": "Lorenzo Pellegrini" },
    { "pos": "LW", "name": "Stephan El Shaarawy" },
    { "pos": "RW", "name": "Matías Soulé" },
    { "pos": "RW", "name": "Lorenzo Venturino" },
    { "pos": "ST", "name": "Paulo Dybala" },
    { "pos": "CF", "name": "Donyell Malen" },
    { "pos": "CF", "name": "Evan Ferguson" },
    { "pos": "CF", "name": "Robinio Vaz" },
    ]
    },
    "porto": {
    "name": "FC Porto",
    "starting": [
    { "pos": "GK", "name": "Cláudio Ramos" },
    { "pos": "GK", "name": "João Costa" },
    { "pos": "CB", "name": "Jakub Kiwior" },
    { "pos": "CB", "name": "Nehuén Pérez" },
    { "pos": "CB", "name": "Jan Bednarek" },
    { "pos": "CB", "name": "Dominik Prpić" },
    { "pos": "CB", "name": "Thiago Silva" },
    { "pos": "LB", "name": "Francisco Moura" },
    { "pos": "LB", "name": "Zaidu Sanusi" },
    { "pos": "RB", "name": "Alberto Costa" },
    { "pos": "RB", "name": "Martim Fernandes" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Alan Varela" },
    { "pos": "CDM", "name": "Pablo Rosario" },
    { "pos": "CM", "name": "Victor Froholdt" },
    { "pos": "CM", "name": "Seko Fofana" },
    { "pos": "CAM", "name": "Rodrigo Mora" },
    { "pos": "CAM", "name": "Gabri Veiga" },
    { "pos": "LW", "name": "Oskar Pietuszewski" },
    { "pos": "LW", "name": "Borja Sainz" },
    { "pos": "LW", "name": "Yann Karamoh" },
    { "pos": "RW", "name": "William Gomes" },
    { "pos": "RW", "name": "Pepê" },
    { "pos": "CF", "name": "Terem Moffi" },
    ]
    },
    "vfb_stuttgart": {
    "name": "VfB Stuttgart",
    "starting": [
    { "pos": "GK", "name": "Alexander Nübel" },
    { "pos": "GK", "name": "Florian Hellstern" },
    { "pos": "GK", "name": "Fabian Bredlow" },
    { "pos": "GK", "name": "Stefan Drljaca" },
    { "pos": "CB", "name": "Finn Jeltsch" },
    { "pos": "CB", "name": "Ramon Hendriks" },
    { "pos": "CB", "name": "Jeff Chabot" },
    { "pos": "CB", "name": "Luca Jaquez" },
    { "pos": "CB", "name": "Ameen Al-Dakhil" },
    { "pos": "CB", "name": "Dan-Axel Zagadou" },
    { "pos": "LB", "name": "Maximilian Mittelstädt" },
    ],
    "subs": [
    { "pos": "RB", "name": "Josha Vagnoman" },
    { "pos": "RB", "name": "Pascal Stenzel" },
    { "pos": "CDM", "name": "Angelo Stiller" },
    { "pos": "CDM", "name": "Chema Andrés" },
    { "pos": "CDM", "name": "Mirza Catovic" },
    { "pos": "CM", "name": "Nikolas Nartey" },
    { "pos": "CAM", "name": "Bilal El Khannouss" },
    { "pos": "LW", "name": "Chris Führich" },
    { "pos": "LW", "name": "Justin Diehl" },
    { "pos": "RW", "name": "Jamie Leweling" },
    { "pos": "RW", "name": "Tiago Tomás" },
    { "pos": "RW", "name": "Badredine Bouanani" },
    ]
    },
    "olympique_lyon": {
    "name": "Olympique Lyon",
    "starting": [
    { "pos": "GK", "name": "Dominik Greif" },
    { "pos": "GK", "name": "Rémy Descamps" },
    { "pos": "GK", "name": "Lassine Diarra" },
    { "pos": "CB", "name": "Moussa Niakhaté" },
    { "pos": "CB", "name": "Ruben Kluivert" },
    { "pos": "CB", "name": "Noham Kamara" },
    { "pos": "CB", "name": "Clinton Mata" },
    { "pos": "LB", "name": "Abner" },
    { "pos": "LB", "name": "Nicolás Tagliafico" },
    { "pos": "LB", "name": "Achraf Laâziri" },
    { "pos": "RB", "name": "Ainsley Maitland-Niles" },
    ],
    "subs": [
    { "pos": "RB", "name": "Hans Hateboer" },
    { "pos": "RB", "name": "Steeve Kango" },
    { "pos": "CDM", "name": "Orel Mangala" },
    { "pos": "CDM", "name": "Mathys de Carvalho" },
    { "pos": "CM", "name": "Khalis Merah" },
    { "pos": "CAM", "name": "Pavel Sulc" },
    { "pos": "CAM", "name": "Noah Nartey" },
    { "pos": "CAM", "name": "Adam Karabec" },
    { "pos": "LW", "name": "Malick Fofana" },
    { "pos": "LW", "name": "Afonso Moreira" },
    { "pos": "LW", "name": "Rémi Himbert" },
    { "pos": "RW", "name": "Ernest Nuamah" },
    ]
    },
    "losc_lille": {
    "name": "LOSC Lille",
    "starting": [
    { "pos": "GK", "name": "Berke Özer" },
    { "pos": "GK", "name": "Arnaud Bodart" },
    { "pos": "CB", "name": "Nathan Ngoy" },
    { "pos": "CB", "name": "Alexsandro" },
    { "pos": "CB", "name": "Chancel Mbemba" },
    { "pos": "CB", "name": "Aïssa Mandi" },
    { "pos": "CB", "name": "Rafael Fernandes" },
    { "pos": "LB", "name": "Romain Perraud" },
    { "pos": "LB", "name": "Calvin Verdonk" },
    { "pos": "RB", "name": "Tiago Santos" },
    { "pos": "RB", "name": "Thomas Meunier" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Ngal'ayel Mukau" },
    { "pos": "CDM", "name": "Nabil Bentaleb" },
    { "pos": "CM", "name": "Ayyoub Bouaddi" },
    { "pos": "CAM", "name": "Hákon Arnar Haraldsson" },
    { "pos": "LW", "name": "Félix Correia" },
    { "pos": "LW", "name": "Osame Sahraoui" },
    { "pos": "LW", "name": "Soriba Diaoune" },
    { "pos": "RW", "name": "Ethan Mbappé" },
    { "pos": "RW", "name": "Marius Broholm" },
    { "pos": "RW", "name": "Noah Edjouma" },
    { "pos": "RW", "name": "Gaëtan Perrin" },
    { "pos": "CF", "name": "Olivier Giroud" },
    ]
    },
    "bologna_fc_1909": {
    "name": "Bologna FC 1909",
    "starting": [
    { "pos": "GK", "name": "Massimo Pessina" },
    { "pos": "GK", "name": "Lukasz Skorupski" },
    { "pos": "GK", "name": "Federico Ravaglia" },
    { "pos": "CB", "name": "Jhon Lucumí" },
    { "pos": "CB", "name": "Torbjørn Heggem" },
    { "pos": "CB", "name": "Martin Vitík" },
    { "pos": "CB", "name": "Eivind Helland" },
    { "pos": "CB", "name": "Nicolò Casale" },
    { "pos": "CB", "name": "Kevin Bonifazi" },
    { "pos": "LB", "name": "Juan Miranda" },
    { "pos": "LB", "name": "Charalampos Lykogiannis" },
    ],
    "subs": [
    { "pos": "RB", "name": "João Mário" },
    { "pos": "RB", "name": "Nadir Zortea" },
    { "pos": "CDM", "name": "Nikola Moro" },
    { "pos": "CM", "name": "Lewis Ferguson" },
    { "pos": "CM", "name": "Tommaso Pobega" },
    { "pos": "CM", "name": "Simon Sohm" },
    { "pos": "CM", "name": "Remo Freuler" },
    { "pos": "CAM", "name": "Jens Odgaard" },
    { "pos": "LW", "name": "Jonathan Rowe" },
    { "pos": "LW", "name": "Nicolò Cambiaghi" },
    { "pos": "LW", "name": "Benja Domínguez" },
    { "pos": "RW", "name": "Federico Bernardeschi" },
    ]
    },
    "real_betis_balompi": {
    "name": "Real Betis Balompié",
    "starting": [
    { "pos": "GK", "name": "Álvaro Valles" },
    { "pos": "GK", "name": "Pau López" },
    { "pos": "GK", "name": "Adrián San Miguel" },
    { "pos": "CB", "name": "Natan" },
    { "pos": "CB", "name": "Valentín Gómez" },
    { "pos": "CB", "name": "Diego Llorente" },
    { "pos": "CB", "name": "Marc Bartra" },
    { "pos": "LB", "name": "Junior Firpo" },
    { "pos": "LB", "name": "Ricardo Rodríguez" },
    { "pos": "RB", "name": "Héctor Bellerín" },
    { "pos": "CDM", "name": "Sofyan Amrabat" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Marc Roca" },
    { "pos": "CM", "name": "Sergi Altimira" },
    { "pos": "CM", "name": "Nelson Deossa" },
    { "pos": "CM", "name": "Pablo Fornals" },
    { "pos": "CM", "name": "Álvaro Fidalgo" },
    { "pos": "CAM", "name": "Giovani Lo Celso" },
    { "pos": "LW", "name": "Abde Ezzalzouli" },
    { "pos": "LW", "name": "Rodrigo Riquelme" },
    { "pos": "RW", "name": "Antony" },
    { "pos": "RW", "name": "Pablo García" },
    { "pos": "CF", "name": "Cucho Hernández" },
    { "pos": "CF", "name": "Chimy Ávila" },
    ]
    },
    "freiburg": {
    "name": "SC Freiburg",
    "starting": [
    { "pos": "GK", "name": "Noah Atubolu" },
    { "pos": "GK", "name": "Florian Müller" },
    { "pos": "GK", "name": "Jannik Huth" },
    { "pos": "CB", "name": "Bruno Ogbus" },
    { "pos": "CB", "name": "Philipp Lienhart" },
    { "pos": "CB", "name": "Max Rosenfelder" },
    { "pos": "CB", "name": "Matthias Ginter" },
    { "pos": "CB", "name": "Anthony Jung" },
    { "pos": "LB", "name": "Jordy Makengo" },
    { "pos": "RB", "name": "Philipp Treu" },
    { "pos": "RB", "name": "Lukas Kübler" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Patrick Osterhage" },
    { "pos": "CDM", "name": "Nicolas Höfler" },
    { "pos": "CM", "name": "Johan Manzambi" },
    { "pos": "CM", "name": "Maximilian Eggestein" },
    { "pos": "CAM", "name": "Daniel-Kofi Kyereh" },
    { "pos": "LW", "name": "Derry Scherhant" },
    { "pos": "LW", "name": "Vincenzo Grifo" },
    { "pos": "RW", "name": "Niklas Beste" },
    { "pos": "RW", "name": "Cyriaque Irié" },
    { "pos": "ST", "name": "Yuito Suzuki" },
    { "pos": "ST", "name": "Maximilian Philipp" },
    { "pos": "CF", "name": "Igor Matanovic" },
    ]
    },
    "feyenoord_rotterdam": {
    "name": "Feyenoord Rotterdam",
    "starting": [
    { "pos": "GK", "name": "Steven Benda" },
    { "pos": "GK", "name": "Liam Bossin" },
    { "pos": "GK", "name": "Mannou Berger" },
    { "pos": "CB", "name": "Tsuyoshi Watanabe" },
    { "pos": "CB", "name": "Gernot Trauner" },
    { "pos": "LB", "name": "Jordan Bos" },
    { "pos": "LB", "name": "Gijs Smal" },
    { "pos": "RB", "name": "Givairo Read" },
    { "pos": "RB", "name": "Jordan Lotomba" },
    { "pos": "RB", "name": "Mats Deijl" },
    { "pos": "CDM", "name": "Oussama Targhalline" },
    ],
    "subs": [
    { "pos": "CDM", "name": "In-beom Hwang" },
    { "pos": "CDM", "name": "Thijs Kraaijeveld" },
    { "pos": "CM", "name": "Luciano Valente" },
    { "pos": "CAM", "name": "Sem Steijn" },
    { "pos": "CAM", "name": "Tobias van den Elshout" },
    { "pos": "CAM", "name": "Shiloh 't Zand" },
    { "pos": "CAM", "name": "Ilai Grootfaam" },
    { "pos": "LW", "name": "Leo Sauer" },
    { "pos": "LW", "name": "Aymen Sliti" },
    { "pos": "LW", "name": "Gaoussou Diarra" },
    { "pos": "RW", "name": "Anis Hadj Moussa" },
    { "pos": "RW", "name": "Gonçalo Borges" },
    ]
    },
    "celta_de_vigo": {
    "name": "Celta de Vigo",
    "starting": [
    { "pos": "GK", "name": "Iván Villar" },
    { "pos": "GK", "name": "Marc Vidal" },
    { "pos": "CB", "name": "Javi Rodríguez" },
    { "pos": "CB", "name": "Carl Starfelt" },
    { "pos": "CB", "name": "Yoel Lago" },
    { "pos": "CB", "name": "Carlos Domínguez" },
    { "pos": "CB", "name": "Manu Fernández" },
    { "pos": "CB", "name": "Marcos Alonso" },
    { "pos": "CB", "name": "Joseph Aidoo" },
    { "pos": "LB", "name": "Mihailo Ristic" },
    { "pos": "RB", "name": "Óscar Mingueza" },
    ],
    "subs": [
    { "pos": "RB", "name": "Sergio Carreira" },
    { "pos": "RB", "name": "Javi Rueda" },
    { "pos": "RB", "name": "Álvaro Núñez" },
    { "pos": "CM", "name": "Ilaix Moriba" },
    { "pos": "CM", "name": "Hugo Sotelo" },
    { "pos": "CM", "name": "Matías Vecino" },
    { "pos": "CAM", "name": "Fer López" },
    { "pos": "LW", "name": "Williot Swedberg" },
    { "pos": "LW", "name": "Hugo Álvarez" },
    { "pos": "LW", "name": "Franco Cervi" },
    { "pos": "RW", "name": "Ferran Jutglà" },
    { "pos": "RW", "name": "Jones El-Abdellaoui" },
    ]
    },
    "braga": {
    "name": "SC Braga",
    "starting": [
    { "pos": "GK", "name": "Lukas Hornicek" },
    { "pos": "GK", "name": "Alaa Bellaarouch" },
    { "pos": "GK", "name": "Tiago Sá" },
    { "pos": "CB", "name": "Gustaf Lagerbielke" },
    { "pos": "CB", "name": "Jonatás Noro" },
    { "pos": "CB", "name": "Paulo Oliveira" },
    { "pos": "LB", "name": "Leonardo Lelo" },
    { "pos": "RB", "name": "Víctor Gómez" },
    { "pos": "CDM", "name": "Demir Ege Tıknaz" },
    { "pos": "CDM", "name": "Gabriel Moscardo" },
    { "pos": "CDM", "name": "Vítor Carvalho" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Florian Grillitsch" },
    { "pos": "CDM", "name": "Yanis da Rocha" },
    { "pos": "CM", "name": "Gorby" },
    { "pos": "CM", "name": "Diego Rodrigues" },
    { "pos": "CM", "name": "João Moutinho" },
    { "pos": "CM", "name": "Mario Dorgeles" },
    { "pos": "CAM", "name": "Rodrigo Zalazar" },
    { "pos": "CAM", "name": "Luisinho" },
    { "pos": "LW", "name": "Gabri Martínez" },
    { "pos": "RW", "name": "Sandro Vidigal" },
    { "pos": "RW", "name": "João Aragão" },
    { "pos": "CF", "name": "Pau Víctor" },
    ]
    },
    "ogc_nice": {
    "name": "OGC Nice",
    "starting": [
    { "pos": "GK", "name": "Yehvann Diouf" },
    { "pos": "GK", "name": "Maxime Dupé" },
    { "pos": "GK", "name": "Bartosz Zelazowski" },
    { "pos": "CB", "name": "Juma Bah" },
    { "pos": "CB", "name": "Antoine Mendy" },
    { "pos": "CB", "name": "Kojo Peprah Oppong" },
    { "pos": "CB", "name": "Youssouf Ndayishimiye" },
    { "pos": "CB", "name": "Moïse Bombito" },
    { "pos": "CB", "name": "Mohamed Abdelmonem" },
    { "pos": "LB", "name": "Melvin Bard" },
    { "pos": "LB", "name": "Ali Abdi" },
    ],
    "subs": [
    { "pos": "RB", "name": "Jonathan Clauss" },
    { "pos": "CDM", "name": "Charles Vanhoutte" },
    { "pos": "CDM", "name": "Salis Abdul Samed" },
    { "pos": "CDM", "name": "Everton" },
    { "pos": "CM", "name": "Hicham Boudaoui" },
    { "pos": "CM", "name": "Morgan Sanson" },
    { "pos": "CM", "name": "Tanguy Ndombélé" },
    { "pos": "CM", "name": "Djibril Coulibaly" },
    { "pos": "CM", "name": "Tom Louchet" },
    { "pos": "CAM", "name": "Gabin Bernardeau" },
    { "pos": "LW", "name": "Sofiane Diop" },
    { "pos": "LW", "name": "Isak Jansson" },
    ]
    },
    "red_bull_salzburg": {
    "name": "Red Bull Salzburg",
    "starting": [
    { "pos": "GK", "name": "Alexander Schlager" },
    { "pos": "GK", "name": "Christian Zawieschitzky" },
    { "pos": "GK", "name": "Salko Hamzic" },
    { "pos": "CB", "name": "Tim Drexler" },
    { "pos": "CB", "name": "John Mellberg" },
    { "pos": "CB", "name": "Anrie Chase" },
    { "pos": "LB", "name": "Frans Krätzig" },
    { "pos": "LB", "name": "Aleksa Terzic" },
    { "pos": "RB", "name": "Tim Trummer" },
    { "pos": "RB", "name": "Stefan Lainer" },
    { "pos": "CDM", "name": "Soumaïla Diabaté" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Mamady Diambou" },
    { "pos": "CM", "name": "Sota Kitano" },
    { "pos": "LW", "name": "Kerim Alajbegovic" },
    { "pos": "RW", "name": "Moussa Yeo" },
    { "pos": "RW", "name": "Damir Redzic" },
    { "pos": "CF", "name": "Karim Konaté" },
    { "pos": "CF", "name": "Edmund Baidoo" },
    { "pos": "CF", "name": "Yorbe Vertessen" },
    { "pos": "CF", "name": "Enrique Aguilar" },
    { "pos": "CF", "name": "Karim Onisiwo" },
    ]
    },
    "celtic_fc": {
    "name": "Celtic FC",
    "starting": [
    { "pos": "GK", "name": "Viljami Sinisalo" },
    { "pos": "GK", "name": "Ross Doohan" },
    { "pos": "GK", "name": "Josh Clarke" },
    { "pos": "CB", "name": "Auston Trusty" },
    { "pos": "CB", "name": "Liam Scales" },
    { "pos": "CB", "name": "Stephen Welsh" },
    { "pos": "CB", "name": "Dane Murray" },
    { "pos": "CB", "name": "Benjamin Arthur" },
    { "pos": "LB", "name": "Kieran Tierney" },
    { "pos": "LB", "name": "Marcelo Saracchi" },
    { "pos": "LB", "name": "Adam Montgomery" },
    ],
    "subs": [
    { "pos": "RB", "name": "Alistair Johnston" },
    { "pos": "RB", "name": "Julián Araujo" },
    { "pos": "RB", "name": "Colby Donovan" },
    { "pos": "RB", "name": "Anthony Ralston" },
    { "pos": "CM", "name": "Arne Engels" },
    { "pos": "CM", "name": "Reo Hatate" },
    { "pos": "CM", "name": "Paulo Bernardo" },
    { "pos": "CM", "name": "Luke McCowan" },
    { "pos": "CM", "name": "Joel Mvuka" },
    { "pos": "CAM", "name": "Benjamin Nygren" },
    { "pos": "LW", "name": "Daizen Maeda" },
    { "pos": "LW", "name": "Jota" },
    ]
    },
    "krc_genk": {
    "name": "KRC Genk",
    "starting": [
    { "pos": "GK", "name": "Lucca Brughmans" },
    { "pos": "GK", "name": "Tobias Lawal" },
    { "pos": "GK", "name": "Hendrik Van Crombrugge" },
    { "pos": "GK", "name": "Emile Doucouré" },
    { "pos": "GK", "name": "Brent Stevens" },
    { "pos": "CB", "name": "Matte Smets" },
    { "pos": "CB", "name": "Mujaid Sadick" },
    { "pos": "CB", "name": "Josué Kongolo" },
    { "pos": "CB", "name": "Adrián Palacios" },
    { "pos": "LB", "name": "Yaimar Medina" },
    { "pos": "LB", "name": "Joris Kayembe" },
    ],
    "subs": [
    { "pos": "RB", "name": "Zakaria El Ouahdi" },
    { "pos": "RB", "name": "Ken Nkuba" },
    { "pos": "CDM", "name": "Ibrahima Sory Bangoura" },
    { "pos": "CDM", "name": "Nikolas Sattlberger" },
    { "pos": "CM", "name": "August De Wannemacker" },
    { "pos": "CAM", "name": "Konstantinos Karetsas" },
    { "pos": "CAM", "name": "Daan Heymans" },
    { "pos": "LW", "name": "Noah Adedeji-Sternberg" },
    { "pos": "LW", "name": "Yira Sor" },
    { "pos": "LW", "name": "Ayumu Yokoyama" },
    { "pos": "RW", "name": "Jarne Steuckers" },
    { "pos": "RW", "name": "Junya Ito" },
    ]
    },
    "rangers_fc": {
    "name": "Rangers FC",
    "starting": [
    { "pos": "GK", "name": "Jack Butland" },
    { "pos": "GK", "name": "Liam Kelly" },
    { "pos": "GK", "name": "Kieran Wright" },
    { "pos": "CB", "name": "Emmanuel Fernandez" },
    { "pos": "CB", "name": "John Souttar" },
    { "pos": "CB", "name": "Leon King" },
    { "pos": "LB", "name": "Tuur Rommens" },
    { "pos": "RB", "name": "Max Aarons" },
    { "pos": "RB", "name": "Dujon Sterling" },
    { "pos": "CDM", "name": "Nicolas Raskin" },
    { "pos": "CDM", "name": "Tochi Chukwuani" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Connor Barron" },
    { "pos": "CDM", "name": "Bailey Rice" },
    { "pos": "CM", "name": "Mohamed Diomandé" },
    { "pos": "CM", "name": "Lyall Cameron" },
    { "pos": "CAM", "name": "Thelo Aasgaard" },
    { "pos": "CAM", "name": "Nedim Bajrami" },
    { "pos": "LW", "name": "Mikey Moore" },
    { "pos": "LW", "name": "Djeidi Gassama" },
    { "pos": "LW", "name": "Findlay Curtis" },
    { "pos": "RW", "name": "Andreas Skov Olsen" },
    { "pos": "RW", "name": "Oliver Antman" },
    { "pos": "CF", "name": "Youssef Chermiti" },
    ]
    },
    "red_star_belgrade": {
    "name": "Red Star Belgrade",
    "starting": [
    { "pos": "GK", "name": "Matheus" },
    { "pos": "GK", "name": "Omri Glazer" },
    { "pos": "GK", "name": "Ivan Gutesa" },
    { "pos": "GK", "name": "Savo Radanovic" },
    { "pos": "GK", "name": "Vuk Draskic" },
    { "pos": "CB", "name": "Strahinja Erakovic" },
    { "pos": "CB", "name": "Franklin Tebo Uchenna" },
    { "pos": "CB", "name": "Rodrigão" },
    { "pos": "CB", "name": "Milos Veljkovic" },
    { "pos": "CB", "name": "Stefan Gudelj" },
    { "pos": "LB", "name": "Adem Avdic" },
    ],
    "subs": [
    { "pos": "LB", "name": "Nair Tiknizyan" },
    { "pos": "RB", "name": "Young-woo Seol" },
    { "pos": "RB", "name": "Nikola Stankovic" },
    { "pos": "CDM", "name": "Tomás Händel" },
    { "pos": "CDM", "name": "Rade Krunic" },
    { "pos": "CDM", "name": "Mahmudu Bajo" },
    { "pos": "CM", "name": "Timi Max Elsnik" },
    { "pos": "CAM", "name": "Vasilije Kostov" },
    { "pos": "CAM", "name": "Aleksandar Katai" },
    { "pos": "LW", "name": "Vladimir Lucic" },
    { "pos": "RW", "name": "Douglas Owusu" },
    { "pos": "RW", "name": "Luka Zaric" },
    ]
    },
    "midtjylland": {
    "name": "FC Midtjylland",
    "starting": [
    { "pos": "GK", "name": "Elías Ólafsson" },
    { "pos": "GK", "name": "Ovie Ejeheri" },
    { "pos": "GK", "name": "Jonas Lössl" },
    { "pos": "GK", "name": "Mark Ugboh" },
    { "pos": "GK", "name": "Liam Selin" },
    { "pos": "CB", "name": "Ousmane Diao" },
    { "pos": "CB", "name": "Martin Erlić" },
    { "pos": "CB", "name": "Han-beom Lee" },
    { "pos": "CB", "name": "Bilal Konteh" },
    { "pos": "LB", "name": "Victor Bak" },
    { "pos": "LB", "name": "Paulinho" },
    ],
    "subs": [
    { "pos": "RB", "name": "Kevin Mbabu" },
    { "pos": "RB", "name": "Adam Gabriel" },
    { "pos": "CM", "name": "Denil Castillo" },
    { "pos": "CM", "name": "Pedro Bravo" },
    { "pos": "CM", "name": "Valdemar Byskov" },
    { "pos": "LW", "name": "Aral Şimşir" },
    { "pos": "LW", "name": "Mikel Gogorza" },
    { "pos": "LW", "name": "Junior Zé" },
    { "pos": "RW", "name": "Darío Osorio" },
    { "pos": "RW", "name": "Edward Chilufya" },
    { "pos": "CF", "name": "Franculino" },
    { "pos": "CF", "name": "Gue-sung Cho" },
    ]
    },
    "paok_thessaloniki": {
    "name": "PAOK Thessaloniki",
    "starting": [
    { "pos": "GK", "name": "Antonis Tsiftsis" },
    { "pos": "GK", "name": "Jiri Pavlenka" },
    { "pos": "GK", "name": "Dimitrios Monastirlis" },
    { "pos": "CB", "name": "Giannis Michailidis" },
    { "pos": "CB", "name": "Alessandro Vogliacco" },
    { "pos": "CB", "name": "Tomasz Kedziora" },
    { "pos": "CB", "name": "Dejan Lovren" },
    { "pos": "CB", "name": "Dimitrios Bataoulas" },
    { "pos": "LB", "name": "Greg Taylor" },
    { "pos": "LB", "name": "Abdul Rahman Baba" },
    { "pos": "RB", "name": "Jonjoe Kenny" },
    ],
    "subs": [
    { "pos": "RB", "name": "Jorge Sánchez" },
    { "pos": "CDM", "name": "Soualiho Meïté" },
    { "pos": "CDM", "name": "Magomed Ozdoev" },
    { "pos": "CDM", "name": "Konstantinos Thymianis" },
    { "pos": "CM", "name": "Christos Zafeiris" },
    { "pos": "CM", "name": "Alessandro Bianco" },
    { "pos": "CM", "name": "Dimitrios Tsopouroglou" },
    { "pos": "CAM", "name": "Giannis Konstantelias" },
    { "pos": "CAM", "name": "Luka Ivanušec" },
    { "pos": "CAM", "name": "Dimitrios Pelkas" },
    { "pos": "LW", "name": "Dimitrios Berdos" },
    { "pos": "LW", "name": "Taison" },
    ]
    },
    "utrecht": {
    "name": "FC Utrecht",
    "starting": [
    { "pos": "GK", "name": "Vasilios Barkas" },
    { "pos": "GK", "name": "Michael Brouwer" },
    { "pos": "GK", "name": "Kevin Gadellaa" },
    { "pos": "CB", "name": "Matisse Didden" },
    { "pos": "CB", "name": "Mike Eerdhuijzen" },
    { "pos": "CB", "name": "Mike van der Hoorn" },
    { "pos": "LB", "name": "Souffian El Karouani" },
    { "pos": "LB", "name": "Emeka Adiele" },
    { "pos": "RB", "name": "Siebe Horemans" },
    { "pos": "RB", "name": "Niklas Vesterlund" },
    { "pos": "CDM", "name": "Oualid Agougil" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Jaygo van Ommeren" },
    { "pos": "CM", "name": "Gjivai Zechiël" },
    { "pos": "CM", "name": "Can Bozdogan" },
    { "pos": "CAM", "name": "Dani de Wit" },
    { "pos": "CAM", "name": "Rafik El Arguioui" },
    { "pos": "LW", "name": "Yoann Cathline" },
    { "pos": "LW", "name": "Ángel Alarcón" },
    { "pos": "LW", "name": "Jesper Karlsson" },
    { "pos": "LW", "name": "Adrian Blake" },
    { "pos": "LW", "name": "Emirhan Demircan" },
    { "pos": "CF", "name": "Artem Stepanov" },
    { "pos": "CF", "name": "David Min" },
    ]
    },
    "panathinaikos": {
    "name": "Panathinaikos",
    "starting": [
    { "pos": "GK", "name": "Alban Lafont" },
    { "pos": "GK", "name": "Konstantinos Kotsaris" },
    { "pos": "CB", "name": "Ahmed Touba" },
    { "pos": "CB", "name": "Erik Palmer-Brown" },
    { "pos": "LB", "name": "Javi Hernández" },
    { "pos": "LB", "name": "Georgios Kyriakopoulos" },
    { "pos": "RB", "name": "Davide Calabria" },
    { "pos": "RB", "name": "Giannis Kotsiras" },
    { "pos": "CDM", "name": "Pedro Chirivella" },
    { "pos": "CDM", "name": "Manolis Siopis" },
    { "pos": "CM", "name": "Adam Gnezda Cerin" },
    ],
    "subs": [
    { "pos": "CM", "name": "Renato Sanches" },
    { "pos": "CM", "name": "Santino Andino" },
    { "pos": "CAM", "name": "Vicente Taborda" },
    { "pos": "CAM", "name": "Filip Djuricic" },
    { "pos": "LW", "name": "Anass Zaroury" },
    { "pos": "RW", "name": "Facundo Pellistri" },
    { "pos": "CF", "name": "Karol Świderski" },
    { "pos": "CF", "name": "Andreas Tetteh" },
    { "pos": "CF", "name": "Milos Pantovic" },
    ]
    },
    "gnk_dinamo_zagreb": {
    "name": "GNK Dinamo Zagreb",
    "starting": [
    { "pos": "GK", "name": "Dominik Livakovic" },
    { "pos": "GK", "name": "Ivan Nevistic" },
    { "pos": "GK", "name": "Ivan Filipovic" },
    { "pos": "GK", "name": "Antonio Rajic" },
    { "pos": "GK", "name": "Danijel Zagorac" },
    { "pos": "CB", "name": "Sergi Domínguez" },
    { "pos": "CB", "name": "Scott McKenna" },
    { "pos": "CB", "name": "Niko Galesic" },
    { "pos": "CB", "name": "Raúl Torrente" },
    { "pos": "CB", "name": "Marko Zebic" },
    { "pos": "CB", "name": "Kévin Théophile-Catherine" },
    ],
    "subs": [
    { "pos": "CB", "name": "Dino Peric" },
    { "pos": "CB", "name": "Matija Ruskovacki" },
    { "pos": "LB", "name": "Matteo Pérez Vinlöf" },
    { "pos": "LB", "name": "Bruno Goda" },
    { "pos": "RB", "name": "Moris Valincic" },
    { "pos": "RB", "name": "Ronaël Pierre-Gabriel" },
    { "pos": "RB", "name": "Noa Mikic" },
    { "pos": "RB", "name": "Paul Tabinas" },
    { "pos": "CDM", "name": "Ismaël Bennacer" },
    { "pos": "CDM", "name": "Marko Soldo" },
    { "pos": "CDM", "name": "Josip Misic" },
    { "pos": "CM", "name": "Miha Zajc" },
    ]
    },
    "bsc_young_boys": {
    "name": "BSC Young Boys",
    "starting": [
    { "pos": "GK", "name": "Marvin Keller" },
    { "pos": "GK", "name": "Heinz Lindner" },
    { "pos": "GK", "name": "Dario Marzino" },
    { "pos": "GK", "name": "Ardian Bajrami" },
    { "pos": "GK", "name": "Ruben Salchli" },
    { "pos": "CB", "name": "Tanguy Zoukrou" },
    { "pos": "LB", "name": "Jaouen Hadjam" },
    { "pos": "LB", "name": "Stefan Bukinac" },
    { "pos": "LB", "name": "Olivier Mambwa" },
    { "pos": "RB", "name": "Yan Valery" },
    { "pos": "RB", "name": "Saidy Janko" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Edimilson Fernandes" },
    { "pos": "CDM", "name": "Sandro Lauper" },
    { "pos": "CM", "name": "Armin Gigovic" },
    { "pos": "CM", "name": "Rayan Raveloson" },
    { "pos": "CM", "name": "Darian Males" },
    { "pos": "CM", "name": "Alan Virginius" },
    { "pos": "CAM", "name": "Alvyn Sanches" },
    { "pos": "CAM", "name": "Dominik Pech" },
    { "pos": "LW", "name": "Ebrima Colley" },
    { "pos": "RW", "name": "Christian Fassnacht" },
    { "pos": "RW", "name": "Edin Etoski" },
    { "pos": "CF", "name": "Chris Bedia" },
    ]
    },
    "basel_1893": {
    "name": "FC Basel 1893",
    "starting": [
    { "pos": "GK", "name": "Marwin Hitz" },
    { "pos": "GK", "name": "Mirko Salvi" },
    { "pos": "GK", "name": "Tim Pfeiffer" },
    { "pos": "CB", "name": "Flavius Daniliuc" },
    { "pos": "CB", "name": "Becir Omeragic" },
    { "pos": "CB", "name": "Nicolas Vouilloz" },
    { "pos": "CB", "name": "Marvin Akahomen" },
    { "pos": "LB", "name": "Dominik Schmid" },
    { "pos": "LB", "name": "Moussa Cissé" },
    { "pos": "RB", "name": "Keigo Tsunemoto" },
    { "pos": "RB", "name": "Kevin Rüegg" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Andrej Bacanin" },
    { "pos": "CM", "name": "Metinho" },
    { "pos": "CM", "name": "Koba Koindredi" },
    { "pos": "CM", "name": "Léo Leroy" },
    { "pos": "CM", "name": "Dion Kacuri" },
    { "pos": "CAM", "name": "Adriano Onyegbule" },
    { "pos": "LW", "name": "Bénie Traoré" },
    { "pos": "LW", "name": "Julien Duranville" },
    { "pos": "LW", "name": "Ibrahim Salah" },
    { "pos": "RW", "name": "Marin Soticek" },
    { "pos": "CF", "name": "Giacomo Koloto" },
    { "pos": "CF", "name": "Albian Ajeti" },
    ]
    },
    "viktoria_plzen": {
    "name": "FC Viktoria Plzen",
    "starting": [
    { "pos": "GK", "name": "Florian Wiegele" },
    { "pos": "GK", "name": "Dominik Tapaj" },
    { "pos": "GK", "name": "Marian Tvrdon" },
    { "pos": "GK", "name": "Matyas Silhavy" },
    { "pos": "CB", "name": "Sampson Dweh" },
    { "pos": "CB", "name": "Karel Spacil" },
    { "pos": "CB", "name": "David Krcik" },
    { "pos": "CB", "name": "Vaclav Jemelka" },
    { "pos": "LB", "name": "Merchas Doski" },
    { "pos": "RB", "name": "Adam Kadlec" },
    { "pos": "CM", "name": "Lukas Cerv" },
    ],
    "subs": [
    { "pos": "CM", "name": "Alexandr Sojka" },
    { "pos": "CM", "name": "Jiri Panos" },
    { "pos": "CM", "name": "Matej Valenta" },
    { "pos": "CM", "name": "Patrik Hrosovsky" },
    { "pos": "CM", "name": "Amar Memić" },
    { "pos": "CM", "name": "Cheick Souaré" },
    { "pos": "CAM", "name": "Denis Visinsky" },
    { "pos": "CAM", "name": "Tom Sloncik" },
    { "pos": "CAM", "name": "Tomas Ladra" },
    { "pos": "CF", "name": "Prince Adu" },
    { "pos": "CF", "name": "Mohamed Touré" },
    { "pos": "CF", "name": "Salim Fago Lawal" },
    ]
    },
    "sturm_graz": {
    "name": "SK Sturm Graz",
    "starting": [
    { "pos": "GK", "name": "Daniil Khudyakov" },
    { "pos": "GK", "name": "Matteo Bignetti" },
    { "pos": "GK", "name": "Elias Lorenz" },
    { "pos": "CB", "name": "Jeyland Mitchell" },
    { "pos": "CB", "name": "Dimitri Lavalée" },
    { "pos": "CB", "name": "Paul Koller" },
    { "pos": "CB", "name": "Albert Vallci" },
    { "pos": "CB", "name": "Emanuel Aiwu" },
    { "pos": "CB", "name": "Niklas Geyrhofer" },
    { "pos": "LB", "name": "Emir Karic" },
    { "pos": "RB", "name": "Jusuf Gazibegovic" },
    ],
    "subs": [
    { "pos": "RB", "name": "Arjan Malic" },
    { "pos": "CDM", "name": "Jon Gorenc Stankovic" },
    { "pos": "CDM", "name": "Ryan Fosso" },
    { "pos": "CM", "name": "Luca Weinhandl" },
    { "pos": "CM", "name": "Jacob Peter Hödl" },
    { "pos": "CAM", "name": "Otar Kiteishvili" },
    { "pos": "CAM", "name": "Filip Rózga" },
    { "pos": "CAM", "name": "Gizo Mamageishvili" },
    { "pos": "CF", "name": "Axel Kayombo" },
    { "pos": "CF", "name": "Seedy Jatta" },
    { "pos": "CF", "name": "Belmin Beganovic" },
    { "pos": "CF", "name": "Maurice Malone" },
    ]
    },
    "ferencvrosi_tc": {
    "name": "Ferencvárosi TC",
    "starting": [
    { "pos": "GK", "name": "Ádám Varga" },
    { "pos": "GK", "name": "Dániel Radnóti" },
    { "pos": "GK", "name": "Dávid Gróf" },
    { "pos": "GK", "name": "Gergő Szécsi" },
    { "pos": "CB", "name": "Ibrahim Cissé" },
    { "pos": "CB", "name": "Toon Raemaekers" },
    { "pos": "CB", "name": "Mariano Gómez" },
    { "pos": "CB", "name": "Gábor Szalai" },
    { "pos": "CB", "name": "Ismaïl Aaneba" },
    { "pos": "CB", "name": "Csongor Lakatos" },
    { "pos": "LB", "name": "Barnabás Nagy" },
    ],
    "subs": [
    { "pos": "RB", "name": "Cebrail Makreckis" },
    { "pos": "RB", "name": "Attila Osváth" },
    { "pos": "RB", "name": "Endre Botka" },
    { "pos": "CDM", "name": "Habib Maïga" },
    { "pos": "CDM", "name": "Bence Ötvös" },
    { "pos": "CDM", "name": "Júlio Romão" },
    { "pos": "CM", "name": "Mohammed Abu Fani" },
    { "pos": "CM", "name": "Naby Keïta" },
    { "pos": "CM", "name": "Philippe Rommens" },
    { "pos": "CM", "name": "Ádám Madarász" },
    { "pos": "CM", "name": "Isaac Pappoe" },
    { "pos": "CM", "name": "Cadu" },
    ]
    },
    "ludogorets_razgrad": {
    "name": "Ludogorets Razgrad",
    "starting": [
    { "pos": "GK", "name": "Hendrik Bonmann" },
    { "pos": "GK", "name": "Sergio Padt" },
    { "pos": "CB", "name": "Edvin Kurtulus" },
    { "pos": "CB", "name": "Olivier Verdon" },
    { "pos": "CB", "name": "Dinis Almeida" },
    { "pos": "CB", "name": "Idan Nachmias" },
    { "pos": "LB", "name": "Vinícius Nogueira" },
    { "pos": "RB", "name": "Son" },
    { "pos": "RB", "name": "Joel Andersson" },
    { "pos": "CDM", "name": "Pedro Naressi" },
    { "pos": "CDM", "name": "Ivan Yordanov" },
    ],
    "subs": [
    { "pos": "CM", "name": "Deroy Duarte" },
    { "pos": "CM", "name": "Ivaylo Chochev" },
    { "pos": "CM", "name": "Filip Kaloc" },
    { "pos": "CAM", "name": "Petar Stanic" },
    { "pos": "CAM", "name": "Aguibou Camara" },
    { "pos": "LW", "name": "Caio Vidal" },
    { "pos": "RW", "name": "Erick Marcus" },
    { "pos": "RW", "name": "Bernard Tekpetey" },
    { "pos": "RW", "name": "Stanislav Ivanov" },
    { "pos": "CF", "name": "Rwan Cruz" },
    { "pos": "CF", "name": "Kwadwo Duah" },
    { "pos": "CF", "name": "Yves Erick Bile" },
    ]
    },
    "maccabi_tel_aviv": {
    "name": "Maccabi Tel Aviv",
    "starting": [
    { "pos": "GK", "name": "Ofek Melika" },
    { "pos": "GK", "name": "Roi Mishpati" },
    { "pos": "GK", "name": "Shalev Saadya" },
    { "pos": "CB", "name": "Tyrese Asante" },
    { "pos": "CB", "name": "Mohamed Camara" },
    { "pos": "CB", "name": "Raz Shlomo" },
    { "pos": "CB", "name": "Heitor" },
    { "pos": "CB", "name": "Itay Ben Hemo" },
    { "pos": "LB", "name": "Roy Revivo" },
    { "pos": "LB", "name": "Idan Weinberg" },
    { "pos": "RB", "name": "Noam Ben Harush" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Kristijan Belic" },
    { "pos": "CDM", "name": "Issouf Sissokho" },
    { "pos": "CDM", "name": "Itamar Noy" },
    { "pos": "CDM", "name": "Ben Lederman" },
    { "pos": "CDM", "name": "Roei Magor" },
    { "pos": "CM", "name": "Ido Shahar" },
    { "pos": "CM", "name": "Lotem Assras" },
    { "pos": "CAM", "name": "Kervin Andrade" },
    { "pos": "CAM", "name": "Ilay Ben Simon" },
    { "pos": "LW", "name": "Hélio Varela" },
    { "pos": "RW", "name": "Emir Sahiti" },
    { "pos": "RW", "name": "Osher Davida" },
    ]
    },
    "go_ahead_eagles": {
    "name": "Go Ahead Eagles",
    "starting": [
    { "pos": "GK", "name": "Jari De Busser" },
    { "pos": "GK", "name": "Luca Plogmann" },
    { "pos": "GK", "name": "Sven Jansen" },
    { "pos": "GK", "name": "Nando Verdoni" },
    { "pos": "CB", "name": "Julius Dirksen" },
    { "pos": "CB", "name": "Giovanni van Zwam" },
    { "pos": "LB", "name": "Dean James" },
    { "pos": "LB", "name": "Aske Adelgaard" },
    { "pos": "RB", "name": "Alfons Sampsted" },
    { "pos": "RB", "name": "Eus Waayers" },
    { "pos": "CDM", "name": "Melle Meulensteen" },
    ],
    "subs": [
    { "pos": "CM", "name": "Evert Linthorst" },
    { "pos": "CM", "name": "Kenzo Goudmijn" },
    { "pos": "CM", "name": "Yassir Salah Rahmouni" },
    { "pos": "CAM", "name": "Jakob Breum" },
    { "pos": "CAM", "name": "Søren Tengstedt" },
    { "pos": "LW", "name": "Mathis Suray" },
    { "pos": "LW", "name": "Oskar Sivertsen" },
    { "pos": "RW", "name": "Jaden Slory" },
    { "pos": "CF", "name": "Stefán Ingi Sigurdarson" },
    { "pos": "CF", "name": "Victor Edvardsen" },
    { "pos": "CF", "name": "Richonell Margaret" },
    { "pos": "CF", "name": "Thibo Baeten" },
    ]
    },
    "fcsb": {
    "name": "FCSB",
    "starting": [
    { "pos": "GK", "name": "Ștefan Târnovanu" },
    { "pos": "GK", "name": "Lukas Zima" },
    { "pos": "GK", "name": "Matei Popa" },
    { "pos": "GK", "name": "Mihai Udrea" },
    { "pos": "CB", "name": "Joyskim Dawa" },
    { "pos": "CB", "name": "André Duarte" },
    { "pos": "CB", "name": "Mihai Popescu" },
    { "pos": "CB", "name": "Daniel Graovac" },
    { "pos": "CB", "name": "Andrei Dăncuș" },
    { "pos": "LB", "name": "Risto Radunovic" },
    { "pos": "LB", "name": "David Kiki" },
    ],
    "subs": [
    { "pos": "RB", "name": "Alexandru Pantea" },
    { "pos": "RB", "name": "Ionuț Cercel" },
    { "pos": "RB", "name": "Valentin Crețu" },
    { "pos": "CDM", "name": "Ofri Arad" },
    { "pos": "CDM", "name": "João Paulo" },
    { "pos": "CDM", "name": "Baba Alhassan" },
    { "pos": "CM", "name": "Mihai Lixandru" },
    { "pos": "CM", "name": "Juri Cisotti" },
    { "pos": "CM", "name": "Mihai Toma" },
    { "pos": "CAM", "name": "Florin Tănase" },
    { "pos": "LW", "name": "Octavian Popescu" },
    { "pos": "RW", "name": "David Miculescu" },
    ]
    },
    "malm_ff": {
    "name": "Malmö FF",
    "starting": [
    { "pos": "GK", "name": "Robin Olsen" },
    { "pos": "GK", "name": "Ricardo Friedrich" },
    { "pos": "GK", "name": "Johan Dahlin" },
    { "pos": "GK", "name": "William Nieroth Lundgren" },
    { "pos": "CB", "name": "Colin Rösler" },
    { "pos": "CB", "name": "Bleon Kurtulus" },
    { "pos": "CB", "name": "Andrej Djuric" },
    { "pos": "CB", "name": "Malte Frejd Pålsson" },
    { "pos": "LB", "name": "Busanello" },
    { "pos": "LB", "name": "Noah Åstrand John" },
    { "pos": "RB", "name": "Johan Karlsson" },
    ],
    "subs": [
    { "pos": "RB", "name": "Jens Stryger" },
    { "pos": "CDM", "name": "Yanis Karabelyov" },
    { "pos": "CM", "name": "Otto Rosengren" },
    { "pos": "CM", "name": "Jovan Milosavljevic" },
    { "pos": "CM", "name": "Adrian Skogmar" },
    { "pos": "CM", "name": "Kenan Busuladzic" },
    { "pos": "CM", "name": "Theodor Lundbergh" },
    { "pos": "CM", "name": "Viggo Jeppsson" },
    { "pos": "CM", "name": "Gentian Lajqi" },
    { "pos": "CAM", "name": "Anton Höög" },
    { "pos": "CAM", "name": "Antonio Palac" },
    { "pos": "LW", "name": "Sead Haksabanovic" },
    ]
    },
    "brann": {
    "name": "SK Brann",
    "starting": [
    { "pos": "GK", "name": "Simen Vidtun Nilsen" },
    { "pos": "GK", "name": "Håkon Hellesøy" },
    { "pos": "CB", "name": "Cheikh Mbacké Diop" },
    { "pos": "CB", "name": "Rasmus Holten" },
    { "pos": "CB", "name": "Thore Pedersen" },
    { "pos": "LB", "name": "Joachim Soltvedt" },
    { "pos": "LB", "name": "Vetle Dragsnes" },
    { "pos": "LB", "name": "Jonas Torsvik" },
    { "pos": "RB", "name": "Martin Hellan" },
    { "pos": "CDM", "name": "Jacob Lungi Sørensen" },
    { "pos": "CM", "name": "Felix Horn Myhre" },
    ],
    "subs": [
    { "pos": "CM", "name": "Niklas Jensen Wassberg" },
    { "pos": "CAM", "name": "Kristall Máni Ingason" },
    { "pos": "CAM", "name": "Kristian Eriksen" },
    { "pos": "LW", "name": "Rabbi Matondo" },
    { "pos": "LW", "name": "Markus Haaland" },
    { "pos": "LW", "name": "Jón Dagur Thorsteinsson" },
    { "pos": "RW", "name": "Ulrik Mathisen" },
    { "pos": "RW", "name": "Chinedu Cyprain Ononogbo" },
    { "pos": "CF", "name": "Noah Holm" },
    { "pos": "CF", "name": "Bård Finne" },
    ]
    },
    "crystal_palace": {
    "name": "Crystal Palace",
    "starting": [
    { "pos": "GK", "name": "Walter Benítez" },
    { "pos": "GK", "name": "Remi Matthews" },
    { "pos": "CB", "name": "Maxence Lacroix" },
    { "pos": "CB", "name": "Jaydee Canvot" },
    { "pos": "CB", "name": "Chris Richards" },
    { "pos": "CB", "name": "Chadi Riad" },
    { "pos": "LB", "name": "Tyrick Mitchell" },
    { "pos": "LB", "name": "Borna Sosa" },
    { "pos": "LB", "name": "Rio Cardines" },
    { "pos": "RB", "name": "Daniel Muñoz" },
    { "pos": "RB", "name": "Nathaniel Clyne" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Adam Wharton" },
    { "pos": "CDM", "name": "Cheick Doucouré" },
    { "pos": "CDM", "name": "Jefferson Lerma" },
    { "pos": "CDM", "name": "David Ozoh" },
    { "pos": "CM", "name": "Will Hughes" },
    { "pos": "CAM", "name": "Justin Devenny" },
    { "pos": "CAM", "name": "Daichi Kamada" },
    { "pos": "RW", "name": "Ismaïla Sarr" },
    { "pos": "RW", "name": "Yéremy Pino" },
    { "pos": "RW", "name": "Brennan Johnson" },
    { "pos": "RW", "name": "Evann Guessand" },
    { "pos": "RW", "name": "Romain Esse" },
    ]
    },
    "strasbourg_alsace": {
    "name": "RC Strasbourg Alsace",
    "starting": [
    { "pos": "GK", "name": "Mike Penders" },
    { "pos": "GK", "name": "Stefan Bajic" },
    { "pos": "GK", "name": "Karl-Johan Johnsson" },
    { "pos": "CB", "name": "Ismaël Doukouré" },
    { "pos": "CB", "name": "Lucas Høgsberg" },
    { "pos": "CB", "name": "Aarón Anselmino" },
    { "pos": "LB", "name": "Ben Chilwell" },
    { "pos": "RB", "name": "Guéla Doué" },
    { "pos": "RB", "name": "Abdoul Ouattara" },
    { "pos": "CDM", "name": "Junior Mwanga" },
    { "pos": "CDM", "name": "Maxi Oyedele" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Rafael Luís" },
    { "pos": "CM", "name": "Valentín Barco" },
    { "pos": "CM", "name": "Samir El Mourabet" },
    { "pos": "CM", "name": "Mathis Amougou" },
    { "pos": "CM", "name": "Diego Moreira" },
    { "pos": "CAM", "name": "Julio Enciso" },
    { "pos": "LW", "name": "Martial Godo" },
    { "pos": "LW", "name": "Sebastian Nanasi" },
    { "pos": "RW", "name": "Gessime Yassine" },
    { "pos": "RW", "name": "Samuel Amo-Ameyaw" },
    { "pos": "RW", "name": "Yaya Diémé" },
    { "pos": "CF", "name": "David Datro Fofana" },
    ]
    },
    "acf_fiorentina": {
    "name": "ACF Fiorentina",
    "starting": [
    { "pos": "GK", "name": "Oliver Christensen" },
    { "pos": "GK", "name": "Luca Lezzerini" },
    { "pos": "CB", "name": "Pietro Comuzzo" },
    { "pos": "CB", "name": "Marin Pongracic" },
    { "pos": "CB", "name": "Luca Ranieri" },
    { "pos": "CB", "name": "Eddy Kouadio" },
    { "pos": "CB", "name": "Daniele Rugani" },
    { "pos": "CB", "name": "Eman Košpo" },
    { "pos": "LB", "name": "Niccolò Fortini" },
    { "pos": "LB", "name": "Robin Gosens" },
    { "pos": "LB", "name": "Luis Balbo" },
    ],
    "subs": [
    { "pos": "RB", "name": "Dodô" },
    { "pos": "CDM", "name": "Rolando Mandragora" },
    { "pos": "CM", "name": "Cher Ndour" },
    { "pos": "CM", "name": "Nicolò Fagioli" },
    { "pos": "CM", "name": "Marco Brescianini" },
    { "pos": "CM", "name": "Jacopo Fazzini" },
    { "pos": "CAM", "name": "Giovanni Fabbian" },
    { "pos": "CAM", "name": "Abdelhamid Sabiri" },
    { "pos": "LW", "name": "Manor Solomon" },
    { "pos": "LW", "name": "Jack Harrison" },
    { "pos": "ST", "name": "Albert Gudmundsson" },
    { "pos": "CF", "name": "Moise Kean" },
    ]
    },
    "shakhtar_donetsk": {
    "name": "Shakhtar Donetsk",
    "starting": [
    { "pos": "GK", "name": "Kiril Fesyun" },
    { "pos": "GK", "name": "Denys Tvardovskyi" },
    { "pos": "GK", "name": "Rostyslav Baglay" },
    { "pos": "CB", "name": "Valeriy Bondar" },
    { "pos": "CB", "name": "Alaa Ghram" },
    { "pos": "CB", "name": "Diego Arroyo" },
    { "pos": "LB", "name": "Pedro Henrique" },
    { "pos": "LB", "name": "Irakli Azarovi" },
    { "pos": "RB", "name": "Vinícius Tobias" },
    { "pos": "CM", "name": "Marlon Gomes" },
    { "pos": "CM", "name": "Dmytro Kryskiv" },
    ],
    "subs": [
    { "pos": "CM", "name": "Yegor Nazaryna" },
    { "pos": "CM", "name": "Viktor Tsukanov" },
    { "pos": "CAM", "name": "Isaque" },
    { "pos": "CAM", "name": "Artem Bondarenko" },
    { "pos": "CAM", "name": "Oleg Ocheretko" },
    { "pos": "LW", "name": "Newerton" },
    { "pos": "LW", "name": "Eguinaldo" },
    { "pos": "RW", "name": "Pedrinho" },
    { "pos": "RW", "name": "Alisson" },
    { "pos": "RW", "name": "Lucas Ferreira" },
    { "pos": "RW", "name": "Prosper Obah" },
    { "pos": "RW", "name": "Maryan Shved" },
    ]
    },
    "az_alkmaar": {
    "name": "AZ Alkmaar",
    "starting": [
    { "pos": "GK", "name": "Rome-Jayden Owusu-Oduro" },
    { "pos": "GK", "name": "Jeroen Zoet" },
    { "pos": "GK", "name": "Hobie Verhulst" },
    { "pos": "GK", "name": "Daniël Deen" },
    { "pos": "CB", "name": "Wouter Goes" },
    { "pos": "CB", "name": "Alexandre Penetra" },
    { "pos": "CB", "name": "Rion Ichihara" },
    { "pos": "CB", "name": "Billy van Duijl" },
    { "pos": "CB", "name": "Maxim Dekker" },
    { "pos": "LB", "name": "Mees de Wit" },
    { "pos": "LB", "name": "Mateo Chávez" },
    ],
    "subs": [
    { "pos": "RB", "name": "Elijah Dijkstra" },
    { "pos": "RB", "name": "Denso Kasius" },
    { "pos": "RB", "name": "Seiya Maikuma" },
    { "pos": "CDM", "name": "Peer Koopmeiners" },
    { "pos": "CDM", "name": "Kasper Boogaard" },
    { "pos": "CM", "name": "Kees Smit" },
    { "pos": "CAM", "name": "Sven Mijnans" },
    { "pos": "CAM", "name": "Matej Sin" },
    { "pos": "LW", "name": "Isak Jensen" },
    { "pos": "LW", "name": "Ro-Zangelo Daal" },
    { "pos": "LW", "name": "Wassim Bouziane" },
    { "pos": "RW", "name": "Weslley Patati" },
    ]
    },
    "1fsv_mainz_05": {
    "name": "1.FSV Mainz 05",
    "starting": [
    { "pos": "GK", "name": "Robin Zentner" },
    { "pos": "GK", "name": "Lasse Rieß" },
    { "pos": "GK", "name": "Daniel Batz" },
    { "pos": "CB", "name": "Kacper Potulski" },
    { "pos": "CB", "name": "Stefan Posch" },
    { "pos": "CB", "name": "Andreas Hanche-Olsen" },
    { "pos": "CB", "name": "Dominik Kohr" },
    { "pos": "CB", "name": "Danny da Costa" },
    { "pos": "CB", "name": "Stefan Bell" },
    { "pos": "CB", "name": "Maxim Dal" },
    { "pos": "LB", "name": "Phillipp Mwene" },
    ],
    "subs": [
    { "pos": "RB", "name": "Anthony Caci" },
    { "pos": "CDM", "name": "Kaishu Sano" },
    { "pos": "CDM", "name": "Lennard Maloney" },
    { "pos": "CDM", "name": "Sota Kawasaki" },
    { "pos": "CDM", "name": "Niklas Tauer" },
    { "pos": "CM", "name": "Nadiem Amiri" },
    { "pos": "CM", "name": "Daniel Gleiber" },
    { "pos": "CM", "name": "Nikolas Veratschnig" },
    { "pos": "CAM", "name": "Paul Nebel" },
    { "pos": "CAM", "name": "Jae-sung Lee" },
    { "pos": "LW", "name": "Sheraldo Becker" },
    { "pos": "ST", "name": "Armindo Sieb" },
    ]
    },
    "rayo_vallecano": {
    "name": "Rayo Vallecano",
    "starting": [
    { "pos": "GK", "name": "Augusto Batalla" },
    { "pos": "GK", "name": "Dani Cárdenas" },
    { "pos": "CB", "name": "Nobel Mendy" },
    { "pos": "CB", "name": "Abdul Mumin" },
    { "pos": "CB", "name": "Luiz Felipe" },
    { "pos": "CB", "name": "Jozhua Vertrouwd" },
    { "pos": "CB", "name": "Florian Lejeune" },
    { "pos": "LB", "name": "Pep Chavarría" },
    { "pos": "LB", "name": "Alfonso Espino" },
    { "pos": "RB", "name": "Iván Balliu" },
    { "pos": "CDM", "name": "Gerard Gumbau" },
    ],
    "subs": [
    { "pos": "CM", "name": "Pedro Díaz" },
    { "pos": "CM", "name": "Unai López" },
    { "pos": "CM", "name": "Pathé Ciss" },
    { "pos": "CM", "name": "Samu Becerra" },
    { "pos": "CAM", "name": "Randy Nteka" },
    { "pos": "CAM", "name": "Óscar Trejo" },
    { "pos": "LW", "name": "Carlos Martín" },
    { "pos": "LW", "name": "Álvaro García" },
    { "pos": "RW", "name": "Ilias Akhomach" },
    { "pos": "RW", "name": "Jorge de Frutos" },
    { "pos": "RW", "name": "Fran Pérez" },
    { "pos": "CF", "name": "Alemão" },
    ]
    },
    "dynamo_kyiv": {
    "name": "Dynamo Kyiv",
    "starting": [
    { "pos": "GK", "name": "Ruslan Neshcheret" },
    { "pos": "GK", "name": "Valentyn Morgun" },
    { "pos": "GK", "name": "Vyacheslav Surkis" },
    { "pos": "GK", "name": "Denys Ignatenko" },
    { "pos": "CB", "name": "Taras Mykhavko" },
    { "pos": "CB", "name": "Denys Popov" },
    { "pos": "CB", "name": "Kristian Bilovar" },
    { "pos": "CB", "name": "Aliou Thiaré" },
    { "pos": "LB", "name": "Kostyantyn Vivcharenko" },
    { "pos": "LB", "name": "Vladyslav Dubinchak" },
    { "pos": "RB", "name": "Oleksandr Karavaev" },
    ],
    "subs": [
    { "pos": "RB", "name": "Maksym Korobov" },
    { "pos": "CDM", "name": "Volodymyr Brazhko" },
    { "pos": "CM", "name": "Mykola Shaparenko" },
    { "pos": "CM", "name": "Oleksandr Pikhalyonok" },
    { "pos": "CM", "name": "Oleksandr Yatsyk" },
    { "pos": "LW", "name": "Bogdan Redushko" },
    { "pos": "LW", "name": "Shola Ogundana" },
    { "pos": "RW", "name": "Nazar Voloshyn" },
    { "pos": "RW", "name": "Andriy Yarmolenko" },
    { "pos": "CF", "name": "Matviy Ponomarenko" },
    { "pos": "CF", "name": "Eduardo Guerrero" },
    { "pos": "CF", "name": "Vladislav Blănuță" },
    ]
    },
    "sparta_prague": {
    "name": "AC Sparta Prague",
    "starting": [
    { "pos": "GK", "name": "Jakub Surovcik" },
    { "pos": "GK", "name": "Daniel Kerl" },
    { "pos": "CB", "name": "Adam Sevinsky" },
    { "pos": "CB", "name": "Asger Sörensen" },
    { "pos": "CB", "name": "Filip Panák" },
    { "pos": "CB", "name": "Jakub Martinec" },
    { "pos": "CB", "name": "Jaroslav Zelený" },
    { "pos": "RB", "name": "Oliver Sonne" },
    { "pos": "CDM", "name": "Patrik Vydra" },
    { "pos": "CDM", "name": "Sivert Mannsverk" },
    { "pos": "CM", "name": "Kaan Kairinen" },
    ],
    "subs": [
    { "pos": "CM", "name": "Andrew Irving" },
    { "pos": "CM", "name": "Hugo Sochurek" },
    { "pos": "CM", "name": "Matej Rynes" },
    { "pos": "CAM", "name": "Santiago Eneme" },
    { "pos": "LW", "name": "John Mercado" },
    { "pos": "LW", "name": "Garang Kuol" },
    { "pos": "CF", "name": "Albion Rrahmani" },
    { "pos": "CF", "name": "Matyas Vojta" },
    { "pos": "CF", "name": "Jan Kuchta" },
    ]
    },
    "aek_athens": {
    "name": "AEK Athens",
    "starting": [
    { "pos": "GK", "name": "Thomas Strakosha" },
    { "pos": "GK", "name": "Alberto Brignoli" },
    { "pos": "GK", "name": "Angelos Angelopoulos" },
    { "pos": "GK", "name": "Marios Balamotis" },
    { "pos": "CB", "name": "Harold Moukoudi" },
    { "pos": "CB", "name": "Filipe Relvas" },
    { "pos": "CB", "name": "Martin Georgiev" },
    { "pos": "CB", "name": "Domagoj Vida" },
    { "pos": "CB", "name": "Christos Kosidis" },
    { "pos": "LB", "name": "James Penrice" },
    { "pos": "LB", "name": "Stavro Pilo" },
    ],
    "subs": [
    { "pos": "RB", "name": "Lazaros Rota" },
    { "pos": "CM", "name": "Orbelín Pineda" },
    { "pos": "CM", "name": "Răzvan Marin" },
    { "pos": "CM", "name": "Roberto Pereyra" },
    { "pos": "CM", "name": "Niclas Eliasson" },
    { "pos": "CAM", "name": "Dimitrios Kaloskamis" },
    { "pos": "CAM", "name": "Mijat Gacinovic" },
    { "pos": "CAM", "name": "João Mário" },
    { "pos": "LW", "name": "Aboubakary Koita" },
    { "pos": "LW", "name": "Dereck Kutesa" },
    { "pos": "CF", "name": "Luka Jović" },
    { "pos": "CF", "name": "Barnabás Varga" },
    ]
    },
    "samsunspor": {
    "name": "Samsunspor",
    "starting": [
    { "pos": "GK", "name": "Okan Kocuk" },
    { "pos": "GK", "name": "İrfan Can Eğribayat" },
    { "pos": "GK", "name": "Efe Yiğit Üstün" },
    { "pos": "GK", "name": "Efe Berat Töruz" },
    { "pos": "CB", "name": "Rick van Drongelen" },
    { "pos": "CB", "name": "Toni Borevković" },
    { "pos": "CB", "name": "Lubomir Satka" },
    { "pos": "CB", "name": "Ali Badra Diabaté" },
    { "pos": "CB", "name": "Yunus Emre Çift" },
    { "pos": "CB", "name": "Bedirhan Çetin" },
    { "pos": "LB", "name": "Logi Tómasson" },
    ],
    "subs": [
    { "pos": "LB", "name": "Soner Gönül" },
    { "pos": "LB", "name": "Enes Albak" },
    { "pos": "RB", "name": "Joe Mendes" },
    { "pos": "CDM", "name": "Antoine Makoumbou" },
    { "pos": "CDM", "name": "Franck Atoen" },
    { "pos": "CDM", "name": "Eyüp Değirmenci" },
    { "pos": "CM", "name": "Olivier Ntcham" },
    { "pos": "CM", "name": "Yalçın Kayan" },
    { "pos": "CM", "name": "Celil Yüksel" },
    { "pos": "CM", "name": "Muhammet Özbaskıcı" },
    { "pos": "CM", "name": "Alper Efe Pazar" },
    { "pos": "CAM", "name": "Carlo Holse" },
    ]
    },
    "lech_poznan": {
    "name": "Lech Poznan",
    "starting": [
    { "pos": "GK", "name": "Bartosz Mrozek" },
    { "pos": "GK", "name": "Plamen Andreev" },
    { "pos": "GK", "name": "Mateusz Pruchniewski" },
    { "pos": "CB", "name": "Wojciech Mońka" },
    { "pos": "CB", "name": "Mateusz Skrzypczak" },
    { "pos": "CB", "name": "Antonio Milic" },
    { "pos": "CB", "name": "Hubert Janyszka" },
    { "pos": "LB", "name": "Michał Gurgul" },
    { "pos": "LB", "name": "João Moutinho" },
    { "pos": "RB", "name": "Joel Pereira" },
    { "pos": "RB", "name": "Robert Gumny" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Antoni Kozubal" },
    { "pos": "CDM", "name": "Timothy Ouma" },
    { "pos": "CDM", "name": "Gísli Thórdarson" },
    { "pos": "CDM", "name": "Radosław Murawski" },
    { "pos": "CDM", "name": "Sammy Dudek" },
    { "pos": "CAM", "name": "Patrik Wålemark" },
    { "pos": "CAM", "name": "Pablo Rodríguez" },
    { "pos": "CAM", "name": "Filip Jagiełło" },
    { "pos": "LW", "name": "Luis Palma" },
    { "pos": "LW", "name": "Leo Bengtsson" },
    { "pos": "LW", "name": "Daniel Håkans" },
    { "pos": "RW", "name": "Taofeek Ismaheel" },
    ]
    },
    "rapid_vienna": {
    "name": "Rapid Vienna",
    "starting": [
    { "pos": "GK", "name": "Niklas Hedl" },
    { "pos": "GK", "name": "Paul Gartler" },
    { "pos": "GK", "name": "Laurenz Orgler" },
    { "pos": "GK", "name": "Benjamin Göschl" },
    { "pos": "CB", "name": "Serge-Philippe Raux-Yao" },
    { "pos": "CB", "name": "Ange Ahoussou" },
    { "pos": "CB", "name": "Jakob Schöller" },
    { "pos": "CB", "name": "Nenad Cvetkovic" },
    { "pos": "CB", "name": "Amin-Elias Gröller" },
    { "pos": "LB", "name": "Jonas Auer" },
    { "pos": "RB", "name": "Bendegúz Bolla" },
    ],
    "subs": [
    { "pos": "RB", "name": "Furkan Demir" },
    { "pos": "CDM", "name": "Lukas Grgic" },
    { "pos": "CDM", "name": "Tobias Børkeeiet" },
    { "pos": "CM", "name": "Romeo Amane" },
    { "pos": "CM", "name": "Louis Schaub" },
    { "pos": "CAM", "name": "Tobias Gulliksen" },
    { "pos": "LW", "name": "Petter Nosa Dahl" },
    { "pos": "LW", "name": "Dominik Weixelbraun" },
    { "pos": "RW", "name": "Nikolaus Wurmbrand" },
    { "pos": "RW", "name": "Marco Tilio" },
    { "pos": "CF", "name": "Janis Antiste" },
    { "pos": "CF", "name": "Ercan Kara" },
    ]
    },
    "rakw_czstochowa": {
    "name": "Raków Częstochowa",
    "starting": [
    { "pos": "GK", "name": "Kacper Trelowski" },
    { "pos": "GK", "name": "Oliwier Zych" },
    { "pos": "GK", "name": "Wiktor Zolneczko" },
    { "pos": "GK", "name": "Dominik Czeremski" },
    { "pos": "CB", "name": "Stratos Svarnas" },
    { "pos": "CB", "name": "Bogdan Racovițan" },
    { "pos": "CB", "name": "Ariel Mosór" },
    { "pos": "CB", "name": "Paweł Dawidowicz" },
    { "pos": "CB", "name": "Zoran Arsenic" },
    { "pos": "CB", "name": "Jerzy Napieraj" },
    { "pos": "CDM", "name": "Marko Bulat" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Oskar Repka" },
    { "pos": "CDM", "name": "Vladyslav Kochergin" },
    { "pos": "CDM", "name": "Abraham Ojo" },
    { "pos": "CM", "name": "Fran Tudor" },
    { "pos": "CM", "name": "Michael Ameyaw" },
    { "pos": "CM", "name": "Mitja Ilenic" },
    { "pos": "CM", "name": "Adriano" },
    { "pos": "CM", "name": "Jean Carlos Silva" },
    { "pos": "CAM", "name": "Lamine Diaby-Fadiga" },
    { "pos": "CAM", "name": "Tomasz Pieńko" },
    { "pos": "CAM", "name": "Bogdan Mirčetić" },
    { "pos": "CAM", "name": "Patryk Makuch" },
    ]
    },
    "jagiellonia_bialystok": {
    "name": "Jagiellonia Bialystok",
    "starting": [
    { "pos": "GK", "name": "Sławomir Abramowicz" },
    { "pos": "GK", "name": "Miłosz Piekutowski" },
    { "pos": "GK", "name": "Adrian Damasiewicz" },
    { "pos": "CB", "name": "Bernardo Vital" },
    { "pos": "CB", "name": "Andy Pelmard" },
    { "pos": "CB", "name": "Dusan Stojinovic" },
    { "pos": "CB", "name": "Apostolos Konstantopoulos" },
    { "pos": "CB", "name": "Yuki Kobayashi" },
    { "pos": "LB", "name": "Bartlomiej Wdowik" },
    { "pos": "LB", "name": "Guilherme Montóia" },
    { "pos": "RB", "name": "Norbert Wojtuszek" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Sergio Lozano" },
    { "pos": "CDM", "name": "Leon Flach" },
    { "pos": "CDM", "name": "Eryk Kozłowski" },
    { "pos": "CAM", "name": "Bartosz Mazurek" },
    { "pos": "CAM", "name": "Dawid Drachal" },
    { "pos": "CAM", "name": "Jesús Imaz" },
    { "pos": "LW", "name": "Matías Nahuel" },
    { "pos": "LW", "name": "Kajetan Szmyt" },
    { "pos": "LW", "name": "Kamil Jóźwiak" },
    { "pos": "RW", "name": "Álex Pozo" },
    { "pos": "RW", "name": "Zachary Zalewski" },
    { "pos": "RW", "name": "Maciej Kuczyński" },
    ]
    },
    "hnk_rijeka": {
    "name": "HNK Rijeka",
    "starting": [
    { "pos": "GK", "name": "Martin Zlomislic" },
    { "pos": "GK", "name": "David Nwolokor" },
    { "pos": "GK", "name": "Aleksa Todorovic" },
    { "pos": "GK", "name": "Niko Vucetic" },
    { "pos": "CB", "name": "Stjepan Radeljic" },
    { "pos": "CB", "name": "Anel Husic" },
    { "pos": "CB", "name": "Ante Majstorovic" },
    { "pos": "CB", "name": "Roko Valincic" },
    { "pos": "CB", "name": "Mile Skoric" },
    { "pos": "LB", "name": "Mladen Devetak" },
    { "pos": "LB", "name": "Noel Bodetic" },
    ],
    "subs": [
    { "pos": "RB", "name": "Ante Orec" },
    { "pos": "RB", "name": "Justas Lasickas" },
    { "pos": "CDM", "name": "Alfonso Barco" },
    { "pos": "CDM", "name": "Branko Pavic" },
    { "pos": "CDM", "name": "Bruno Burcul" },
    { "pos": "CM", "name": "Tiago Dantas" },
    { "pos": "CM", "name": "Dejan Petrovic" },
    { "pos": "CM", "name": "Rajan Zlibanovic" },
    { "pos": "CAM", "name": "Toni Fruk" },
    { "pos": "CAM", "name": "Samuele Vignato" },
    { "pos": "CAM", "name": "Amer Gojak" },
    { "pos": "CAM", "name": "Merveil Ndockyt" },
    ]
    },
    "universitatea_craiova": {
    "name": "Universitatea Craiova",
    "starting": [
    { "pos": "GK", "name": "Laurențiu Popescu" },
    { "pos": "GK", "name": "João Gonçalves" },
    { "pos": "GK", "name": "Matei Goga" },
    { "pos": "GK", "name": "Alexandru Glodean" },
    { "pos": "CB", "name": "Oleksandr Romanchuk" },
    { "pos": "CB", "name": "Vladimir Screciu" },
    { "pos": "CB", "name": "Adrian Rus" },
    { "pos": "CB", "name": "Juraj Badelj" },
    { "pos": "CB", "name": "Nikola Stevanovic" },
    { "pos": "CB", "name": "Vasile Mogoș" },
    { "pos": "CB", "name": "Darius Fălcușan" },
    ],
    "subs": [
    { "pos": "LB", "name": "Florin Ștefan" },
    { "pos": "CDM", "name": "Anzor Mekvabishvili" },
    { "pos": "CDM", "name": "Tudor Băluță" },
    { "pos": "CDM", "name": "Alexandru Crețu" },
    { "pos": "CM", "name": "David Matei" },
    { "pos": "CM", "name": "Samuel Teles" },
    { "pos": "CM", "name": "Robert Ristoiu" },
    { "pos": "CM", "name": "Carlos Mora" },
    { "pos": "CAM", "name": "Alexandru Cicâldău" },
    { "pos": "CAM", "name": "Sebastian Șerban" },
    { "pos": "LW", "name": "Ștefan Baiaram" },
    { "pos": "LW", "name": "Luca Băsceanu" },
    ]
    },
    "slovan_bratislava": {
    "name": "Slovan Bratislava",
    "starting": [
    { "pos": "GK", "name": "Dominik Takac" },
    { "pos": "GK", "name": "Martin Trnovsky" },
    { "pos": "GK", "name": "Matus Macik" },
    { "pos": "CB", "name": "Svetozar Markovic" },
    { "pos": "CB", "name": "Kenan Bajric" },
    { "pos": "CB", "name": "Kevin Wimmer" },
    { "pos": "CB", "name": "Sidoine Fogning" },
    { "pos": "CB", "name": "Guram Kashia" },
    { "pos": "LB", "name": "Sandro Cruz" },
    { "pos": "LB", "name": "Sharani Zuberu" },
    { "pos": "RB", "name": "César Blackman" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Peter Pokorný" },
    { "pos": "CM", "name": "Rahim Ibrahim" },
    { "pos": "CM", "name": "Daiki Matsuoka" },
    { "pos": "CM", "name": "Danylo Ignatenko" },
    { "pos": "CM", "name": "Maxim Mateas" },
    { "pos": "CAM", "name": "Niko Jankovic" },
    { "pos": "CAM", "name": "Artur Gajdos" },
    { "pos": "LW", "name": "Alasana Yirajang" },
    { "pos": "LW", "name": "Robert Mak" },
    { "pos": "RW", "name": "Tigran Barseghyan" },
    { "pos": "CF", "name": "Mykola Kukharevych" },
    { "pos": "CF", "name": "Andraz Sporar" },
    ]
    },
    "lausannesport": {
    "name": "FC Lausanne-Sport",
    "starting": [
    { "pos": "GK", "name": "Karlo Letica" },
    { "pos": "GK", "name": "Thomas Castella" },
    { "pos": "CB", "name": "Karim Sow" },
    { "pos": "CB", "name": "Kévin Mouanga" },
    { "pos": "CB", "name": "Dircssi Ngonzo" },
    { "pos": "CB", "name": "Rodolfo Lippo" },
    { "pos": "LB", "name": "Morgan Poaty" },
    { "pos": "LB", "name": "Sékou Fofana" },
    { "pos": "RB", "name": "Theo Bergvall" },
    { "pos": "CDM", "name": "Jamie Roche" },
    { "pos": "CDM", "name": "Sékou Koné" },
    ],
    "subs": [
    { "pos": "CM", "name": "Gabriel Sigua" },
    { "pos": "CM", "name": "Nicky Beloko" },
    { "pos": "CM", "name": "Souleymane N'Diaye" },
    { "pos": "CM", "name": "Brandon Soppy" },
    { "pos": "CAM", "name": "Beyatt Lekoueiry" },
    { "pos": "CAM", "name": "Ethan Bruchez" },
    { "pos": "CAM", "name": "Florent Mollet" },
    { "pos": "RW", "name": "Alban Ajdini" },
    { "pos": "CF", "name": "Omar Janneh" },
    { "pos": "CF", "name": "Gaoussou Diakité" },
    { "pos": "CF", "name": "Nathan Butler-Oyedeji" },
    { "pos": "CF", "name": "Seydou Traoré" },
    ]
    },
    "sigma_olomouc": {
    "name": "SK Sigma Olomouc",
    "starting": [
    { "pos": "GK", "name": "Jan Koutny" },
    { "pos": "GK", "name": "Tadeas Stoppen" },
    { "pos": "GK", "name": "Matus Hruska" },
    { "pos": "GK", "name": "Tomas Digana" },
    { "pos": "CB", "name": "Louis Lurvink" },
    { "pos": "CB", "name": "Abdoulaye Sylla" },
    { "pos": "CB", "name": "Jan Kral" },
    { "pos": "CB", "name": "Matus Maly" },
    { "pos": "LB", "name": "Jiri Slama" },
    { "pos": "RB", "name": "Filip Slavicek" },
    { "pos": "RB", "name": "Matej Hadas" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Péter Baráth" },
    { "pos": "CDM", "name": "Jakub Jezierski" },
    { "pos": "CM", "name": "Michal Beran" },
    { "pos": "CM", "name": "Jiri Spacil" },
    { "pos": "CM", "name": "Matej Mikulenka" },
    { "pos": "CM", "name": "Ahmad Ghali" },
    { "pos": "CAM", "name": "Fabijan Krivak" },
    { "pos": "CAM", "name": "Dario Grgic" },
    { "pos": "CAM", "name": "Dominik Janosek" },
    { "pos": "LW", "name": "Danijel Sturm" },
    { "pos": "LW", "name": "Jachym Sip" },
    { "pos": "RW", "name": "Artūr Dolžnikov" },
    ]
    },
    "legia_warszawa": {
    "name": "Legia Warszawa",
    "starting": [
    { "pos": "GK", "name": "Otto Hindrich" },
    { "pos": "GK", "name": "Kacper Tobiasz" },
    { "pos": "GK", "name": "Gabriel Kobylak" },
    { "pos": "CB", "name": "Kamil Piątkowski" },
    { "pos": "CB", "name": "Jan Leszczyński" },
    { "pos": "CB", "name": "Radovan Pankov" },
    { "pos": "CB", "name": "Rafał Augustyniak" },
    { "pos": "CB", "name": "Artur Jędrzejczyk" },
    { "pos": "CDM", "name": "Juergen Elitim" },
    { "pos": "CDM", "name": "Damian Szymański" },
    { "pos": "CDM", "name": "Pascal Mozie" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Henrique Arreiol" },
    { "pos": "CDM", "name": "Claude Gonçalves" },
    { "pos": "CM", "name": "Kacper Chodyna" },
    { "pos": "CM", "name": "Rúben Vinagre" },
    { "pos": "CM", "name": "Patryk Kun" },
    { "pos": "CAM", "name": "Kacper Urbański" },
    { "pos": "CAM", "name": "Samuel Kovacik" },
    { "pos": "CAM", "name": "Vahan Bichakhchyan" },
    { "pos": "CAM", "name": "Wojciech Urbański" },
    { "pos": "CAM", "name": "Jakub Żewłakow" },
    { "pos": "LW", "name": "Ermal Krasniqi" },
    { "pos": "CF", "name": "Mileta Rajović" },
    ]
    },
    "bk_hcken": {
    "name": "BK Häcken",
    "starting": [
    { "pos": "GK", "name": "David Andersson" },
    { "pos": "GK", "name": "Andreas Linde" },
    { "pos": "GK", "name": "Etrit Berisha" },
    { "pos": "CB", "name": "Leo Väisänen" },
    { "pos": "CB", "name": "Filip Helander" },
    { "pos": "CB", "name": "Johan Hammar" },
    { "pos": "CB", "name": "Olle Samuelsson" },
    { "pos": "CB", "name": "Harry Hilvenius" },
    { "pos": "LB", "name": "Adam Lundkvist" },
    { "pos": "RB", "name": "Brice Wembangomo" },
    { "pos": "RB", "name": "Filip Öhman" },
    ],
    "subs": [
    { "pos": "RB", "name": "Ben Engdahl" },
    { "pos": "CDM", "name": "Silas Andersen" },
    { "pos": "CDM", "name": "Abdoulaye Doumbia" },
    { "pos": "CM", "name": "Sanders Ngabo" },
    { "pos": "CM", "name": "David Seger" },
    { "pos": "CM", "name": "Mikkel Rygaard" },
    { "pos": "CAM", "name": "Pontus Dahbo" },
    { "pos": "CAM", "name": "Julius Lindberg" },
    { "pos": "LW", "name": "Danilo Al-Saed" },
    { "pos": "RW", "name": "Jeremy Agbonifo" },
    { "pos": "RW", "name": "Amor Layouni" },
    { "pos": "RW", "name": "Sabri Kondo" },
    ]
    },
    "omonia_nicosia": {
    "name": "Omonia Nicosia",
    "starting": [
    { "pos": "GK", "name": "Francis Uzoho" },
    { "pos": "GK", "name": "Charalampos Kyriakidis" },
    { "pos": "GK", "name": "Fabiano" },
    { "pos": "GK", "name": "Pantelis Michail" },
    { "pos": "CB", "name": "Nikolas Panagiotou" },
    { "pos": "CB", "name": "Senou Coulibaly" },
    { "pos": "CB", "name": "Stefan Simic" },
    { "pos": "CB", "name": "Christos Konstantinidis" },
    { "pos": "LB", "name": "Jure Balkovec" },
    { "pos": "LB", "name": "Andreas Christou" },
    { "pos": "RB", "name": "Alpha Diounkou" },
    ],
    "subs": [
    { "pos": "RB", "name": "Giannis Masouras" },
    { "pos": "RB", "name": "Moses Odubajo" },
    { "pos": "CDM", "name": "Mateo Maric" },
    { "pos": "CM", "name": "Carel Eiting" },
    { "pos": "CM", "name": "Panagiotis Andreou" },
    { "pos": "CM", "name": "Novica Erakovic" },
    { "pos": "CAM", "name": "Muamer Tankovic" },
    { "pos": "CAM", "name": "Ewandro Costa" },
    { "pos": "CAM", "name": "Mateusz Musiałowski" },
    { "pos": "LW", "name": "Willy Semedo" },
    { "pos": "LW", "name": "Anastasios Chatzigiovanis" },
    { "pos": "LW", "name": "Vladimiros Savva" },
    ]
    },
    "aberdeen_fc": {
    "name": "Aberdeen FC",
    "starting": [
    { "pos": "GK", "name": "Dimitar Mitov" },
    { "pos": "GK", "name": "Per Kristian Bråtveit" },
    { "pos": "GK", "name": "Nick Suman" },
    { "pos": "CB", "name": "Jack Milne" },
    { "pos": "CB", "name": "Kristers Tobers" },
    { "pos": "CB", "name": "Mats Knoester" },
    { "pos": "CB", "name": "Gavin Molloy" },
    { "pos": "CB", "name": "Elvis Bwomono" },
    { "pos": "LB", "name": "Mitchel Frame" },
    { "pos": "LB", "name": "Emmanuel Gyamfi" },
    { "pos": "RB", "name": "Alexander Jensen" },
    ],
    "subs": [
    { "pos": "RB", "name": "Dylan Lobban" },
    { "pos": "RB", "name": "Nicky Devlin" },
    { "pos": "CDM", "name": "Ante Palaversa" },
    { "pos": "CDM", "name": "Afeez Aremu" },
    { "pos": "CDM", "name": "Kjartan Már Kjartansson" },
    { "pos": "CM", "name": "Findlay Marshall" },
    { "pos": "CM", "name": "Stuart Armstrong" },
    { "pos": "CM", "name": "Ryan Duncan" },
    { "pos": "LW", "name": "Topi Keskinen" },
    { "pos": "LW", "name": "Kenan Bilalovic" },
    { "pos": "RW", "name": "Nicolas Milanovic" },
    { "pos": "CF", "name": "Kevin Nisbet" },
    ]
    },
    "aek_larnaca": {
    "name": "AEK Larnaca",
    "starting": [
    { "pos": "GK", "name": "Zlatan Alomerovic" },
    { "pos": "GK", "name": "Kewin Komar" },
    { "pos": "GK", "name": "Andreas Paraskevas" },
    { "pos": "GK", "name": "Dimitris Dimitriou" },
    { "pos": "CB", "name": "Hrvoje Milicevic" },
    { "pos": "CB", "name": "Valentin Roberge" },
    { "pos": "LB", "name": "Yahav Gurfinkel" },
    { "pos": "RB", "name": "Godswill Ekpolo" },
    { "pos": "RB", "name": "Petros Ioannou" },
    { "pos": "RB", "name": "Maximos Petousis" },
    { "pos": "CDM", "name": "Charalampos Kyriakou" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Gus Ledes" },
    { "pos": "CM", "name": "Pere Pons" },
    { "pos": "CM", "name": "Jimmy Suárez" },
    { "pos": "CM", "name": "Christodoulos Thoma" },
    { "pos": "CM", "name": "Jorge Miramón" },
    { "pos": "CAM", "name": "Robert Mudrazija" },
    { "pos": "CAM", "name": "Giorgos Naoum" },
    { "pos": "LW", "name": "Djordje Ivanovic" },
    { "pos": "LW", "name": "Youssef Amyn" },
    { "pos": "LW", "name": "David Gerasimou" },
    { "pos": "ST", "name": "Mathias Gonzalez" },
    { "pos": "CF", "name": "Riad Bajic" },
    ]
    },
    "noah_yerevan": {
    "name": "FC Noah Yerevan",
    "starting": [
    { "pos": "GK", "name": "Timothy Fayulu" },
    { "pos": "GK", "name": "Arthur Coneglian" },
    { "pos": "GK", "name": "Aleksey Ploshchadnyi" },
    { "pos": "CB", "name": "Sergey Muradyan" },
    { "pos": "CB", "name": "Nathanaël Saintini" },
    { "pos": "CB", "name": "Nermin Zolotic" },
    { "pos": "CB", "name": "Gonçalo Silva" },
    { "pos": "LB", "name": "David Sualehe" },
    { "pos": "LB", "name": "Rob Nizet" },
    { "pos": "RB", "name": "Eric Boakye" },
    { "pos": "CDM", "name": "Takuto Oshima" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Gustavo Sangaré" },
    { "pos": "CDM", "name": "Yan Eteki" },
    { "pos": "CDM", "name": "Aram Khamoyan" },
    { "pos": "CM", "name": "Hovhannes Harutyunyan" },
    { "pos": "CM", "name": "Valentin Costache" },
    { "pos": "CAM", "name": "Imran Oulad Omar" },
    { "pos": "CAM", "name": "Gor Manvelyan" },
    { "pos": "LW", "name": "Marin Jakolis" },
    { "pos": "LW", "name": "Misak Hakobyan" },
    { "pos": "LW", "name": "Bilal Fofana" },
    { "pos": "RW", "name": "Hélder Ferreira" },
    { "pos": "RW", "name": "Artem Avanesyan" },
    ]
    },
    "nk_celje": {
    "name": "NK Celje",
    "starting": [
    { "pos": "GK", "name": "Zan-Luk Leban" },
    { "pos": "GK", "name": "Simon Sluga" },
    { "pos": "GK", "name": "Luka Kolar" },
    { "pos": "CB", "name": "Łukasz Bejger" },
    { "pos": "CB", "name": "Damjan Vuklisevic" },
    { "pos": "CB", "name": "David Castro" },
    { "pos": "CB", "name": "Gasper Vodeb" },
    { "pos": "LB", "name": "Nino Vukasovic" },
    { "pos": "RB", "name": "Juanjo Nieto" },
    { "pos": "CDM", "name": "Mark Zabukovnik" },
    { "pos": "CDM", "name": "Darko Hrka" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Ivan Calusic" },
    { "pos": "CM", "name": "Papa Daniel" },
    { "pos": "CAM", "name": "Svit Seslar" },
    { "pos": "CAM", "name": "Jakov Pranjic" },
    { "pos": "CAM", "name": "Florjan Jevsenak" },
    { "pos": "CAM", "name": "Andrej Kotnik" },
    { "pos": "CAM", "name": "Rudi Pozeg Vancas" },
    { "pos": "CAM", "name": "Mario Kvesic" },
    { "pos": "CAM", "name": "Ivica Vidovic" },
    { "pos": "LW", "name": "Nikita Iosifov" },
    { "pos": "RW", "name": "Milot Avdyli" },
    { "pos": "CF", "name": "Armandas Kučys" },
    ]
    },
    "hsk_zrinjski_mostar": {
    "name": "HSK Zrinjski Mostar",
    "starting": [
    { "pos": "GK", "name": "Goran Karacic" },
    { "pos": "GK", "name": "Marin Ljubic" },
    { "pos": "GK", "name": "Tin Sajko" },
    { "pos": "CB", "name": "Duje Dujmovic" },
    { "pos": "CB", "name": "Darick Kobie Morris" },
    { "pos": "CB", "name": "David Karacic" },
    { "pos": "CB", "name": "Hrvoje Barisic" },
    { "pos": "CB", "name": "Slobodan Jakovljevic" },
    { "pos": "LB", "name": "Petar Mamic" },
    { "pos": "LB", "name": "Toma Palic" },
    { "pos": "RB", "name": "Marko Vranjkovic" },
    ],
    "subs": [
    { "pos": "RB", "name": "Kerim Memija" },
    { "pos": "RB", "name": "Mateo Susic" },
    { "pos": "CDM", "name": "Igor Savic" },
    { "pos": "CDM", "name": "Dan Lagumdzija" },
    { "pos": "CDM", "name": "Stefano Surdanovic" },
    { "pos": "CDM", "name": "Neven Djurasek" },
    { "pos": "CM", "name": "Marijan Cavar" },
    { "pos": "CAM", "name": "Adi Nalic" },
    { "pos": "CAM", "name": "Antonio Ivancic" },
    { "pos": "CAM", "name": "Antonio Ilic" },
    { "pos": "CAM", "name": "Ivan Posavec" },
    { "pos": "LW", "name": "Mario Cuze" },
    ]
    },
    "drita": {
    "name": "FC Drita",
    "starting": [
    { "pos": "GK", "name": "Faton Maloku" },
    { "pos": "GK", "name": "Laurit Behluli" },
    { "pos": "GK", "name": "Leutrim Rexhepi" },
    { "pos": "CB", "name": "Jorgo Pellumbi" },
    { "pos": "CB", "name": "Abdoul Karim Danté" },
    { "pos": "LB", "name": "Raddy Ovouka" },
    { "pos": "LB", "name": "Blerton Sheji" },
    { "pos": "RB", "name": "Besnik Krasniqi" },
    { "pos": "RB", "name": "Morris Fuseini" },
    { "pos": "CDM", "name": "Albert Dabiqaj" },
    { "pos": "CM", "name": "Vesel Limaj" },
    ],
    "subs": [
    { "pos": "CM", "name": "Kemehlo Nguena" },
    { "pos": "CM", "name": "Ben Zidane" },
    { "pos": "CM", "name": "Engjëll Sylejmani" },
    { "pos": "CM", "name": "Art Veseli" },
    { "pos": "CAM", "name": "Florent Ramadani" },
    { "pos": "LW", "name": "Almir Ajzeraj" },
    { "pos": "LW", "name": "Veton Tusha" },
    { "pos": "LW", "name": "Oniks Grezda" },
    { "pos": "RW", "name": "Liridon Balaj" },
    { "pos": "RW", "name": "Kristal Abazaj" },
    { "pos": "RW", "name": "Mike Arthur" },
    { "pos": "CF", "name": "Arb Manaj" },
    ]
    },
    "shkendija_tetovo": {
    "name": "Shkendija Tetovo",
    "starting": [
    { "pos": "GK", "name": "Baboucarr Gaye" },
    { "pos": "GK", "name": "Astrit Amzai" },
    { "pos": "GK", "name": "Ferat Ramani" },
    { "pos": "CB", "name": "Imran Fetai" },
    { "pos": "CB", "name": "Anes Meljichi" },
    { "pos": "CB", "name": "Nazif Ceka" },
    { "pos": "LB", "name": "Ronaldo Webster" },
    { "pos": "LB", "name": "Numan Ajetovikj" },
    { "pos": "RB", "name": "Aleksander Trumci" },
    { "pos": "RB", "name": "Mevlan Murati" },
    { "pos": "CDM", "name": "Drilon Islami" },
    ],
    "subs": [
    { "pos": "CDM", "name": "Adamu Alhassan" },
    { "pos": "CM", "name": "Arbin Zejnullai" },
    { "pos": "CAM", "name": "Endrit Krasniqi" },
    { "pos": "CAM", "name": "Sebastjan Spahiu" },
    { "pos": "LW", "name": "Liridon Latifi" },
    { "pos": "LW", "name": "Vane Krstevski" },
    { "pos": "RW", "name": "Fabrice Tamba" },
    { "pos": "RW", "name": "Atdhe Mazari" },
    { "pos": "RW", "name": "Lorik Kaba" },
    { "pos": "CF", "name": "Fahd Ndzengue" },
    ]
    },
    "shamrock_rovers": {
    "name": "Shamrock Rovers",
    "starting": [
    { "pos": "GK", "name": "Ed McGinty" },
    { "pos": "GK", "name": "Lee Steacy" },
    { "pos": "GK", "name": "Todd Bazunu" },
    { "pos": "GK", "name": "Alex Noonan" },
    { "pos": "CB", "name": "Dan Cleary" },
    { "pos": "CB", "name": "Cory O'Sullivan" },
    { "pos": "CB", "name": "Lee Grace" },
    { "pos": "CB", "name": "Egor Vassenin" },
    { "pos": "LB", "name": "Trevor Clarke" },
    { "pos": "LB", "name": "Enda Stevens" },
    { "pos": "RB", "name": "Tunmise Sobowale" },
    ],
    "subs": [
    { "pos": "RB", "name": "Adam Matthews" },
    { "pos": "CDM", "name": "Gary O'Neill" },
    { "pos": "CM", "name": "Matthew Healy" },
    { "pos": "CM", "name": "Jack Byrne" },
    { "pos": "CM", "name": "Dylan Watts" },
    { "pos": "CM", "name": "Connor Malley" },
    { "pos": "CM", "name": "John O'Sullivan" },
    { "pos": "CM", "name": "Zak Reddy" },
    { "pos": "CM", "name": "Danny Grant" },
    { "pos": "CAM", "name": "Victor Ozhianvuna" },
    { "pos": "CAM", "name": "Naj Razi" },
    { "pos": "CAM", "name": "Adam Brennan" },
    ]
    },
    "kuopion_palloseura": {
    "name": "Kuopion Palloseura",
    "starting": [
    { "pos": "GK", "name": "Johannes Kreidl" },
    { "pos": "GK", "name": "Hemmo Riihimäki" },
    { "pos": "GK", "name": "Kasperi Silen" },
    { "pos": "CB", "name": "Kasim Adams" },
    { "pos": "CB", "name": "Taneli Hämäläinen" },
    { "pos": "CB", "name": "Brahima Magassa" },
    { "pos": "CB", "name": "Arttu Lötjönen" },
    { "pos": "CB", "name": "Karl Ward" },
    { "pos": "LB", "name": "Clinton Antwi" },
    { "pos": "LB", "name": "Rasmus Tikkanen" },
    { "pos": "RB", "name": "Bob Nii Armah" },
    ],
    "subs": [
    { "pos": "RB", "name": "Saku Heiskanen" },
    { "pos": "RB", "name": "Akseli Puukko" },
    { "pos": "CM", "name": "Valentín Gasc" },
    { "pos": "CM", "name": "Niilo Kujasalo" },
    { "pos": "CM", "name": "Jerry Voutilainen" },
    { "pos": "CM", "name": "Samuel Pasanen" },
    { "pos": "CM", "name": "Aaro Toivonen" },
    { "pos": "CAM", "name": "Otto Ruoppi" },
    { "pos": "CAM", "name": "Arttu Heinonen" },
    { "pos": "CAM", "name": "Eemil Tanninen" },
    { "pos": "LW", "name": "Calvin Kabuye" },
    { "pos": "RW", "name": "Saku Savolainen" },
    ]
    },
    "hamrun_spartans": {
    "name": "Hamrun Spartans",
    "starting": [
    { "pos": "GK", "name": "Célio" },
    { "pos": "GK", "name": "Henry Bonello" },
    { "pos": "CM", "name": "Essien Borg" },
    { "pos": "CB", "name": "Sven Xerri" },
    { "pos": "LB", "name": "Ivan Inzoudine" },
    { "pos": "RB", "name": "Vincenzo Polito" },
    { "pos": "RB", "name": "Rafael Compri" },
    { "pos": "CDM", "name": "Matthew Guillaumier" },
    { "pos": "CDM", "name": "Matías García" },
    { "pos": "CDM", "name": "Ognjen Bjelicic" },
    { "pos": "CDM", "name": "Emerson" },
    ],
    "subs": [
    { "pos": "CM", "name": "Shaisen Attard" },
    { "pos": "CM", "name": "Kléri Serber" },
    { "pos": "CM", "name": "Danilo Bulevardi" },
    { "pos": "CM", "name": "Christopher Galea" },
    { "pos": "CM", "name": "Ryan Camenzuli" },
    { "pos": "CAM", "name": "Mouad El Fanis" },
    { "pos": "CAM", "name": "Michele Carboni" },
    { "pos": "LW", "name": "Jonny Robert" },
    { "pos": "RW", "name": "Joseph Mbong" },
    { "pos": "RW", "name": "Ederson" },
    { "pos": "CF", "name": "Damir Céter" },
    { "pos": "CF", "name": "Blessing Eleke" },
    ]
    },
    "shelbourne_fc": {
    "name": "Shelbourne FC",
    "starting": [
    { "pos": "GK", "name": "Wessel Speel" },
    { "pos": "GK", "name": "Conor Walsh" },
    { "pos": "GK", "name": "Cillian Campion" },
    { "pos": "GK", "name": "Finn Moylan" },
    { "pos": "GK", "name": "Ali Topcu" },
    { "pos": "CB", "name": "Kameron Ledwidge" },
    { "pos": "CB", "name": "Odhran Casey" },
    { "pos": "CB", "name": "Sam Bone" },
    { "pos": "CB", "name": "Zeno Ibsen Rossi" },
    { "pos": "CB", "name": "James Roche" },
    { "pos": "LB", "name": "James Norris" },
    ],
    "subs": [
    { "pos": "RB", "name": "Milan Mbeng" },
    { "pos": "RB", "name": "Sean Gannon" },
    { "pos": "CDM", "name": "Jack Henry-Francis" },
    { "pos": "CDM", "name": "JJ Lunney" },
    { "pos": "CM", "name": "Alex Flynn" },
    { "pos": "CM", "name": "Evan Caffrey" },
    { "pos": "CM", "name": "Cillian Ryan" },
    { "pos": "CAM", "name": "Harry Wood" },
    { "pos": "CAM", "name": "Ellis Chapman" },
    { "pos": "CAM", "name": "Ali Coote" },
    { "pos": "CAM", "name": "James Bailey" },
    { "pos": "LW", "name": "Will Jarvis" },
    ]
    },
    "breidablik_kpavogur": {
    "name": "Breidablik Kópavogur",
    "starting": [
    { "pos": "GK", "name": "Anton Ari Einarsson" },
    { "pos": "GK", "name": "Gylfi Berg Snaehólm" },
    { "pos": "CB", "name": "Viktor Örn Margeirsson" },
    { "pos": "CB", "name": "Ívar Örn Árnason" },
    { "pos": "CB", "name": "Ásgeir Helgi Orrason" },
    { "pos": "LB", "name": "Davíd Ingvarsson" },
    { "pos": "LB", "name": "Kristinn Jónsson" },
    { "pos": "RB", "name": "Valgeir Valgeirsson" },
    { "pos": "RB", "name": "Gabríel Snaer Hallsson" },
    { "pos": "CDM", "name": "Anton Logi Lúdvíksson" },
    { "pos": "CDM", "name": "Arnór Gauti Jónsson" },
    ],
    "subs": [
    { "pos": "CM", "name": "Viktor Karl Einarsson" },
    { "pos": "CM", "name": "Andri Rafn Yeoman" },
    { "pos": "CAM", "name": "Kristinn Steindórsson" },
    { "pos": "CAM", "name": "Breki Freyr Ágústsson" },
    { "pos": "LW", "name": "Aron Bjarnason" },
    { "pos": "LW", "name": "Ágúst Orri Thorsteinsson" },
    { "pos": "LW", "name": "Dagur Fjeldsted" },
    { "pos": "RW", "name": "Óli Valur Ómarsson" },
    { "pos": "RW", "name": "Jónatan Gudni Arnarsson" },
    { "pos": "CF", "name": "Kristófer Kristinsson" },
    ]
    },
    "lincoln_red_imps_fc": {
    "name": "Lincoln Red Imps FC",
    "starting": [
    { "pos": "GK", "name": "Jaylan Hankins" },
    { "pos": "GK", "name": "Nauzet García" },
    { "pos": "GK", "name": "Curro" },
    { "pos": "CB", "name": "Christian Rutjens" },
    { "pos": "LB", "name": "Ethan Britto" },
    { "pos": "LB", "name": "Jesús Toscano" },
    { "pos": "RB", "name": "Julliani Eersteling" },
    { "pos": "RB", "name": "Ibrahim Ayew" },
    { "pos": "CDM", "name": "Joe" },
    { "pos": "CM", "name": "Nicholas Pozo" },
    { "pos": "CM", "name": "Graeme Torrilla" },
    ],
    "subs": [
    { "pos": "CM", "name": "Mandi" },
    { "pos": "CM", "name": "Kyle Clinton" },
    { "pos": "CM", "name": "Nano" },
    { "pos": "CM", "name": "Kaleem Smith" },
    { "pos": "LW", "name": "Álex Mula" },
    { "pos": "LW", "name": "Toni Kolega" },
    { "pos": "LW", "name": "Yussef Flalhi Idrissi" },
    { "pos": "LW", "name": "Juanje Argüez" },
    { "pos": "LW", "name": "Toni García" },
    { "pos": "RW", "name": "Victor Villacañas" },
    { "pos": "RW", "name": "Rubén García" },
    { "pos": "CF", "name": "Tjay De Barr" },
    ]
    },
};

const NAME_MAP = {
  'çorumspor': 'çorum', 'çorum fk': 'çorum', 'gaziantepspor': 'gaziantep', 'gaziantep fk': 'gaziantep', 'çaykur rizespor': 'rizespor', 'erzurumspor fk': 'erzurumspor',
  'real': 'real madrid', 'realmadrid': 'real madrid',
  'barça': 'barcelona', 'barce': 'barcelona',
  'manchester city': 'manchester city', 'mancity': 'manchester city', 'city': 'manchester city',
  'bayern': 'bayern munich', 'munich': 'bayern munich',
  'paris saint-germain': 'psg', 'paris': 'psg',
  'manchester united': 'manchester united', 'manutd': 'manchester united', 'united': 'manchester united',
  'juve': 'juventus',
  'milan': 'ac milan', 'acmilan': 'ac milan',
  'inter': 'inter milan', 'intermilan': 'inter milan',
  'atletico': 'atletico madrid', 'atm': 'atletico madrid',

  "chelsea": "chelsea_fc",
  "tottenham": "tottenham_hotspur",
  "newcastle": "newcastle_united",
  "dortmund": "borussia_dortmund",
  "sporting": "sporting_cp",
  "leverkusen": "bayer_04_leverkusen",
  "atalanta": "atalanta_bc",
  "napoli": "ssc_napoli",
  "frankfurt": "eintracht_frankfurt",
  "marseille": "olympique_marseille",
  "benfica": "sl_benfica",
  "villarreal": "villarreal_cf",
  "bilbao": "athletic_bilbao",
  "club brugge": "club_brugge_kv",
  "ajax": "ajax_amsterdam",
  "olympiacos": "olympiacos_piraeus",
  "nottingham": "nottingham_forest",
  "aston villa": "aston_villa",
  "stuttgart": "vfb_stuttgart",
  "lyon": "olympique_lyon",
  "bologna": "bologna_fc_1909",
  "betis": "real_betis_balompi",
  "feyenoord": "feyenoord_rotterdam",
  "celta": "celta_de_vigo",
  "salzburg": "red_bull_salzburg",
  "celtic": "celtic_fc",
  "rangers": "rangers_fc",
  "red star": "red_star_belgrade",
  "paok": "paok_thessaloniki",
  "dinamo": "gnk_dinamo_zagreb",
  "young boys": "bsc_young_boys",
  "basel": "basel_1893",
  "viktoria": "viktoria_plzen",
  "sturm": "sturm_graz",
  "ludogorets": "ludogorets_razgrad",
  "maccabi": "maccabi_tel_aviv",
  "go ahead": "go_ahead_eagles",
  "malmo": "malm_ff",
  "shakhtar": "shakhtar_donetsk",
  "az alkmaar": "az_alkmaar",
  "mainz": "1fsv_mainz_05",
  "rayo": "rayo_vallecano",
  "dynamo": "dynamo_kyiv",
  "sparta": "sparta_prague",
  "aek": "aek_athens",
  "lech": "lech_poznan",
  "rapid": "rapid_vienna",
  "rakow": "rakw_czstochowa",
  "jagiellonia": "jagiellonia_bialystok",
  "rijeka": "hnk_rijeka",
  "craiova": "universitatea_craiova",
  "slovan": "slovan_bratislava",
  "lausanne": "lausannesport",
  "sigma": "sigma_olomouc",
  "legia": "legia_warszawa",
  "hacken": "bk_hcken",
  "omonia": "omonia_nicosia",
  "aberdeen": "aberdeen_fc",
  "noah": "noah_yerevan",
  "zrinjski": "hsk_zrinjski_mostar",
  "shkendija": "shkendija_tetovo",
  "shamrock": "shamrock_rovers",
  "kuopio": "kuopion_palloseura",
  "hamrun": "hamrun_spartans",
  "shelbourne": "shelbourne_fc",
  "breidablik": "breidablik_kpavogur",
  "lincoln": "lincoln_red_imps_fc",
  "lille": "losc_lille",
  "nice": "ogc_nice",
  "fiorentina": "acf_fiorentina",
  "strasbourg": "strasbourg_alsace",
  "samsunspor": "samsunspor",
  "ferencvaros": "ferencvrosi_tc",
  "crystal palace": "crystal_palace",
  "panathinaikos": "panathinaikos",
  "go ahead eagles": "go_ahead_eagles",
  "fcsb": "fcsb",
  "utrecht": "utrecht",
  "freiburg": "freiburg",
  "braga": "braga",
  "qarabag": "qaraba_fk",
  "karabağ": "qaraba_fk",
  "karabag": "qaraba_fk",
  "pafos": "pafos_fc",
  "kairat": "kairat_almaty",
  "roma": "roma",
  "monaco": "monaco",
  "slavia": "slavia_prague",
  "union": "union_saintgilloise",
  "brann": "brann",
  "lincoln red imps": "lincoln_red_imps_fc",
  "chelsea fc": "chelsea_fc",
  "tottenham hotspur": "tottenham_hotspur",
  "newcastle united": "newcastle_united",
  "borussia dortmund": "borussia_dortmund",
  "sporting cp": "sporting_cp",
  "bayer 04 leverkusen": "bayer_04_leverkusen",
  "atalanta bc": "atalanta_bc",
  "ssc napoli": "ssc_napoli",
  "as monaco": "monaco",
  "monaco": "monaco",
  "eintracht frankfurt": "eintracht_frankfurt",
  "olympique marseille": "olympique_marseille",
  "sl benfica": "sl_benfica",
  "psv eindhoven": "psv_eindhoven",
  "villarreal cf": "villarreal_cf",
  "athletic bilbao": "athletic_bilbao",
  "club brugge kv": "club_brugge_kv",
  "ajax amsterdam": "ajax_amsterdam",
  "olympiacos piraeus": "olympiacos_piraeus",
  "union saintgilloise": "union_saintgilloise",
  "sk slavia prague": "slavia_prague",
  "slavia prague": "slavia_prague",
  "fk bodglimt": "bodglimt",
  "bodglimt": "bodglimt",
  "fc copenhagen": "copenhagen",
  "copenhagen": "copenhagen",
  "qaraba fk": "qaraba_fk",
  "pafos fc": "pafos_fc",
  "kairat almaty": "kairat_almaty",
  "nottingham forest": "nottingham_forest",
  "aston villa": "aston_villa",
  "as roma": "roma",
  "roma": "roma",
  "fc porto": "porto",
  "porto": "porto",
  "vfb stuttgart": "vfb_stuttgart",
  "olympique lyon": "olympique_lyon",
  "losc lille": "losc_lille",
  "lille": "losc_lille",
  "bologna fc 1909": "bologna_fc_1909",
  "real betis balompi": "real_betis_balompi",
  "sc freiburg": "freiburg",
  "freiburg": "freiburg",
  "feyenoord rotterdam": "feyenoord_rotterdam",
  "celta de vigo": "celta_de_vigo",
  "sc braga": "braga",
  "braga": "braga",
  "ogc nice": "ogc_nice",
  "nice": "ogc_nice",
  "red bull salzburg": "red_bull_salzburg",
  "celtic fc": "celtic_fc",
  "krc genk": "krc_genk",
  "genk": "krc_genk",
  "rangers fc": "rangers_fc",
  "red star belgrade": "red_star_belgrade",
  "fc midtjylland": "midtjylland",
  "midtjylland": "midtjylland",
  "paok thessaloniki": "paok_thessaloniki",
  "fc utrecht": "utrecht",
  "utrecht": "utrecht",
  "panathinaikos": "panathinaikos",
  "gnk dinamo zagreb": "gnk_dinamo_zagreb",
  "dinamo zagreb": "gnk_dinamo_zagreb",
  "bsc young boys": "bsc_young_boys",
  "young boys": "bsc_young_boys",
  "fc basel 1893": "basel_1893",
  "basel 1893": "basel_1893",
  "fc viktoria plzen": "viktoria_plzen",
  "viktoria plzen": "viktoria_plzen",
  "sk sturm graz": "sturm_graz",
  "sturm graz": "sturm_graz",
  "ferencvrosi tc": "ferencvrosi_tc",
  "ludogorets razgrad": "ludogorets_razgrad",
  "maccabi tel aviv": "maccabi_tel_aviv",
  "go ahead eagles": "go_ahead_eagles",
  "fcsb": "fcsb",
  "malm ff": "malm_ff",
  "sk brann": "brann",
  "brann": "brann",
  "crystal palace": "crystal_palace",
  "rc strasbourg alsace": "strasbourg_alsace",
  "strasbourg alsace": "strasbourg_alsace",
  "acf fiorentina": "acf_fiorentina",
  "fiorentina": "acf_fiorentina",
  "shakhtar donetsk": "shakhtar_donetsk",
  "az alkmaar": "az_alkmaar",
  "1fsv mainz 05": "1fsv_mainz_05",
  "rayo vallecano": "rayo_vallecano",
  "dynamo kyiv": "dynamo_kyiv",
  "ac sparta prague": "sparta_prague",
  "sparta prague": "sparta_prague",
  "aek athens": "aek_athens",
  "samsunspor": "samsunspor",
  "lech poznan": "lech_poznan",
  "rapid vienna": "rapid_vienna",
  "rakw czstochowa": "rakw_czstochowa",
  "jagiellonia bialystok": "jagiellonia_bialystok",
  "hnk rijeka": "hnk_rijeka",
  "universitatea craiova": "universitatea_craiova",
  "slovan bratislava": "slovan_bratislava",
  "fc lausannesport": "lausannesport",
  "lausannesport": "lausannesport",
  "sk sigma olomouc": "sigma_olomouc",
  "sigma olomouc": "sigma_olomouc",
  "legia warszawa": "legia_warszawa",
  "bk hcken": "bk_hcken",
  "omonia nicosia": "omonia_nicosia",
  "aberdeen fc": "aberdeen_fc",
  "aek larnaca": "aek_larnaca",
  "fc noah yerevan": "noah_yerevan",
  "noah yerevan": "noah_yerevan",
  "nk celje": "nk_celje",
  "celje": "nk_celje",
  "hsk zrinjski mostar": "hsk_zrinjski_mostar",
  "zrinjski mostar": "hsk_zrinjski_mostar",
  "fc drita": "drita",
  "drita": "drita",
  "shkendija tetovo": "shkendija_tetovo",
  "shamrock rovers": "shamrock_rovers",
  "kuopion palloseura": "kuopion_palloseura",
  "hamrun spartans": "hamrun_spartans",
  "shelbourne fc": "shelbourne_fc",
  "breidablik kpavogur": "breidablik_kpavogur",
  "lincoln red imps fc": "lincoln_red_imps_fc",
};

function getSquad(teamName) {
  let key = teamName.toLowerCase().trim().replace(/^(fc|sc|ac|ss) /, '').replace(/ (fc|sc|ac|ss)$/, '').replace(/çaykur /, '').replace(/fk$/,'').trim();
  if (NAME_MAP[key]) key = NAME_MAP[key];
  return SQUADS[key] || null;
}

function getRandomPlayer(squad, position, allowSubs = true) {
  const pool = [...squad.starting, ...(allowSubs ? squad.subs : [])];
  if (position) {
    const filtered = pool.filter(p => p.pos === position);
    if (filtered.length > 0) return filtered[Math.floor(Math.random() * filtered.length)].name;
  }
  return pool[Math.floor(Math.random() * pool.length)].name;
}

module.exports = { SQUADS, getSquad, getRandomPlayer };
