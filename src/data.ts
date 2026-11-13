// Menu data: types plus every cuisine, category and item shown on the site.

type Cuisine = "chinese" | "indian" | "nepalese" | "vietnamese" | "bangladeshi";
type Category = "dish" | "microwave" | "drink";
type Tag = "V" | "VG" | "Spicy" | "Nuts" | "Fish" | "Caffeine";

interface MenuItem {
  id: string;
  name: string;
  /** Name in the dish's own language/script, shown under the English name. */
  nativeName?: string;
  description: string;
  price: number;
  cuisine: Cuisine;
  category: Category;
  emoji: string;
  tags: Tag[];
  /** Only for microwave meals: minutes to heat from chilled. */
  microwaveMinutes?: number;
}

interface CuisineInfo {
  id: Cuisine;
  name: string;
  flag: string;
  blurb: string;
}

const CUISINES: CuisineInfo[] = [
  {
    id: "chinese",
    name: "Chinese",
    flag: "🇨🇳",
    blurb: "Sichuan heat, Cantonese roasts and dumplings, with fragrant teas.",
  },
  {
    id: "indian",
    name: "Indian",
    flag: "🇮🇳",
    blurb: "Rich North Indian curries, South Indian dosa and spiced chai.",
  },
  {
    id: "nepalese",
    name: "Nepalese",
    flag: "🇳🇵",
    blurb: "Himalayan comfort food: momo, dal bhat and warming milk tea.",
  },
  {
    id: "vietnamese",
    name: "Vietnamese",
    flag: "🇻🇳",
    blurb: "Fresh herbs, slow-simmered broths and strong iced coffee.",
  },
  {
    id: "bangladeshi",
    name: "Bangladeshi",
    flag: "🇧🇩",
    blurb: "Fragrant biryani, mustard fish, bhorta and Sylheti tea.",
  },
];

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "dish", label: "Dishes", icon: "🍽️" },
  { id: "microwave", label: "Microwave meals", icon: "⏱️" },
  { id: "drink", label: "Drinks & teas", icon: "🍵" },
];

