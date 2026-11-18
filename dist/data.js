"use strict";
// Menu data: types plus every cuisine, category and item shown on the site.
const CUISINES = [
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
        id: "vietnamese",
        name: "Vietnamese",
        flag: "🇻🇳",
        blurb: "Fresh herbs, slow-simmered broths and strong iced coffee.",
    },
    {
        id: "indonesian",
        name: "Indonesian",
        flag: "🇮🇩",
        blurb: "Warming soto soups, gentle bubur ayam porridge and spiced jamu drinks.",
    },
];
const LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
];
const CATEGORIES = [
    { id: "quick meal", label: "Quick to make meals", icon: "⏱️" },
    { id: "drink", label: "Drinks & teas", icon: "🍵" },
];
const MENU = [
    // ───────────── Chinese ─────────────
    {
        id: "cn-chicken-congee", cuisine: "chinese", category: "quick meal", emoji: "🥣",
        name: "Chicken congee", nativeName: "鸡肉粥",
        description: "Slow-cooked rice porridge with shredded chicken, ginger and spring onion.",
        price: 7.95, tags: [],
    },
    {
        id: "cn-wonton-soup", cuisine: "chinese", category: "quick meal", emoji: "🥟",
        name: "Wonton Soup", nativeName: "馄饨汤",
        description: "Pork and prawn wontons in a light chicken broth with pak choi and spring onion.",
        price: 7.95, tags: ["Fish"],
    },
    {
        id: "cn-ji-tang", cuisine: "chinese", category: "quick meal", emoji: "🍲",
        name: "Chicken Soup", nativeName: "鸡汤",
        description: "Clear, slow-simmered chicken broth with ginger, goji berries and red dates.",
        price: 7.50, tags: [],
    },
    {
        id: "cn-xiaolongbao", cuisine: "chinese", category: "quick meal", emoji: "🥟",
        name: "Xiaolongbao (6)", nativeName: "小笼包",
        description: "Shanghai soup dumplings filled with pork and rich broth, with black vinegar.",
        price: 7.50, tags: [],
    },
    {
        id: "cn-chow-mein", cuisine: "chinese", category: "quick meal", emoji: "🍜",
        name: "Beef Chow Mein", nativeName: "牛肉炒面",
        description: "Egg noodles stir-fried with beef, beansprouts and spring onion.",
        price: 8.95, tags: [],
    },
    {
        id: "cn-spring-rolls", cuisine: "chinese", category: "quick meal", emoji: "🥢",
        name: "Vegetable Spring Rolls (4)", nativeName: "春卷",
        description: "Crispy rolls of cabbage, carrot and glass noodles with sweet chilli dip.",
        price: 4.50, tags: ["VG"],
    },
    {
        id: "cn-mw-sweet-sour", cuisine: "chinese", category: "quick meal", emoji: "🍱",
        name: "Sweet & Sour Chicken with Egg Fried Rice",
        description: "Classic takeaway favourite in a ready-to-heat tray.",
        price: 4.95, tags: [], microwaveMinutes: 5,
    },
    {
        id: "cn-mw-chow-mein", cuisine: "chinese", category: "quick meal", emoji: "🍝",
        name: "Chicken Chow Mein",
        description: "Noodles with chicken, peppers and soy. Stir halfway through heating.",
        price: 4.50, tags: [], microwaveMinutes: 4,
    },
    {
        id: "cn-mw-dumplings", cuisine: "chinese", category: "quick meal", emoji: "🥟",
        name: "Steam Pack Veg Dumplings (10)",
        description: "Pak choi and shiitake dumplings that steam in their own bag.",
        price: 3.95, tags: ["VG"], microwaveMinutes: 3,
    },
    {
        id: "cn-ginger-tea", cuisine: "chinese", category: "drink", emoji: "🫚", isTea: true,
        name: "Ginger Tea", nativeName: "姜茶",
        description: "Fresh ginger simmered with brown sugar. Good for nausea and throat discomfort.",
        price: 2.50, tags: ["VG"],
    },
    {
        id: "cn-red-date-tea", cuisine: "chinese", category: "drink", emoji: "🍵", isTea: true,
        name: "Red Date Tea", nativeName: "红枣茶",
        description: "Sweet, warming tea of simmered red dates (jujubes) and goji berries.",
        price: 2.50, tags: ["VG"],
    },
    {
        id: "cn-pear-rock-sugar", cuisine: "chinese", category: "drink", emoji: "🍐", isTea: true,
        name: "Pear & Rock Sugar", nativeName: "冰糖雪梨",
        description: "Asian pear gently stewed with rock sugar, served warm. Good for the throat.",
        price: 2.95, tags: ["VG"],
    },
    // ───────────── Indian ─────────────
    {
        id: "in-butter-chicken", cuisine: "indian", category: "quick meal", emoji: "🍛",
        name: "Butter Chicken", nativeName: "मुर्ग़ मखनी",
        description: "Tandoori chicken in a silky tomato, butter and cream sauce.",
        price: 9.95, tags: [],
    },
    {
        id: "in-khichdi", cuisine: "indian", category: "quick meal", emoji: "🥣",
        name: "Moong Dal Khichdi", nativeName: "मूंग दाल खिचड़ी",
        description: "Comforting porridge of rice and yellow moong dal with turmeric, cumin and a spoon of ghee.",
        price: 7.50, tags: ["V"],
    },
    {
        id: "in-rasam", cuisine: "indian", category: "quick meal", emoji: "🍅",
        name: "Rasam", nativeName: "ரசம்",
        description: "Thin, tangy South Indian soup of tomato, tamarind, black pepper and garlic. Good for colds.",
        price: 5.50, tags: ["VG"],
    },
    {
        id: "in-upma", cuisine: "indian", category: "quick meal", emoji: "🥘",
        name: "Vegetable Upma", nativeName: "उपमा",
        description: "Soft savoury semolina cooked with carrot, peas, curry leaves and mustard seeds.",
        price: 6.50, tags: ["VG"],
    },
    {
        id: "in-dal-soup", cuisine: "indian", category: "quick meal", emoji: "🍲",
        name: "Dal Soup", nativeName: "दाल शोरबा",
        description: "Smooth red lentil soup with cumin, ginger and a squeeze of lemon.",
        price: 5.95, tags: ["VG"],
    },
    {
        id: "in-dhokla", cuisine: "indian", category: "quick meal", emoji: "🟨",
        name: "Dhokla", nativeName: "ढोकला",
        description: "Light, spongy steamed chickpea-flour cakes from Gujarat, with green chutney.",
        price: 4.50, tags: ["VG"],
    },
    {
        id: "in-mw-tikka", cuisine: "indian", category: "quick meal", emoji: "🍱",
        name: "Chicken Tikka Masala with Pilau Rice",
        description: "Creamy tikka masala and fragrant rice in a two-part tray.",
        price: 4.95, tags: [], microwaveMinutes: 5,
    },
    {
        id: "in-mw-dal-makhani", cuisine: "indian", category: "quick meal", emoji: "🍛",
        name: "Dal Makhani with Jeera Rice",
        description: "Slow-cooked black lentils with butter and cumin rice.",
        price: 4.25, tags: ["V"], microwaveMinutes: 4,
    },
    {
        id: "in-mw-biryani", cuisine: "indian", category: "quick meal", emoji: "🍚",
        name: "Vegetable Biryani",
        description: "Basmati rice layered with spiced vegetables and fried onions.",
        price: 4.50, tags: ["VG"], microwaveMinutes: 4,
    },
    {
        id: "in-haldi-doodh", cuisine: "indian", category: "drink", emoji: "🥛", isTea: true,
        name: "Turmeric Milk", nativeName: "हल्दी दूध",
        description: "Warm milk with turmeric, black pepper and a little honey. A classic remedy for colds.",
        price: 2.75, tags: ["V"],
    },
    {
        id: "in-tulsi-tea", cuisine: "indian", category: "drink", emoji: "🌿", isTea: true,
        name: "Tulsi Tea", nativeName: "तुलसी चाय",
        description: "Caffeine-free holy basil tea with ginger, soothing for coughs and colds.",
        price: 2.50, tags: ["VG"],
    },
    {
        id: "in-amla-juice", cuisine: "indian", category: "drink", emoji: "🟢", isTea: true,
        name: "Amla Juice", nativeName: "आंवला जूस",
        description: "Indian gooseberry juice, naturally rich in vitamin C.",
        price: 2.95, tags: ["VG"],
    },
    {
        id: "in-sattu-drink", cuisine: "indian", category: "drink", emoji: "🥤", isTea: true,
        name: "Sattu Drink", nativeName: "सत्तू शरबत",
        description: "Roasted gram flour stirred into water with lemon, cumin and black salt. Filling and cooling.",
        price: 2.50, tags: ["VG"],
    },
    // ───────────── Vietnamese ─────────────
    {
        id: "vn-pho-bo", cuisine: "vietnamese", category: "quick meal", emoji: "🍜",
        name: "Beef Pho", nativeName: "Phở bò",
        description: "Rice noodles in star-anise beef broth with herbs, lime and chilli.",
        price: 10.50, tags: [],
    },
    {
        id: "vn-banh-mi", cuisine: "vietnamese", category: "quick meal", emoji: "🥖",
        name: "Pork Banh Mi", nativeName: "Bánh mì thịt",
        description: "Crusty baguette with grilled pork, pâté, pickles and coriander.",
        price: 7.50, tags: [],
    },
    {
        id: "vn-goi-cuon", cuisine: "vietnamese", category: "quick meal", emoji: "🥬",
        name: "Fresh Summer Rolls (3)", nativeName: "Gỏi cuốn",
        description: "Rice-paper rolls with prawn, vermicelli and herbs, with peanut dip.",
        price: 5.95, tags: ["Fish", "Nuts"],
    },
    {
        id: "vn-com-tam", cuisine: "vietnamese", category: "quick meal", emoji: "🍚",
        name: "Lemongrass Tofu Broken Rice", nativeName: "Cơm tấm chay",
        description: "Saigon-style broken rice with lemongrass tofu and pickled veg.",
        price: 8.95, tags: ["VG"],
    },
    {
        id: "vn-chao-ga", cuisine: "vietnamese", category: "quick meal", emoji: "🥣",
        name: "Chicken Rice Porridge", nativeName: "Cháo gà",
        description: "Soft rice porridge cooked in chicken broth, topped with shredded chicken, ginger and spring onion.",
        price: 7.50, tags: [],
    },
    {
        id: "vn-banh-bao", cuisine: "vietnamese", category: "quick meal", emoji: "🥟",
        name: "Steamed Pork Buns (2)", nativeName: "Bánh bao",
        description: "Fluffy steamed buns filled with minced pork, mushroom and quail egg.",
        price: 5.50, tags: [],
    },
    {
        id: "vn-sup-cua", cuisine: "vietnamese", category: "quick meal", emoji: "🦀",
        name: "Crab Soup", nativeName: "Súp cua",
        description: "Silky, thick soup with crab meat, egg ribbons and mushrooms.",
        price: 7.95, tags: ["Fish"],
    },
    {
        id: "vn-canh-bi-do", cuisine: "vietnamese", category: "quick meal", emoji: "🎃",
        name: "Pumpkin & Minced Pork Soup", nativeName: "Canh bí đỏ thịt bằm",
        description: "Gentle home-style soup of pumpkin and minced pork. Rich in vitamin A.",
        price: 7.50, tags: [],
    },
    {
        id: "vn-mw-instant-pho", cuisine: "vietnamese", category: "quick meal", emoji: "🍜",
        name: "Instant Chicken Pho",
        description: "Rice noodles with chicken pho stock and a dried herb sachet. Just add boiling water or microwave.",
        price: 2.50, tags: [], microwaveMinutes: 3,
    },
    {
        id: "vn-mw-ga-xao-sa", cuisine: "vietnamese", category: "quick meal", emoji: "🍱",
        name: "Lemongrass Chilli Chicken with Rice",
        description: "Gà xào sả ớt: chicken stir-fried with lemongrass and chilli.",
        price: 4.95, tags: ["Spicy"], microwaveMinutes: 5,
    },
    {
        id: "vn-mw-thit-kho", cuisine: "vietnamese", category: "quick meal", emoji: "🥚",
        name: "Caramelised Pork & Egg with Rice",
        description: "Thịt kho trứng: pork braised in coconut water, a home-cooking classic.",
        price: 4.95, tags: ["Fish"], microwaveMinutes: 5,
    },
    {
        id: "vn-nuoc-sam", cuisine: "vietnamese", category: "drink", emoji: "🌱", isTea: true,
        name: "Herbal Drink", nativeName: "Nước sâm",
        description: "Lightly sweet herbal drink of monk fruit, chrysanthemum, corn silk and pandan.",
        price: 2.95, tags: ["VG"],
    },
    {
        id: "vn-tra-sen", cuisine: "vietnamese", category: "drink", emoji: "🪷", isTea: true,
        name: "Lotus Tea", nativeName: "Trà sen",
        description: "Green tea scented with lotus flowers, a Hanoi speciality.",
        price: 2.95, tags: ["VG", "Caffeine"],
    },
    {
        id: "vn-atiso", cuisine: "vietnamese", category: "drink", emoji: "🌿", isTea: true,
        name: "Artichoke Tea", nativeName: "Trà atiso",
        description: "Caffeine-free herbal tea from Đà Lạt, served hot or iced.",
        price: 2.50, tags: ["VG"],
    },
    {
        id: "vn-tra-tac", cuisine: "vietnamese", category: "drink", emoji: "🍯", isTea: true,
        name: "Kumquat Honey Tea", nativeName: "Trà tắc mật ong",
        description: "Warm tea with fresh kumquat juice and honey, soothing for a sore throat.",
        price: 2.95, tags: ["V"],
    },
    // ───────────── Indonesian ─────────────
    {
        id: "id-bubur-ayam", cuisine: "indonesian", category: "quick meal", emoji: "🥣",
        name: "Chicken Congee", nativeName: "Bubur ayam",
        description: "Soft rice porridge with shredded chicken, sweet soy sauce, fried shallots and crackers.",
        price: 7.50, tags: [],
    },
    {
        id: "id-soto-ayam", cuisine: "indonesian", category: "quick meal", emoji: "🍲",
        name: "Turmeric Chicken Soup", nativeName: "Soto ayam",
        description: "Golden turmeric chicken broth with glass noodles, boiled egg, beansprouts and lime.",
        price: 7.95, tags: [],
    },
    {
        id: "id-bakso", cuisine: "indonesian", category: "quick meal", emoji: "🍜",
        name: "Beef Meatball Noodle Soup", nativeName: "Bakso mie kuah",
        description: "Springy beef meatballs and egg noodles in a clear, garlicky broth with pak choi.",
        price: 8.50, tags: [],
    },
    {
        id: "id-nasi-tim", cuisine: "indonesian", category: "quick meal", emoji: "🍚",
        name: "Steamed Chicken Rice", nativeName: "Nasi tim ayam",
        description: "Soft steamed rice topped with soy-braised chicken and mushrooms, with a light broth.",
        price: 7.95, tags: [],
    },
    {
        id: "id-bajigur", cuisine: "indonesian", category: "drink", emoji: "🥥",
        name: "Bajigur", nativeName: "Bajigur",
        description: "Warm, creamy Sundanese drink of coconut milk, ginger and palm sugar.",
        price: 2.95, tags: ["VG"],
    },
    {
        id: "id-wedang-uwuh", cuisine: "indonesian", category: "drink", emoji: "🫚",
        name: "Spiced Herbal Drink", nativeName: "Wedang uwuh",
        description: "Javanese herbal drink of ginger, cloves, cinnamon and sappan wood, sweetened with rock sugar.",
        price: 2.75, tags: ["VG"],
    },
    {
        id: "id-tolak-angin", cuisine: "indonesian", category: "drink", emoji: "🌿",
        name: "Tolak Angin Herbal Sachet", nativeName: "Tolak angin",
        description: "Traditional herbal supplement with ginger, mint and honey, taken for colds and tiredness.",
        price: 1.95, tags: ["V"],
    },
];
const EXTRAS = [
    { id: "ex-electrolyte", name: "Electrolyte sachet", emoji: "💧", price: 1.50,
        description: "Rehydration powder to mix into a glass of water." },
    { id: "ex-fruit", name: "Fresh fruit", emoji: "🍊", price: 1.95,
        description: "A piece of ripe seasonal fruit." },
    { id: "ex-heat-pack", name: "Heat pack", emoji: "♨️", price: 2.50,
        description: "Single-use warmer that stays warm for about 8 hours." },
    { id: "ex-tissues", name: "Tissue box", emoji: "🤧", price: 2.95,
        description: "A box of soft facial tissues." },
];
/** Also only offered when ordering for someone else: optional touches for their package. */
const GIFT_EXTRAS = [
    { id: "ex-card", name: "Get-well card", emoji: "💌", price: 2.50,
        description: "A greeting card tucked into the package." },
    { id: "ex-ribbons", name: "Ribbon gift wrap", emoji: "🎀", price: 1.95,
        description: "The package tied up with coloured ribbons." },
    { id: "ex-flowers", name: "Get-well bouquet", emoji: "💐", price: 12.95,
        description: "A hand-tied bunch of seasonal flowers, delivered with the order." }
];
const DIET_OPTIONS = [
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "halal", label: "Halal", hint: "No pork; we'll tell the kitchen" },
    { id: "noPork", label: "No pork" },
    { id: "noBeef", label: "No beef" }
];
const ALLERGY_OPTIONS = [
    { id: "peanut", label: "Peanuts" },
    { id: "treeNut", label: "Tree nuts" },
    { id: "shellfish", label: "Shellfish" },
    { id: "dairy", label: "Lactose / dairy" },
    { id: "gluten", label: "Gluten" },
    { id: "fish", label: "Fish" },
    { id: "egg", label: "Egg" },
    { id: "soy", label: "Soy" },
    { id: "sesame", label: "Sesame" },
    { id: "mustard", label: "Mustard" },
];
/**
 * What each menu item contains, used by the quick order to skip unsuitable meals.
 * Items not listed contain none of these. Best-effort guide: keep it in step with the kitchen.
 */
