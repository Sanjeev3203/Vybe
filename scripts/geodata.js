// ─── INDIA CITY DATABASE ───
// Complete state → cities mapping
// Source baseline: Census 2011 + urban agglomerations + satellite towns
// This is the "seed" database that ML will expand from user signals

const INDIA_GEO_DB = {
  "Andhra Pradesh": {
    capital: "Amaravati",
    cities: [
      "Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry",
      "Kakinada","Tirupati","Anantapur","Vizianagaram","Eluru","Ongole",
      "Nandyal","Machilipatnam","Adoni","Amaravati","Tenali","Proddatur",
      "Chittoor","Hindupur","Bhimavaram","Madanapalle","Guntakal","Dharmavaram",
      "Gudivada","Narasaraopet","Tadipatri","Tadepalligudem","Chilakaluripet"
    ]
  },
  "Arunachal Pradesh": {
    capital: "Itanagar",
    cities: ["Itanagar","Naharlagun","Pasighat","Namsai","Tawang","Ziro","Along","Bomdila"]
  },
  "Assam": {
    capital: "Dispur",
    cities: [
      "Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur",
      "Bongaigaon","Karimganj","Sivasagar","Goalpara","Diphu","North Lakhimpur",
      "Dispur","Dhubri","Kokrajhar","Haflong","Mangaldoi"
    ]
  },
  "Bihar": {
    capital: "Patna",
    cities: [
      "Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif",
      "Arrah","Begusarai","Katihar","Munger","Chhapra","Danapur","Saharsa",
      "Sasaram","Hajipur","Dehri","Siwan","Motihari","Nawada","Bagaha",
      "Buxar","Kishanganj","Sitamarhi","Jamalpur","Jehanabad","Aurangabad Bihar"
    ]
  },
  "Chhattisgarh": {
    capital: "Raipur",
    cities: [
      "Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur",
      "Raigarh","Ambikapur","Mahasamund","Dhamtari","Chirmiri","Bhatapara","Dongargarh"
    ]
  },
  "Goa": {
    capital: "Panaji",
    cities: ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Canacona"]
  },
  "Gujarat": {
    capital: "Gandhinagar",
    cities: [
      "Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh",
      "Gandhinagar","Anand","Nadiad","Morbi","Mehsana","Surendranagar","Bharuch",
      "Vapi","Navsari","Ankleshwar","Porbandar","Godhra","Palanpur","Dahod",
      "Botad","Amreli","Veraval","Gandhidham","Adipur","Bhuj","Gondal","Jetpur"
    ]
  },
  "Haryana": {
    capital: "Chandigarh",
    cities: [
      "Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar",
      "Karnal","Sonipat","Panchkula","Bhiwani","Sirsa","Bahadurgarh","Jind",
      "Thanesar","Kaithal","Palwal","Rewari","Mahendragarh","Fatehabad","Gurugram","Manesar"
    ]
  },
  "Himachal Pradesh": {
    capital: "Shimla",
    cities: ["Shimla","Dharamsala","Solan","Mandi","Palampur","Baddi","Nahan","Kullu","Manali","Una","Hamirpur","Bilaspur HP","Chamba","Kangra"]
  },
  "Jharkhand": {
    capital: "Ranchi",
    cities: [
      "Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Phusro","Hazaribagh",
      "Giridih","Ramgarh","Medininagar","Chirkunda","Chaibasa","Dumka","Adityapur"
    ]
  },
  "Karnataka": {
    capital: "Bengaluru",
    cities: [
      "Bengaluru","Mysuru","Hubballi","Mangaluru","Belagavi","Kalaburagi","Ballari",
      "Vijayapura","Shivamogga","Tumkur","Davanagere","Bidar","Udupi","Hospet",
      "Hassan","Gadag","Dharwad","Raichur","Chitradurga","Bijapur","Chikmagalur",
      "Yadgir","Koppal","Bagalkot","Haveri","Madikeri","Mandya","Ramanagara",
      "Chikkaballapur","Kolar","Bangalore Rural","Anekal","Whitefield","Electronic City"
    ]
  },
  "Kerala": {
    capital: "Thiruvananthapuram",
    cities: [
      "Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad",
      "Alappuzha","Malappuram","Kannur","Kottayam","Kasaragod","Punalur","Vatakara",
      "Kanhangad","Taliparamba","Irinjalakuda","Payyanur","Guruvayur","Perinthalmanna",
      "Manjeri","Thodupuzha","Chalakudy","Changanassery","Kayamkulam","Neyyattinkara",
      "Ernakulam","Aluva","Thrippunithura","Perumbavoor","Angamaly","Nedumbassery"
    ]
  },
  "Madhya Pradesh": {
    capital: "Bhopal",
    cities: [
      "Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna",
      "Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind",
      "Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur","Damoh","Mandsaur",
      "Khargone","Neemuch","Pithampur","Hoshangabad","Itarsi","Sehore","Mhow"
    ]
  },
  "Maharashtra": {
    capital: "Mumbai",
    cities: [
      "Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Amravati",
      "Navi Mumbai","Kolhapur","Akola","Latur","Dhule","Ahmednagar","Chandrapur",
      "Parbhani","Jalgaon","Bhusawal","Bid","Nanded","Sangli","Satara","Barshi",
      "Yavatmal","Achalpur","Osmanabad","Nandurbar","Wardha","Washim","Buldhana",
      "Vasai-Virar","Mira-Bhayandar","Bhiwandi","Badlapur","Ambarnath","Panvel",
      "Kalyan","Dombivli","Ulhasnagar","Malegaon","Shimla MH","Lonavala","Malad"
    ]
  },
  "Manipur": {
    capital: "Imphal",
    cities: ["Imphal","Thoubal","Bishnupur","Churachandpur","Senapati","Ukhrul","Kakching"]
  },
  "Meghalaya": {
    capital: "Shillong",
    cities: ["Shillong","Tura","Nongstoin","Jowai","Baghmara","Williamnagar"]
  },
  "Mizoram": {
    capital: "Aizawl",
    cities: ["Aizawl","Lunglei","Champhai","Serchhip","Kolasib","Lawngtlai"]
  },
  "Nagaland": {
    capital: "Kohima",
    cities: ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Mon"]
  },
  "Odisha": {
    capital: "Bhubaneswar",
    cities: [
      "Bhubaneswar","Cuttack","Rourkela","Brahmapur","Sambalpur","Puri","Balasore",
      "Bhadrak","Baripada","Jharsuguda","Jeypore","Bargarh","Paradip","Phulbani",
      "Rayagada","Dhenkanal","Barbil","Koraput","Kendujhar","Kendrapara","Boudh"
    ]
  },
  "Punjab": {
    capital: "Chandigarh",
    cities: [
      "Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Pathankot","Hoshiarpur",
      "Mohali","Batala","Firozpur","Kapurthala","Fatehgarh Sahib","Gurdaspur",
      "Moga","Muktsar","Barnala","Mansa","Fazilka","Rupnagar","Nawanshahr"
    ]
  },
  "Rajasthan": {
    capital: "Jaipur",
    cities: [
      "Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar",
      "Bharatpur","Sikar","Sri Ganganagar","Pali","Barmer","Tonk","Chittorgarh",
      "Jhunjhunu","Banswara","Baran","Jhalawar","Bundi","Dholpur","Dausa",
      "Nagaur","Jalore","Sirohi","Rajsamand","Sawai Madhopur","Hanumangarh","Mount Abu"
    ]
  },
  "Sikkim": {
    capital: "Gangtok",
    cities: ["Gangtok","Namchi","Mangan","Gyalshing","Rangpo"]
  },
  "Tamil Nadu": {
    capital: "Chennai",
    cities: [
      "Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli",
      "Tiruppur","Vellore","Erode","Thoothukkudi","Dindigul","Thanjavur",
      "Ranipet","Sivakasi","Karur","Udhagamandalam","Hosur","Nagercoil",
      "Kumbakonam","Kanchipuram","Cuddalore","Ambattur","Avadi","Tambaram",
      "Tiruvottiyur","Pallavaram","Alandur","Chromepet","Porur","Perambur",
      "Sholinganallur","Adyar","Velachery","T Nagar","Anna Nagar","Egmore",
      "Perungudi","OMR","ECR","Kelambakkam","Maraimalai Nagar","Chengalpattu",
      "Villupuram","Perambalur","Ariyalur","Kallakurichi","Krishnagiri","Dharmapuri",
      "Namakkal","Tiruvannamalai","Pudukkottai","Sivaganga","Ramanathapuram",
      "Virudhunagar","Tenkasi","Tirupattur","Ranipet","Kanyakumari"
    ]
  },
  "Telangana": {
    capital: "Hyderabad",
    cities: [
      "Hyderabad","Warangal","Nizamabad","Karimnagar","Ramagundam","Khammam",
      "Mahbubnagar","Mancherial","Adilabad","Suryapet","Miryalaguda","Jagtial",
      "Nalgonda","Bhongir","Secunderabad","Cyberabad","Gachibowli","HITEC City",
      "Kondapur","Kukatpally","Miyapur","Ameerpet","Begumpet","LB Nagar",
      "Uppal","Dilsukhnagar","Tolichowki","Madhapur","Banjara Hills","Jubilee Hills"
    ]
  },
  "Tripura": {
    capital: "Agartala",
    cities: ["Agartala","Dharmanagar","Udaipur Tripura","Kailashahar","Belonia","Sabroom"]
  },
  "Uttar Pradesh": {
    capital: "Lucknow",
    cities: [
      "Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Prayagraj","Allahabad",
      "Bareilly","Aligarh","Moradabad","Saharanpur","Gorakhpur","Noida","Firozabad",
      "Jhansi","Mathura","Muzaffarnagar","Shahjahanpur","Rampur","Shivaji Nagar",
      "Gonda","Amroha","Hapur","Etawah","Mirzapur","Bulandshahr","Sambhal","Faizabad",
      "Fatehpur","Raebareli","Orai","Sitapur","Bahraich","Modinagar","Unnao",
      "Jaunpur","Lakhimpur","Hathras","Banda","Pilibhit","Barabanki","Hardoi",
      "Azamgarh","Ambedkar Nagar","Greater Noida","Vrindavan","Mathura Vrindavan"
    ]
  },
  "Uttarakhand": {
    capital: "Dehradun",
    cities: [
      "Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh",
      "Kotdwar","Ramnagar","Pithoragarh","Almora","Nainital","Mussoorie","Pauri","Uttarkashi"
    ]
  },
  "West Bengal": {
    capital: "Kolkata",
    cities: [
      "Kolkata","Asansol","Siliguri","Durgapur","Bardhaman","Malda","Baharampur",
      "Habra","Kharagpur","Shantipur","Dankuni","Dhulian","Ranaghat","Haldia",
      "Raiganj","Krishnanagar","Nabadwip","Medinipur","Jalpaiguri","Balurghat",
      "Basirhat","Bankura","Chakdaha","Darjeeling","Alipurduar","Cooch Behar",
      "Salt Lake","New Town","Rajarhat","Howrah","Serampore","Barrackpore"
    ]
  },
  "Delhi": {
    capital: "New Delhi",
    cities: [
      "New Delhi","Central Delhi","North Delhi","South Delhi","East Delhi","West Delhi",
      "North West Delhi","South West Delhi","Dwarka","Rohini","Janakpuri","Karol Bagh",
      "Lajpat Nagar","Connaught Place","Saket","Vasant Kunj","Nehru Place","Noida Extension",
      "Shahdara","Pitampura","Preet Vihar","Mayur Vihar","Dilshad Garden"
    ]
  },
  "Jammu & Kashmir": {
    capital: "Srinagar",
    cities: ["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Udhampur","Kathua","Poonch","Rajouri","Kupwara"]
  },
  "Ladakh": {
    capital: "Leh",
    cities: ["Leh","Kargil","Diskit","Nubra","Zanskar"]
  },
  "Chandigarh": {
    capital: "Chandigarh",
    cities: ["Chandigarh","Sector 17","Sector 22","Manimajra","Industrial Area","IT Park"]
  },
  "Puducherry": {
    capital: "Puducherry",
    cities: ["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur"]
  },
  "Andaman & Nicobar": {
    capital: "Port Blair",
    cities: ["Port Blair","Diglipur","Rangat","Mayabunder","Car Nicobar"]
  },
  "Dadra & Nagar Haveli and Daman & Diu": {
    capital: "Daman",
    cities: ["Daman","Diu","Silvassa","Amli","Naroli"]
  },
  "Lakshadweep": {
    capital: "Kavaratti",
    cities: ["Kavaratti","Agatti","Minicoy","Androth","Amini"]
  }
};

