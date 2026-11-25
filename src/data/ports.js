// Port suggestions for request forms (datalist). Users may type any port; this is not a coverage claim.
// Major commercial ports by region, "Port, Country".
export const PORT_SUGGESTIONS = [
  // East Asia
  'Shanghai, China', 'Ningbo-Zhoushan, China', 'Shenzhen, China', 'Qingdao, China', 'Guangzhou, China', 'Tianjin, China',
  'Xiamen, China', 'Dalian, China', 'Zhoushan, China', 'Hong Kong, China', 'Kaohsiung, Taiwan', 'Keelung, Taiwan',
  'Busan, South Korea', 'Ulsan, South Korea', 'Incheon, South Korea', 'Gwangyang, South Korea', 'Geoje, South Korea',
  'Tokyo, Japan', 'Yokohama, Japan', 'Kobe, Japan', 'Osaka, Japan', 'Nagoya, Japan', 'Imabari, Japan',
  // South-East Asia
  'Singapore, Singapore', 'Port Klang, Malaysia', 'Tanjung Pelepas, Malaysia', 'Penang, Malaysia', 'Jakarta (Tanjung Priok), Indonesia',
  'Surabaya, Indonesia', 'Batam, Indonesia', 'Laem Chabang, Thailand', 'Bangkok, Thailand', 'Ho Chi Minh City, Vietnam',
  'Cai Mep, Vietnam', 'Haiphong, Vietnam', 'Manila, Philippines', 'Subic Bay, Philippines',
  // South Asia & Middle East
  'Colombo, Sri Lanka', 'Mumbai, India', 'Nhava Sheva (JNPT), India', 'Mundra, India', 'Chennai, India', 'Kandla, India',
  'Visakhapatnam, India', 'Cochin, India', 'Chittagong, Bangladesh', 'Karachi, Pakistan', 'Jebel Ali (Dubai), UAE',
  'Fujairah, UAE', 'Khor Fakkan, UAE', 'Abu Dhabi (Khalifa), UAE', 'Dammam, Saudi Arabia', 'Jeddah, Saudi Arabia',
  'Ras Tanura, Saudi Arabia', 'Sohar, Oman', 'Salalah, Oman', 'Hamad, Qatar', 'Ras Laffan, Qatar', 'Shuwaikh, Kuwait',
  'Bandar Abbas, Iran', 'Basra (Umm Qasr), Iraq',
  // Red Sea, Suez, Mediterranean
  'Port Said, Egypt', 'Suez, Egypt', 'Alexandria, Egypt', 'Djibouti, Djibouti', 'Aqaba, Jordan', 'Haifa, Israel',
  'Piraeus, Greece', 'Thessaloniki, Greece', 'Istanbul, Türkiye', 'Tuzla, Türkiye', 'Izmit, Türkiye', 'Mersin, Türkiye',
  'Aliağa, Türkiye', 'Limassol, Cyprus', 'Malta (Valletta / Marsaxlokk), Malta', 'Genoa, Italy', 'La Spezia, Italy',
  'Trieste, Italy', 'Venice, Italy', 'Naples, Italy', 'Gioia Tauro, Italy', 'Augusta, Italy', 'Marseille-Fos, France',
  'Barcelona, Spain', 'Valencia, Spain', 'Algeciras, Spain', 'Gibraltar, Gibraltar', 'Tanger Med, Morocco',
  'Koper, Slovenia', 'Rijeka, Croatia', 'Constanța, Romania', 'Novorossiysk, Russia', 'Odesa, Ukraine', 'Batumi, Georgia',
  // North Europe
  'Rotterdam, Netherlands', 'Amsterdam, Netherlands', 'Antwerp-Bruges, Belgium', 'Ghent, Belgium', 'Hamburg, Germany',
  'Bremerhaven, Germany', 'Wilhelmshaven, Germany', 'Le Havre, France', 'Dunkirk, France', 'Brest, France',
  'Felixstowe, United Kingdom', 'Southampton, United Kingdom', 'London Gateway, United Kingdom', 'Liverpool, United Kingdom',
  'Immingham, United Kingdom', 'Aberdeen, United Kingdom', 'Dublin, Ireland', 'Gothenburg, Sweden', 'Copenhagen, Denmark',
  'Aarhus, Denmark', 'Skagen, Denmark', 'Oslo, Norway', 'Bergen, Norway', 'Stavanger, Norway', 'Gdańsk, Poland',
  'Gdynia, Poland', 'Klaipėda, Lithuania', 'Riga, Latvia', 'Tallinn (Muuga), Estonia', 'Helsinki, Finland',
  'St. Petersburg, Russia', 'Lisbon, Portugal', 'Sines, Portugal', 'Bilbao, Spain', 'Las Palmas, Spain',
  'Santa Cruz de Tenerife, Spain',
  // Africa
  'Durban, South Africa', 'Cape Town, South Africa', 'Port Elizabeth (Ngqura), South Africa', 'Richards Bay, South Africa',
  'Walvis Bay, Namibia', 'Luanda, Angola', 'Lagos (Apapa), Nigeria', 'Lomé, Togo', 'Tema, Ghana', 'Abidjan, Côte d\'Ivoire',
  'Dakar, Senegal', 'Mombasa, Kenya', 'Dar es Salaam, Tanzania', 'Port Louis, Mauritius',
  // North America
  'Houston, United States', 'New Orleans, United States', 'Corpus Christi, United States', 'Port Arthur, United States',
  'Mobile, United States', 'Tampa, United States', 'Miami, United States', 'Savannah, United States', 'Charleston, United States',
  'Norfolk, United States', 'Baltimore, United States', 'Philadelphia, United States', 'New York / New Jersey, United States',
  'Boston, United States', 'Los Angeles / Long Beach, United States', 'Oakland, United States', 'Seattle / Tacoma, United States',
  'Portland (Oregon), United States', 'Anchorage, United States', 'Honolulu, United States', 'Vancouver, Canada',
  'Prince Rupert, Canada', 'Montreal, Canada', 'Halifax, Canada', 'Manzanillo, Mexico', 'Veracruz, Mexico',
  'Lázaro Cárdenas, Mexico', 'Altamira, Mexico',
  // Central America & Caribbean
  'Balboa, Panama', 'Cristóbal / Colón, Panama', 'Manzanillo (Colón), Panama', 'Rodman, Panama', 'Puerto Limón, Costa Rica',
  'Kingston, Jamaica', 'Freeport, Bahamas', 'San Juan, Puerto Rico', 'Point Lisas, Trinidad and Tobago', 'Cartagena, Colombia',
  'Barranquilla, Colombia', 'Buenaventura, Colombia', 'Caucedo, Dominican Republic', 'Willemstad, Curaçao',
  // South America
  'Guayaquil, Ecuador', 'Posorja, Ecuador', 'Manta, Ecuador', 'Callao, Peru', 'Paita, Peru', 'Matarani, Peru',
  'Valparaíso, Chile', 'San Antonio, Chile', 'Antofagasta, Chile', 'Mejillones, Chile', 'Iquique, Chile', 'Talcahuano, Chile',
  'Punta Arenas, Chile', 'Santos, Brazil', 'Rio de Janeiro, Brazil', 'Paranaguá, Brazil', 'Itajaí, Brazil', 'Rio Grande, Brazil',
  'Suape, Brazil', 'Vitória, Brazil', 'Buenos Aires, Argentina', 'Bahía Blanca, Argentina', 'Montevideo, Uruguay',
  // Oceania
  'Sydney (Port Botany), Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Fremantle, Australia',
  'Port Hedland, Australia', 'Newcastle, Australia', 'Gladstone, Australia', 'Auckland, New Zealand', 'Tauranga, New Zealand',
  'Suva, Fiji', 'Nouméa, New Caledonia',
];