const MENU: MenuItem[] = [
  // ───────────── Chinese ─────────────
  {
    id: "cn-kung-pao", cuisine: "chinese", category: "dish", emoji: "🌶️",
    name: "Kung Pao Chicken", nativeName: "宫保鸡丁",
    description: "Wok-fried chicken with peanuts, dried chillies and Sichuan pepper.",
    price: 8.95, tags: ["Spicy", "Nuts"],
  },
  {
    id: "cn-mapo-tofu", cuisine: "chinese", category: "dish", emoji: "🥘",
    name: "Mapo Tofu", nativeName: "麻婆豆腐",
    description: "Silken tofu in a numbing, chilli bean sauce. Vegan version with mushrooms.",
    price: 7.95, tags: ["VG", "Spicy"],
  },
  {
    id: "cn-char-siu", cuisine: "chinese", category: "dish", emoji: "🍖",
    name: "Char Siu Pork with Rice", nativeName: "叉烧饭",
    description: "Cantonese honey-glazed roast pork, steamed rice and pak choi.",
    price: 9.50, tags: [],
  },
  {
    id: "cn-xiaolongbao", cuisine: "chinese", category: "dish", emoji: "🥟",
    name: "Xiaolongbao (6)", nativeName: "小笼包",
    description: "Shanghai soup dumplings filled with pork and rich broth, with black vinegar.",
    price: 7.50, tags: [],
  },
  {
    id: "cn-chow-mein", cuisine: "chinese", category: "dish", emoji: "🍜",
    name: "Beef Chow Mein", nativeName: "牛肉炒面",
    description: "Egg noodles stir-fried with beef, beansprouts and spring onion.",
    price: 8.95, tags: [],
  },
  {
    id: "cn-spring-rolls", cuisine: "chinese", category: "dish", emoji: "🥢",
    name: "Vegetable Spring Rolls (4)", nativeName: "春卷",
    description: "Crispy rolls of cabbage, carrot and glass noodles with sweet chilli dip.",
    price: 4.50, tags: ["VG"],
  },
  {
    id: "cn-mw-sweet-sour", cuisine: "chinese", category: "microwave", emoji: "🍱",
    name: "Sweet & Sour Chicken with Egg Fried Rice",
    description: "Classic takeaway favourite in a ready-to-heat tray.",
    price: 4.95, tags: [], microwaveMinutes: 5,
  },
  {
    id: "cn-mw-chow-mein", cuisine: "chinese", category: "microwave", emoji: "🍝",
    name: "Chicken Chow Mein",
    description: "Noodles with chicken, peppers and soy. Stir halfway through heating.",
    price: 4.50, tags: [], microwaveMinutes: 4,
  },
  {
    id: "cn-mw-dumplings", cuisine: "chinese", category: "microwave", emoji: "🥟",
    name: "Steam Pack Veg Dumplings (10)",
    description: "Pak choi and shiitake dumplings that steam in their own bag.",
    price: 3.95, tags: ["VG"], microwaveMinutes: 3,
  },
  {
    id: "cn-jasmine", cuisine: "chinese", category: "drink", emoji: "🍵",
    name: "Jasmine Green Tea", nativeName: "茉莉花茶",
    description: "Green tea scented with jasmine blossoms. Pot for one.",
    price: 2.50, tags: ["VG", "Caffeine"],
  },
  {
    id: "cn-oolong", cuisine: "chinese", category: "drink", emoji: "🫖",
    name: "Tieguanyin Oolong", nativeName: "铁观音",
    description: "Floral, lightly roasted oolong from Fujian.",
    price: 2.95, tags: ["VG", "Caffeine"],
  },
  {
    id: "cn-puerh", cuisine: "chinese", category: "drink", emoji: "🍂",
    name: "Pu-erh Tea", nativeName: "普洱茶",
    description: "Earthy aged tea from Yunnan, traditionally served after a heavy meal.",
    price: 2.95, tags: ["VG", "Caffeine"],
  },
  {
    id: "cn-soy-milk", cuisine: "chinese", category: "drink", emoji: "🥛",
    name: "Fresh Soy Milk", nativeName: "豆浆",
    description: "Lightly sweetened, served warm or chilled.",
    price: 2.20, tags: ["VG"],
  },

  // ───────────── Indian ─────────────
  {
    id: "in-butter-chicken", cuisine: "indian", category: "dish", emoji: "🍛",
    name: "Butter Chicken", nativeName: "मुर्ग़ मखनी",
    description: "Tandoori chicken in a silky tomato, butter and cream sauce.",
    price: 9.95, tags: [],
  },
  {
    id: "in-rogan-josh", cuisine: "indian", category: "dish", emoji: "🍲",
    name: "Lamb Rogan Josh", nativeName: "रोगन जोश",
    description: "Kashmiri slow-cooked lamb with Kashmiri chilli and fennel.",
    price: 10.95, tags: ["Spicy"],
  },
  {
    id: "in-chana-masala", cuisine: "indian", category: "dish", emoji: "🫘",
    name: "Chana Masala", nativeName: "चना मसाला",
    description: "Punjabi chickpea curry with tomato, ginger and garam masala.",
    price: 7.50, tags: ["VG"],
  },
  {
    id: "in-palak-paneer", cuisine: "indian", category: "dish", emoji: "🥬",
    name: "Palak Paneer", nativeName: "पालक पनीर",
    description: "Cubes of paneer cheese in a smooth spiced spinach sauce.",
    price: 8.50, tags: ["V"],
  },
  {
    id: "in-masala-dosa", cuisine: "indian", category: "dish", emoji: "🫓",
    name: "Masala Dosa", nativeName: "மசாலா தோசை",
    description: "Crisp South Indian rice crêpe with potato masala, sambar and chutney.",
    price: 8.25, tags: ["VG"],
  },
  {
    id: "in-samosa", cuisine: "indian", category: "dish", emoji: "🥟",
    name: "Vegetable Samosas (3)", nativeName: "समोसा",
    description: "Pastry filled with spiced potato and peas, with tamarind chutney.",
    price: 4.25, tags: ["VG"],
  },
  {
    id: "in-mw-tikka", cuisine: "indian", category: "microwave", emoji: "🍱",
    name: "Chicken Tikka Masala with Pilau Rice",
    description: "Creamy tikka masala and fragrant rice in a two-part tray.",
    price: 4.95, tags: [], microwaveMinutes: 5,
  },
  {
    id: "in-mw-dal-makhani", cuisine: "indian", category: "microwave", emoji: "🍛",
    name: "Dal Makhani with Jeera Rice",
    description: "Slow-cooked black lentils with butter and cumin rice.",
    price: 4.25, tags: ["V"], microwaveMinutes: 4,
  },
  {
    id: "in-mw-biryani", cuisine: "indian", category: "microwave", emoji: "🍚",
    name: "Vegetable Biryani",
    description: "Basmati rice layered with spiced vegetables and fried onions.",
    price: 4.50, tags: ["VG"], microwaveMinutes: 4,
  },
  {
    id: "in-masala-chai", cuisine: "indian", category: "drink", emoji: "☕",
    name: "Masala Chai", nativeName: "मसाला चाय",
    description: "Assam tea boiled with milk, cardamom, ginger and cinnamon.",
    price: 2.50, tags: ["V", "Caffeine"],
  },
  {
    id: "in-mango-lassi", cuisine: "indian", category: "drink", emoji: "🥭",
    name: "Mango Lassi", nativeName: "आम लस्सी",
    description: "Alphonso mango blended with yoghurt.",
    price: 3.25, tags: ["V"],
  },
  {
    id: "in-salt-lassi", cuisine: "indian", category: "drink", emoji: "🥛",
    name: "Salted Lassi", nativeName: "नमकीन लस्सी",
    description: "Cooling yoghurt drink with roasted cumin and mint.",
    price: 2.95, tags: ["V"],
  },
  {
    id: "in-nimbu-pani", cuisine: "indian", category: "drink", emoji: "🍋",
    name: "Nimbu Pani", nativeName: "नींबू पानी",
    description: "Fresh lime water with black salt and a little sugar.",
    price: 2.25, tags: ["VG"],
  },

  // ───────────── Nepalese ─────────────
  {
    id: "np-chicken-momo", cuisine: "nepalese", category: "dish", emoji: "🥟",
    name: "Chicken Momo (8)", nativeName: "मम",
    description: "Steamed dumplings with spiced chicken and a tomato-sesame achar.",
    price: 8.50, tags: [],
  },
  {
    id: "np-veg-momo", cuisine: "nepalese", category: "dish", emoji: "🥟",
    name: "Vegetable Momo (8)", nativeName: "तरकारी मम",
    description: "Cabbage, carrot and tofu momo with tomato achar.",
    price: 7.50, tags: ["VG"],
  },
  {
    id: "np-dal-bhat", cuisine: "nepalese", category: "dish", emoji: "🍛",
    name: "Dal Bhat Tarkari", nativeName: "दाल भात तरकारी",
    description: "The national meal: lentil soup, rice, seasonal veg curry and pickle.",
    price: 9.25, tags: ["VG"],
  },
  {
    id: "np-thukpa", cuisine: "nepalese", category: "dish", emoji: "🍜",
    name: "Chicken Thukpa", nativeName: "थुक्पा",
    description: "Himalayan noodle soup with chicken, vegetables and timur pepper.",
    price: 8.95, tags: ["Spicy"],
  },
  {
    id: "np-choila", cuisine: "nepalese", category: "dish", emoji: "🔥",
    name: "Chicken Choila", nativeName: "छोयला",
    description: "Newari-style flame-grilled chicken tossed in mustard oil and chilli.",
    price: 8.75, tags: ["Spicy"],
  },
  {
    id: "np-aloo-tama", cuisine: "nepalese", category: "dish", emoji: "🥔",
    name: "Aloo Tama", nativeName: "आलु तामा",
    description: "Tangy curry of potato, fermented bamboo shoots and black-eyed beans.",
    price: 7.75, tags: ["VG"],
  },
  {
    id: "np-sel-roti", cuisine: "nepalese", category: "dish", emoji: "🍩",
    name: "Sel Roti (3)", nativeName: "सेल रोटी",
    description: "Sweet ring-shaped rice bread, made for Tihar and Dashain.",
    price: 3.50, tags: ["VG"],
  },
  {
    id: "np-mw-dal-bhat", cuisine: "nepalese", category: "microwave", emoji: "🍱",
    name: "Dal Bhat Ready Meal",
    description: "Lentils, rice and mixed-veg tarkari in a three-part tray.",
    price: 4.50, tags: ["VG"], microwaveMinutes: 5,
  },
  {
    id: "np-mw-momo", cuisine: "nepalese", category: "microwave", emoji: "🥟",
    name: "Steam Pack Chicken Momo (10)",
    description: "Microwave-steam momo with a sachet of achar.",
    price: 4.75, tags: [], microwaveMinutes: 3,
  },
  {
    id: "np-mw-aloo-tama", cuisine: "nepalese", category: "microwave", emoji: "🍚",
    name: "Aloo Tama with Rice",
    description: "Bamboo-shoot and potato curry with steamed rice.",
    price: 4.25, tags: ["VG"], microwaveMinutes: 4,
  },
  {
    id: "np-chiya", cuisine: "nepalese", category: "drink", emoji: "☕",
    name: "Nepali Milk Tea", nativeName: "दूध चिया",
    description: "Black tea simmered with milk, sugar and cardamom.",
    price: 2.25, tags: ["V", "Caffeine"],
  },
  {
    id: "np-ilam", cuisine: "nepalese", category: "drink", emoji: "🍵",
    name: "Ilam Black Tea", nativeName: "इलाम चिया",
    description: "High-altitude tea from Ilam in eastern Nepal, served plain.",
    price: 2.50, tags: ["VG", "Caffeine"],
  },
  {
    id: "np-butter-tea", cuisine: "nepalese", category: "drink", emoji: "🧈",
    name: "Himalayan Butter Tea",
    description: "Salty Sherpa-style tea churned with butter, for cold days.",
    price: 2.95, tags: ["V", "Caffeine"],
  },

  // ───────────── Vietnamese ─────────────
  {
    id: "vn-pho-bo", cuisine: "vietnamese", category: "dish", emoji: "🍜",
    name: "Beef Pho", nativeName: "Phở bò",
    description: "Rice noodles in star-anise beef broth with herbs, lime and chilli.",
    price: 10.50, tags: [],
  },
  {
    id: "vn-banh-mi", cuisine: "vietnamese", category: "dish", emoji: "🥖",
    name: "Pork Banh Mi", nativeName: "Bánh mì thịt",
    description: "Crusty baguette with grilled pork, pâté, pickles and coriander.",
    price: 7.50, tags: [],
  },
  {
    id: "vn-goi-cuon", cuisine: "vietnamese", category: "dish", emoji: "🥬",
    name: "Fresh Summer Rolls (3)", nativeName: "Gỏi cuốn",
    description: "Rice-paper rolls with prawn, vermicelli and herbs, with peanut dip.",
    price: 5.95, tags: ["Fish", "Nuts"],
  },
  {
    id: "vn-bun-cha", cuisine: "vietnamese", category: "dish", emoji: "🥩",
    name: "Bun Cha", nativeName: "Bún chả",
    description: "Hanoi grilled pork patties, vermicelli and herbs with dipping sauce.",
    price: 9.95, tags: ["Fish"],
  },
  {
    id: "vn-com-tam", cuisine: "vietnamese", category: "dish", emoji: "🍚",
    name: "Lemongrass Tofu Broken Rice", nativeName: "Cơm tấm chay",
    description: "Saigon-style broken rice with lemongrass tofu and pickled veg.",
    price: 8.95, tags: ["VG"],
  },
  {
    id: "vn-bun-bo-hue", cuisine: "vietnamese", category: "dish", emoji: "🌶️",
    name: "Bun Bo Hue", nativeName: "Bún bò Huế",
    description: "Spicy lemongrass beef noodle soup from the city of Huế.",
    price: 10.95, tags: ["Spicy", "Fish"],
  },
  {
    id: "vn-mw-pho-ga", cuisine: "vietnamese", category: "microwave", emoji: "🍜",
    name: "Chicken Pho Bowl",
    description: "Broth, noodles and chicken in a microwavable bowl with herb sachet.",
    price: 4.75, tags: [], microwaveMinutes: 4,
  },
  {
    id: "vn-mw-ga-xao-sa", cuisine: "vietnamese", category: "microwave", emoji: "🍱",
    name: "Lemongrass Chilli Chicken with Rice",
    description: "Gà xào sả ớt: chicken stir-fried with lemongrass and chilli.",
    price: 4.95, tags: ["Spicy"], microwaveMinutes: 5,
  },
  {
    id: "vn-mw-thit-kho", cuisine: "vietnamese", category: "microwave", emoji: "🥚",
    name: "Caramelised Pork & Egg with Rice",
    description: "Thịt kho trứng: pork braised in coconut water, a home-cooking classic.",
    price: 4.95, tags: ["Fish"], microwaveMinutes: 5,
  },
  {
    id: "vn-ca-phe", cuisine: "vietnamese", category: "drink", emoji: "🧋",
    name: "Iced Coffee with Condensed Milk", nativeName: "Cà phê sữa đá",
    description: "Strong phin-dripped coffee over ice and sweet condensed milk.",
    price: 3.50, tags: ["V", "Caffeine"],
  },
  {
    id: "vn-tra-sen", cuisine: "vietnamese", category: "drink", emoji: "🪷",
    name: "Lotus Tea", nativeName: "Trà sen",
    description: "Green tea scented with lotus flowers, a Hanoi speciality.",
    price: 2.95, tags: ["VG", "Caffeine"],
  },
  {
    id: "vn-atiso", cuisine: "vietnamese", category: "drink", emoji: "🌿",
    name: "Artichoke Tea", nativeName: "Trà atiso",
    description: "Caffeine-free herbal tea from Đà Lạt, served hot or iced.",
    price: 2.50, tags: ["VG"],
  },
  {
    id: "vn-nuoc-mia", cuisine: "vietnamese", category: "drink", emoji: "🎋",
    name: "Sugarcane Juice", nativeName: "Nước mía",
    description: "Freshly pressed sugarcane with a squeeze of kumquat.",
    price: 3.25, tags: ["VG"],
  },

  // ───────────── Bangladeshi ─────────────
  {
    id: "bd-kacchi", cuisine: "bangladeshi", category: "dish", emoji: "🍚",
    name: "Kacchi Biryani", nativeName: "কাচ্চি বিরিয়ানি",
    description: "Dhaka-style mutton and potato biryani, slow-cooked with aromatic rice.",
    price: 11.95, tags: [],
  },
  {
    id: "bd-shorshe-ilish", cuisine: "bangladeshi", category: "dish", emoji: "🐟",
    name: "Shorshe Ilish", nativeName: "সর্ষে ইলিশ",
    description: "Hilsa, the national fish, in a pungent mustard and green chilli sauce.",
    price: 12.50, tags: ["Fish", "Spicy"],
  },
  {
    id: "bd-kala-bhuna", cuisine: "bangladeshi", category: "dish", emoji: "🍖",
    name: "Beef Kala Bhuna", nativeName: "কালা ভুনা",
    description: "Chattogram's dark, dry-fried beef curry, cooked for hours.",
    price: 10.95, tags: ["Spicy"],
  },
  {
    id: "bd-khichuri", cuisine: "bangladeshi", category: "dish", emoji: "🍲",
    name: "Bhuna Khichuri", nativeName: "ভুনা খিচুড়ি",
    description: "Rice and lentils fried with ghee and spices. A rainy-day favourite.",
    price: 7.95, tags: ["V"],
  },
  {
    id: "bd-begun-bhaja", cuisine: "bangladeshi", category: "dish", emoji: "🍆",
    name: "Begun Bhaja", nativeName: "বেগুন ভাজা",
    description: "Turmeric and chilli-rubbed aubergine slices, pan-fried.",
    price: 4.50, tags: ["VG"],
  },
  {
    id: "bd-fuchka", cuisine: "bangladeshi", category: "dish", emoji: "🫧",
    name: "Fuchka (8)", nativeName: "ফুচকা",
    description: "Crisp hollow puris with spiced chickpeas and tamarind water.",
    price: 5.25, tags: ["VG", "Spicy"],
  },
  {
    id: "bd-mw-chicken-bhuna", cuisine: "bangladeshi", category: "microwave", emoji: "🍱",
    name: "Chicken Bhuna with Rice",
    description: "Thick, onion-rich chicken curry with plain basmati.",
    price: 4.95, tags: ["Spicy"], microwaveMinutes: 5,
  },
  {
    id: "bd-mw-khichuri", cuisine: "bangladeshi", category: "microwave", emoji: "🥚",
    name: "Khichuri with Egg Curry",
    description: "Comforting rice-lentil khichuri with a boiled-egg curry.",
    price: 4.50, tags: ["V"], microwaveMinutes: 4,
  },
  {
    id: "bd-mw-bhorta", cuisine: "bangladeshi", category: "microwave", emoji: "🥔",
    name: "Aloo Bhorta & Dal with Rice", nativeName: "আলু ভর্তা",
    description: "Mashed potato with mustard oil and onion, plus masoor dal and rice.",
    price: 3.95, tags: ["VG"], microwaveMinutes: 4,
  },
  {
    id: "bd-doodh-cha", cuisine: "bangladeshi", category: "drink", emoji: "☕",
    name: "Doodh Cha", nativeName: "দুধ চা",
    description: "Sweet, strong milk tea, as served at every tea stall.",
    price: 2.25, tags: ["V", "Caffeine"],
  },
  {
    id: "bd-seven-layer", cuisine: "bangladeshi", category: "drink", emoji: "🌈",
    name: "Seven-Layer Tea", nativeName: "সাত রঙের চা",
    description: "Sylhet's famous layered tea, each layer a different flavour.",
    price: 3.95, tags: ["V", "Caffeine"],
  },
  {
    id: "bd-lebu-cha", cuisine: "bangladeshi", category: "drink", emoji: "🍋",
    name: "Lemon Tea", nativeName: "লেবু চা",
    description: "Black Sylheti tea with fresh lemon and a little sugar.",
    price: 2.25, tags: ["VG", "Caffeine"],
  },
  {
    id: "bd-borhani", cuisine: "bangladeshi", category: "drink", emoji: "🥛",
    name: "Borhani", nativeName: "বোরহানি",
    description: "Spiced yoghurt drink with mint and black salt, served with biryani.",
    price: 2.95, tags: ["V"],
  },
];
