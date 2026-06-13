export type Region = 'Central' | 'Kutch' | 'North' | 'Saurashtra';
export type Difficulty = 'Low' | 'Medium' | 'High';

export interface Palette {
  /** Top-of-sky color (gradient) */
  sky: string;
  /** Horizon / ground tone */
  ground: string;
  /** Warm accent for emissive glow, lights, UI highlights */
  accent: string;
  /** Atmospheric fog color */
  fog: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Place {
  id: string;
  name: string;
  /** Fable hook / subtitle */
  subtitle: string;
  region: Region;
  district: string;
  /** Short blurb for gallery cards */
  shortDesc: string;
  /** The fable — 300-500 words as paragraphs */
  fable: string[];
  facts: Fact[];
  difficulty: Difficulty;
  palette: Palette;
  /** Label describing the signature interaction in the scene */
  feature: string;
  /** Hero scenes get a full signature interaction */
  hero?: boolean;
}

export const REGIONS: Region[] = ['Central', 'North', 'Kutch', 'Saurashtra'];

export const places: Place[] = [
  {
    id: 'statue-of-unity',
    name: 'Statue of Unity',
    subtitle: 'The Iron Man Who United a Nation',
    region: 'Central',
    district: 'Narmada',
    shortDesc:
      'The world’s tallest statue rises 182 metres over the Narmada, a bronze colossus of the man who stitched a fractured land into one.',
    fable: [
      'When the old empire dissolved, the land it left behind was not one country but five hundred and sixty-two — princely states, each with its own crown, its own pride, its own reasons to stand apart. Some say a nation is born in a single great war. This one was born in quiet rooms, over cups of tea, in the patient voice of a man they called the Iron Man.',
      'Sardar Vallabhbhai Patel was a farmer’s son from Gujarat who became the conscience of a young republic. He did not raise armies to unite the kingdoms; he raised arguments, appeals, and when needed, an unbending will. One by one the rajas signed away their thrones, and a map that had been a shattered mirror became, at last, a single reflecting whole.',
      'Generations later, Gujarat chose to remember him not with a plaque but with a giant. On a river island below the Sardar Sarovar Dam, engineers and sculptors raised a figure twice the height of any statue the world had ever built — one hundred and eighty-two metres of bronze and steel, a number chosen to echo the seats of the state assembly that first dreamed of unity.',
      'Stand at his feet and the Narmada spreads silver in every direction. The wind off the water moves the folds of his stone shawl. Look up and his gaze is fixed on the horizon, on the dam he believed could turn a dry country green, on the farms and the rivers and the people he spent his life refusing to let drift apart.',
      'The fable of the Statue of Unity is not really about a statue. It is about the strange, stubborn idea that a thousand differences can be held inside one outline — that a country, like a colossus, is built piece by patient piece, and stands only because someone decided it must.',
    ],
    facts: [
      { label: 'Height', value: '182 metres (597 ft) — world’s tallest statue' },
      { label: 'Dedicated to', value: 'Sardar Vallabhbhai Patel' },
      { label: 'Inaugurated', value: '31 October 2018' },
      { label: 'Material', value: 'Bronze cladding over steel & concrete' },
      { label: 'Setting', value: 'Sadhu Bet island, on the Narmada river' },
      { label: 'Viewing gallery', value: 'At ~153 m, holds up to 200 visitors' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#cdbb8f', ground: '#46553f', accent: '#b8843e', fog: '#9aa784' },
    feature: 'Slow heroic fly-around with scale reference',
    hero: true,
  },
  {
    id: 'rann-of-kutch',
    name: 'Great Rann of Kutch',
    subtitle: 'Where Earth Meets Sky',
    region: 'Kutch',
    district: 'Kutch',
    shortDesc:
      'A horizon-to-horizon sheet of white salt that floods, dries, and turns to a moonlit stage for one of the world’s great festivals.',
    fable: [
      'Once a year the sea remembers this place. The monsoon pushes inland across the marsh, and for a season the Rann becomes a shallow mirror of the sky. Then the water withdraws, the sun does its slow work, and what is left behind is salt — a white so total it erases the line between the ground and the heavens.',
      'The people of Kutch have always read this emptiness as a kind of writing. The Agariyas, the salt-makers, walk out into the glare each winter and rake the crystallised earth into low ridges, harvesting the desert as others harvest a field. The Maldhari herders cross it with their camels, navigating by stars because there is nothing else to steer by. To the unprepared traveller it offers mirages; to those who belong here, it offers a horizon you can walk into.',
      'When the full moon rises over the dry Rann, the salt catches the light and the whole plain begins to glow from beneath your feet, as if the ground had swallowed a second sky. It was this magic that gave birth to the Rann Utsav — a city of embroidered tents that blooms each winter, alive with the bhungas’ mirror-work, the drums of folk dancers, and the long shadows of camel caravans crossing an impossible white.',
      'There is an old feeling out here, older than any festival: the sense of standing at the very edge of the world, where the map simply stops and gives way to light. The Rann does not overwhelm you with detail. It overwhelms you with the absence of it — a vast, patient blankness that makes every tent, every lamp, every human voice feel precious and small.',
      'This is the fable of the white desert: that emptiness is not nothing. It is a canvas the people of Kutch have learned to fill — with salt and song, with mirrors and moonlight — proving that even where the earth turns blank, life insists on colouring it in.',
    ],
    facts: [
      { label: 'Type', value: 'Seasonal salt marsh — among the largest on Earth' },
      { label: 'Area', value: '~7,500 km² of the Great Rann' },
      { label: 'Best season', value: 'November–February (Rann Utsav)' },
      { label: 'People', value: 'Agariya salt-workers, Maldhari herders' },
      { label: 'Phenomenon', value: 'Full-moon nights, the salt seems to glow' },
      { label: 'Wildlife', value: 'Wild ass sanctuary, flamingos in the Little Rann' },
    ],
    difficulty: 'Low',
    palette: { sky: '#f1c886', ground: '#e9e3d3', accent: '#e07b45', fog: '#ecc796' },
    feature: 'Toggle: silent white desert ⇄ Rann Utsav festival',
    hero: true,
  },
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav',
    subtitle: 'The Queen’s Inverted Temple',
    region: 'North',
    district: 'Patan',
    shortDesc:
      'A UNESCO stepwell that plunges seven storeys into the earth, every wall an army of gods and apsaras guarding still water.',
    fable: [
      'Most temples reach upward, straining toward heaven on the strength of their spires. Rani ki Vav does the opposite. It descends — seven storeys down into the earth, an inverted temple carved as a stairway to the water table, where the divine is found not in the sky but in the cool dark below.',
      'Eight centuries ago a queen turned her grief into stone. Udayamati built this well in memory of her husband, King Bhimdev I of the Solanki line. What she commissioned was not merely a way to reach water in a thirsty land, but a sculptural cosmos: more than five hundred principal carvings and a thousand smaller ones, arranged so that to climb down is to descend through layer upon layer of myth.',
      'On the walls stand the ten avatars of Vishnu, and beside them the apsaras — celestial dancers caught mid-gesture, adjusting an anklet, applying kohl, glancing over a shoulder across nine hundred years. Nagakanyas, serpent maidens, coil along the panels. Each step down dims the daylight and deepens the hush, until at the lowest level the air turns cold and the carvings give way to a circular pool, still as a held breath.',
      'For centuries the Saraswati river silted the whole well over, and Rani ki Vav slept beneath the earth, forgotten and therefore perfectly preserved. When it was excavated, the sculptures emerged as crisp as the day the chisels left them — a queen’s love letter, sealed by accident for nine hundred years and opened again into the light.',
      'Descend it slowly. Watch the shafts of sun chase you down the steps and fall short, leaving the deepest gods in shadow. This is the fable of the inverted temple: that the way to the sacred sometimes leads down, not up — into memory, into grief, into the patient dark where water and devotion wait together.',
    ],
    facts: [
      { label: 'Built', value: '11th century, Solanki dynasty' },
      { label: 'Commissioned by', value: 'Queen Udayamati, for King Bhimdev I' },
      { label: 'Status', value: 'UNESCO World Heritage Site (2014)' },
      { label: 'Levels', value: 'Seven storeys descending to the water' },
      { label: 'Sculptures', value: '~500 major and 1,000+ minor carvings' },
      { label: 'Featured on', value: 'The Indian ₹100 banknote' },
    ],
    difficulty: 'High',
    palette: { sky: '#c9a868', ground: '#6e5132', accent: '#e8b34a', fog: '#33251544' },
    feature: 'Descend the stepwell level by level toward the water',
    hero: true,
  },
  {
    id: 'modhera-sun-temple',
    name: 'Modhera Sun Temple',
    subtitle: 'Where Mathematics Meets Divinity',
    region: 'North',
    district: 'Mehsana',
    shortDesc:
      'A Solanki masterpiece built so precisely that on the equinox the rising sun pours straight into the sanctum.',
    fable: [
      'The Solanki kings worshipped Surya, the sun, and so they built him a house that the sun itself could enter. At Modhera, on the banks of the Pushpavati, they raised a temple aligned not to the whims of fashion but to the geometry of the heavens — a building that is half prayer, half calculation.',
      'Approach it from the east and you meet the water first: the Surya Kund, a great stepped tank descending in a perfect cascade of terraces, dotted with more than a hundred small shrines. Pilgrims once purified themselves here before climbing toward the temple, moving from water to fire, from the human to the divine.',
      'Beyond the tank stands the Sabha Mandap, the assembly hall, its fifty-two carved pillars counting out the weeks of the year. Every surface is worked — gods and dancers, elephants and lotus, the twelve Adityas marking the sun’s twelve moods across the months. Nothing here is merely decorative; the whole temple is a calendar you can walk through.',
      'And then the masterstroke. The architects set the inner sanctum so exactly that at the equinox the first light of dawn travels the length of the temple and strikes the spot where the sun god’s image once stood, crowning him in his own element. Mathematics and devotion meet in a single beam of light, repeated faithfully twice a year for nearly a thousand years.',
      'Mahmud of Ghazni’s armies later defaced it, and the idol is long gone, but the alignment remains — indifferent to conquest, keyed only to the turning of the earth. This is the fable of Modhera: that the deepest faith is sometimes built with a surveyor’s precision, and that a people can pin their god to the sky so accurately that the sunrise itself becomes the act of worship.',
    ],
    facts: [
      { label: 'Built', value: 'c. 1026–27 CE, reign of Bhima I (Solanki)' },
      { label: 'Dedicated to', value: 'Surya, the Sun God' },
      { label: 'Surya Kund', value: 'Stepped tank with 100+ miniature shrines' },
      { label: 'Sabha Mandap', value: 'Hall of 52 pillars (weeks of the year)' },
      { label: 'Alignment', value: 'Equinox sun reaches the inner sanctum' },
      { label: 'Today', value: 'Site of the annual Modhera Dance Festival' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#e7bf72', ground: '#a9824a', accent: '#ffcf6b', fog: '#caa05a' },
    feature: 'Sun-position slider — light the sanctum at equinox',
    hero: true,
  },
  {
    id: 'somnath-temple',
    name: 'Somnath Temple',
    subtitle: 'The Eternal Jyotirlinga',
    region: 'Saurashtra',
    district: 'Gir Somnath',
    shortDesc:
      'The first of the twelve Jyotirlingas — destroyed and rebuilt again and again on the shore of the Arabian Sea, a temple that refuses to stay fallen.',
    fable: [
      'They say the Moon God built the first shrine here, out of gold, in gratitude for being healed of a curse. Whether the gold is legend or memory, the meaning has held for millennia: Somnath, the Lord of the Moon, standing where the land of Gujarat finally surrenders to the sea.',
      'It is the first among the twelve Jyotirlingas, the pillars of light through which Shiva is said to reveal himself. And it has paid for that fame. Few buildings on earth have been destroyed as often. Raiders came for its wealth across the centuries — most infamously Mahmud of Ghazni, who is said to have carried off its treasures and broken its idol. Time and again the temple was reduced to rubble at the water’s edge.',
      'And time and again it rose. Stone by stone, century by century, the people rebuilt what had been pulled down, until the temple became less a single structure than an idea wearing many bodies. The one that stands today was completed after India’s independence, championed by Sardar Patel himself — a deliberate act of remembering, of refusing to let the sea have the last word.',
      'Stand in its courtyard at dusk. The shikhara catches the last gold of the day; the Arabian Sea throws itself again and again at the rocks below. There is an arrow-pillar here, the Baan Stambh, that claims an unbroken line of sea stretching all the way to Antarctica — nothing but water between this shore and the bottom of the world. As the evening aarti begins, lamps and conch and the boom of the waves braid into a single sound.',
      'This is the fable of the eternal Jyotirlinga: that some things are destroyed precisely because they matter, and rebuilt for exactly the same reason. Somnath is not impressive because it is old. It is impressive because it kept coming back.',
    ],
    facts: [
      { label: 'Significance', value: 'First of the 12 Jyotirlingas of Shiva' },
      { label: 'Location', value: 'Prabhas Patan, on the Arabian Sea' },
      { label: 'History', value: 'Destroyed & rebuilt many times over centuries' },
      { label: 'Present temple', value: 'Completed 1951, after independence' },
      { label: 'Baan Stambh', value: 'Arrow-pillar marking unobstructed sea south' },
      { label: 'Style', value: 'Chaulukya (Solanki) Kailash Mahameru Prasad' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#3f4f68', ground: '#273a46', accent: '#ff9a4d', fog: '#1b2a34' },
    feature: 'Animated sea with day ⇄ evening aarti glow',
  },
  {
    id: 'dwarkadhish-temple',
    name: 'Dwarkadhish Temple',
    subtitle: 'Krishna’s Golden City',
    region: 'Saurashtra',
    district: 'Devbhoomi Dwarka',
    shortDesc:
      'The legendary capital of Lord Krishna, a five-storey temple whose great flag is changed five times a day above the meeting of river and sea.',
    fable: [
      'When Krishna left Mathura, the story goes, he led his people west until the land ran out, and there on the coast he raised a city of gold — Dwarka, the gateway, the place where the divine king ruled in the world of men. It became one of the four holy abodes, a corner of the sacred compass that pilgrims still walk the length of India to touch.',
      'The temple they call Dwarkadhish, the Lord of Dwarka, rises in five tall storeys supported by seventy-two pillars, its spire crowned by a flag so large it can be seen from far across the town. That flag is changed five times a day, hauled up by hand in a ritual unbroken for generations; to sponsor a single flag is the dream of a lifetime for many a devotee. It does not bear a weapon or a slogan — only the sun and the moon, a promise that Krishna’s name will outlast them both.',
      'Below the temple the Gomti creek slides quietly into the Arabian Sea, and pilgrims descend the fifty-six steps of the Swargadwar, the Gate to Heaven, to bathe where fresh water meets salt. Boats carry the faithful across to Bet Dwarka, the island where Krishna is said to have made his home.',
      'And there is a deeper legend, told in a lower voice: that the original Dwarka, the true golden city, sank beneath these waters when Krishna’s earthly time was done — that somewhere under the waves lies a drowned capital, waiting. Divers have found old stones out there; believers find something more.',
      'This is the fable of the golden city: that a place can be both a temple you can touch and a kingdom that slipped beneath the sea — that faith, like Dwarka itself, lives half in the visible world and half in the deep, and is no less real for it.',
    ],
    facts: [
      { label: 'Deity', value: 'Krishna, worshipped as Dwarkadhish' },
      { label: 'Char Dham', value: 'One of the four holy abodes of India' },
      { label: 'Structure', value: '5 storeys on 72 pillars, ~78 m spire' },
      { label: 'The flag', value: 'Changed 5 times daily; bears sun & moon' },
      { label: 'Tradition', value: 'Founded by Krishna’s great-grandson Vajranabha' },
      { label: 'Nearby', value: 'Bet Dwarka island & the Gomti–sea sangam' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#d9ab63', ground: '#33586a', accent: '#f0c25a', fog: '#b78f4e' },
    feature: 'Seafront setting with day ⇄ evening toggle',
  },
  {
    id: 'dholavira',
    name: 'Dholavira',
    subtitle: 'The Lost Maritime Metropolis',
    region: 'Kutch',
    district: 'Kutch',
    shortDesc:
      'A 5,000-year-old Harappan city in the salt desert — master-planned in three tiers, fed by an astonishing network of reservoirs.',
    fable: [
      'Long before the temples, before the kingdoms, before even the legends — there was a city in the desert that already knew how to live. Five thousand years ago, on a flat island ringed by the white Rann, the people of the Indus Valley built Dholavira, and they built it to last in a place where nothing should.',
      'It was a city of three parts, ranked like a thought made visible: a fortified citadel for those who ruled, a middle town for those who served, and a lower town for everyone else, all laid out on a grid as deliberate as any modern plan. They cut a great gateway and set up a signboard of ten large symbols in a script no one alive can read — perhaps the oldest signage in the world, a word from a civilisation speaking into a silence we cannot answer.',
      'But the true genius of Dholavira was water. In a land that received almost no rain, its engineers carved an immense system of reservoirs and channels — terraced tanks cut deep into the rock, dams across two seasonal streams, drains that caught every monsoon drop and saved it against the long dry. Nearly half the city was given over to storing water. They did not fight the desert; they out-thought it.',
      'For centuries the ships of Dholavira may have traded beads and shell and timber along a coast that has since drawn back, leaving the harbour stranded in salt. Then the rivers failed, the climate turned, and the people walked away. The desert kept the city the way the desert keeps things — patiently, completely — until the spades of archaeologists uncovered the reservoirs still holding their shape.',
      'This is the fable of the lost metropolis: that wisdom is older than we like to think, that a people in a dead-flat wasteland once managed water so cleverly we are still learning from them — and that the most advanced thing a civilisation can do is simply survive its own dry season.',
    ],
    facts: [
      { label: 'Civilisation', value: 'Harappan / Indus Valley, c. 3000 BCE' },
      { label: 'Status', value: 'UNESCO World Heritage Site (2021)' },
      { label: 'Plan', value: 'Three tiers: citadel, middle town, lower town' },
      { label: 'Water system', value: 'Vast cascade of reservoirs & dams' },
      { label: 'Famous find', value: 'Ten-sign Indus-script “signboard”' },
      { label: 'Setting', value: 'Khadir Bet island in the Great Rann' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#d8b779', ground: '#a07f4f', accent: '#c79a55', fog: '#bf9f68' },
    feature: 'Toggle reservoirs full ⇄ excavated ruins',
  },
  {
    id: 'mani-mandir',
    name: 'Mani Mandir',
    subtitle: 'The Temple Born of Love',
    region: 'Saurashtra',
    district: 'Morbi',
    shortDesc:
      'A jewel-box temple-palace raised by a king of Morbi in memory of his beloved — devotion to the divine and to a woman, carved into the same stone.',
    fable: [
      'Not every monument in Gujarat is ancient, and not every one is grief or conquest. Some are simply love, made large. In Morbi, beside a river, a ruler built a temple and named it for the one he could not bear to lose — Mani Mandir, the temple of Mani.',
      'In the 1930s the Thakor Saheb of Morbi raised this temple-palace, and into it he set the gods of household devotion: Radha and Krishna, Lakshmi and Narayan, Shiva and Parvati — the divine couples, deities who are never worshipped alone. The choice is its own quiet poem. A man who built a monument to his beloved filled it with gods who come in pairs.',
      'The building wears its tenderness in stone. Pinnacles cluster like a crown; balconies and arches repeat in patient symmetry; every surface is worked with the carving that Gujarat’s craftsmen have practised for a thousand years, now turned to a thoroughly modern purpose. It has the scale of a palace and the heart of a shrine, and in the warm light of evening the carved facade seems almost to glow from within.',
      'The great earthquake of 2001 shook Morbi hard and left parts of Mani Mandir wounded; much of the interior has been closed since. Yet the silhouette endures — the pinnacles still climb, the arches still hold, and the love that raised them is still legible in every deliberate line.',
      'This is the fable of the temple born of love: that devotion to the divine and devotion to a person are not so different after all — that a heart, given something it cannot keep, will sometimes answer by building something that will not fall, and writing a name across the sky in stone.',
    ],
    facts: [
      { label: 'Built', value: 'c. 1930s, by the rulers of Morbi state' },
      { label: 'Type', value: 'Temple-palace complex' },
      { label: 'Deities', value: 'Radha-Krishna, Lakshmi-Narayan, Shiva-Parvati' },
      { label: 'Style', value: 'Ornate carved stone, clustered pinnacles' },
      { label: 'Setting', value: 'Beside the Machhu river, near Rajkot' },
      { label: 'Note', value: 'Damaged in the 2001 Gujarat earthquake' },
    ],
    difficulty: 'Medium',
    palette: { sky: '#caa0ad', ground: '#6d5240', accent: '#f0b6c0', fog: '#a88a86' },
    feature: 'Orbit with soft lamps & drifting petals',
  },
  {
    id: 'girnar-hill',
    name: 'Girnar Hill',
    subtitle: 'The Sacred Mountain',
    region: 'Saurashtra',
    district: 'Junagadh',
    shortDesc:
      'Ten thousand steps climbing a mountain older than the Himalayas, past Jain and Hindu temples to the peaks where pilgrims meet the sky.',
    fable: [
      'They call it older than the Himalayas, and the geologists, for once, agree with the legend: Girnar is an ancient thing, a worn volcanic mountain rising abruptly from the plains of Saurashtra, sacred long before anyone wrote down why. To Jains and Hindus alike it is a mountain you do not merely visit. You climb it.',
      'The way up is some ten thousand steps, cut into the rock and worn smooth by centuries of bare feet. Pilgrims begin before dawn, when the stone is cool and the peaks are still wrapped in mist, and they climb together — the old leaning on the young, porters carrying those who cannot walk, everyone breathing the same thin prayer toward the same high silence.',
      'On the first great shoulder of the mountain stand the Jain temples, a marble city in the clouds. Chief among them is the shrine of Neminath, the twenty-second Tirthankara, who in tradition was kin to Krishna and who renounced the world here, on this very rock, turning back from his own wedding to seek something larger than a crown. Higher still waits the temple of Amba Mata, where newlyweds climb to ask a blessing, and higher again the peaks of Gorakhnath and Dattatreya, the loftiest points in all Gujarat.',
      'The climb is the point. Each landing earns a wider horizon; each temple is a station on a journey that is as much inward as upward. The body labours, the breath shortens, the plains fall away below — and somewhere in the burning of the legs the pilgrimage stops being about the temple at the top and becomes about the climbing itself.',
      'This is the fable of the sacred mountain: that some truths cannot be delivered, only earned step by step; that Jain and Hindu, ancient and modern, the strong and the failing all ascend the same stairs toward the same sky — and that the mountain, indifferent and eternal, simply waits at the top for whoever is willing to come.',
    ],
    facts: [
      { label: 'Significance', value: 'Major Jain & Hindu pilgrimage (mahatirtha)' },
      { label: 'The climb', value: '~9,999 stone steps to the peaks' },
      { label: 'Neminath', value: '22nd Jain Tirthankara, linked to Krishna' },
      { label: 'Peaks', value: 'Highest range in Gujarat (~1,069 m)' },
      { label: 'Other shrines', value: 'Amba Mata, Gorakhnath, Dattatreya' },
      { label: 'Nearby', value: 'Ashokan rock edicts at the mountain’s foot' },
    ],
    difficulty: 'High',
    palette: { sky: '#bccfc0', ground: '#39482f', accent: '#e8b34a', fog: '#8ba38f' },
    feature: 'Virtual climb — ascend to unlock the story',
  },
];

export const getPlace = (id: string): Place | undefined =>
  places.find((p) => p.id === id);