// ─── FLAT SEARCH INDEX ───
// Built at init time for O(1) fuzzy search
// Each entry: { city, state, display }
const CITY_SEARCH_INDEX = [];

(function buildIndex() {
  for (const [state, data] of Object.entries(INDIA_GEO_DB)) {
    for (const city of data.cities) {
      CITY_SEARCH_INDEX.push({
        city,
        state,
        display: `${city}, ${state}`,
        searchKey: `${city} ${state}`.toLowerCase()
      });
    }
  }
  // Sort alphabetically by city
  CITY_SEARCH_INDEX.sort((a, b) => a.city.localeCompare(b.city));
})();

// ─── FUZZY SEARCH ENGINE ───
function searchCities(query, limit = 8) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();

  const results = CITY_SEARCH_INDEX.filter(entry => {
    return entry.searchKey.includes(q) ||
      entry.city.toLowerCase().startsWith(q) ||
      entry.state.toLowerCase().includes(q);
  });

  // Score: exact start match > contains match
  results.sort((a, b) => {
    const aStart = a.city.toLowerCase().startsWith(q) ? 0 : 1;
    const bStart = b.city.toLowerCase().startsWith(q) ? 0 : 1;
    return aStart - bStart || a.city.localeCompare(b.city);
  });

  return results.slice(0, limit);
}

// ─── CITIES BY STATE ───
function getCitiesByState(state) {
  return INDIA_GEO_DB[state]?.cities || [];
}

const ALL_STATES = Object.keys(INDIA_GEO_DB).sort();