const CONTAINS = {
    // Chinese
    "cn-chicken-congee": [],
    "cn-wonton-soup": ["pork", "shellfish", "gluten", "egg", "soy", "sesame"],
    "cn-ji-tang": [],
    "cn-xiaolongbao": ["pork", "gluten", "soy"],
    "cn-chow-mein": ["beef", "gluten", "egg", "soy"],
    "cn-spring-rolls": ["gluten", "soy"],
    "cn-mw-sweet-sour": ["gluten", "egg", "soy"],
    "cn-mw-chow-mein": ["gluten", "egg", "soy"],
    "cn-mw-dumplings": ["gluten", "soy", "sesame"],
    // Indian
    "in-butter-chicken": ["dairy", "treeNut"],
    "in-khichdi": ["dairy"],
    "in-rasam": ["mustard"],
    "in-upma": ["gluten", "mustard"],
    "in-dal-soup": [],
    "in-dhokla": ["mustard"],
    "in-mw-tikka": ["dairy"],
    "in-mw-dal-makhani": ["dairy"],
    "in-haldi-doodh": ["dairy"],
    // Vietnamese
    "vn-pho-bo": ["beef", "fish"],
    "vn-banh-mi": ["pork", "gluten", "egg", "soy"],
    "vn-goi-cuon": ["shellfish", "peanut", "soy", "gluten"],
    "vn-com-tam": ["soy", "gluten"],
    "vn-chao-ga": ["fish"],
    "vn-banh-bao": ["pork", "gluten", "egg", "soy"],
    "vn-sup-cua": ["shellfish", "egg", "fish"],
    "vn-canh-bi-do": ["pork", "fish"],
    "vn-mw-instant-pho": ["fish"],
    "vn-mw-ga-xao-sa": ["fish"],
    "vn-mw-thit-kho": ["pork", "egg", "fish"],
    // Indonesian
    "id-bubur-ayam": ["soy", "gluten"],
    "id-soto-ayam": ["egg"],
    "id-bakso": ["beef", "gluten", "egg", "soy"],
    "id-nasi-tim": ["soy", "gluten"],
};
//# sourceMappingURL=data.js.map