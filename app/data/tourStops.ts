export interface TourStop {
  id: number;
  title: string;
  shortTitle: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  audioFile: string;
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      body: string;
    }>;
  };
  triggerRadius: number;
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: 1,
    title: "Begin audiotour",
    shortTitle: "Stop 1",
    coordinates: { lat: 51.44956011298008, lng: 5.4949600537464685 },
    audioFile: "/audio/stop1.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "Welkom op de Technische Universiteit Eindhoven — een plek waar innovatie, duurzaamheid en kennis elkaar ontmoeten. Tijdens deze audiotour nemen we je mee langs enkele bijzondere gebouwen op de campus. Elk gebouw vertelt zijn eigen verhaal over hoe de TU/e werkt aan een toekomst waarin techniek, mens en milieu in balans zijn.",
      sections: [
        {
          heading: "Renoveren in plaats van nieuw bouwen",
          body: "De TU/e kiest er bewust voor om zoveel mogelijk te renoveren in plaats van nieuw te bouwen. Door bestaande gebouwen te behouden en materialen te hergebruiken, wordt de ecologische voetafdruk kleiner en blijft de karakteristieke uitstraling van de campus behouden. Ieder gebouw dat je straks tegenkomt, heeft een eigen duurzame gedachtegang — van slimme ventilatie en gasloze systemen tot energiezuinige verlichting en circulair ontwerp.",
        },
        {
          heading: "Het GENIUS-project",
          body: "Een belangrijk onderdeel van dit verhaal is het GENIUS-project. Binnen dit project onderzoekt de universiteit hoe energie wordt gebruikt, opgeslagen en gedeeld tussen de verschillende gebouwen. Denk aan slimme warmtepompen, natuurlijke ventilatie en het optimaal benutten van restwarmte. GENIUS helpt de TU/e om steeds efficiënter met energie om te gaan — en om te leren van het gedrag van de gebruikers zelf.",
        },
        {
          heading: "Campus als proeftuin",
          body: "De campus fungeert bovendien steeds meer als een levende proeftuin: een plek waar duurzame technologieën niet alleen worden ontworpen, maar ook direct worden getest en zichtbaar zijn voor iedereen. De eerste pilots vinden hier plaats, in de echte wereld, tussen studenten, onderzoekers en bezoekers.",
        },
      ],
    },
  },
  {
    id: 2,
    title: "Batterij & Proeftuin",
    shortTitle: "Stop 2",
    coordinates: { lat: 51.45021598420962, lng: 5.496372603037956 },
    audioFile: "/audio/stop2.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "Welkom bij de batterijopslag. Hier bevinden zich de opslagunits waar studententeams hun accu's veilig kunnen bewaren. Deze accu's worden gebruikt in verschillende voertuigen en technische projecten van de universiteit.",
      sections: [
        {
          heading: "Opslagcapaciteit",
          body: "De totale opslagcapaciteit van de batterijen bedraagt momenteel 3,5 megawattuur. Er is ruimte om dit uit te breiden met nog 1,5 megawattuur, waarmee de totale capaciteit op 5 megawattuur komt. Op basis van berekeningen is er tegen 2033 ongeveer 12 megawattuur aan accupakketten nodig om de hele campus van voldoende stroom te voorzien.",
        },
        {
          heading: "De omvormer",
          body: "Een belangrijk onderdeel van deze installatie is de omvormer. Deze zet gelijkstroom om naar wisselstroom en regelt het laden en ontladen van de batterijen. De omvormer heeft een vermogen van 1,7 megawatt. In theorie kan de batterij zo tussen 20 en 90 procent worden opgeladen in ongeveer twee uur tijd.",
        },
        {
          heading: "Groene stroom",
          body: "De batterij wordt opgeladen met groene stroom: de TU/e koopt duurzame elektriciteit in met een garantie van oorsprong. Ook de batterijpakketten zelf zijn een bewuste duurzame keuze: ze maken gebruik van een ijzerfosfaat-systeem, waarin geen schaarse grondstoffen worden toegepast.",
        },
        {
          heading: "Proeftuin",
          body: "In de proeftuin worden drie systemen geplaatst: de electrolyser van VDL, de Power to Power-unit, en het RIFT-systeem dat werkt met ijzerpoeder als brandstof. De electrolyser zet overtollige elektriciteit om in waterstofgas, dat vervolgens kan worden gebruikt om synthetisch gas te maken voor opslag in het gasnet.",
        },
      ],
    },
  },
  {
    id: 3,
    title: "Woontorens",
    shortTitle: "Stop 3",
    coordinates: { lat: 51.450425498630175, lng: 5.49272101284826 },
    audioFile: "/audio/stop3.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "We staan nu bij de nieuwste woontorens van de TU/e-campus. Deze gebouwen vormen het woonhart van de universiteit, waar studenten en medewerkers dagelijks leven, studeren en ontspannen.",
      sections: [
        {
          heading: "Gesloten distributiesysteem",
          body: "De TU/e beschikt over een zogenoemd gesloten distributiesysteem — een eigen energie-netwerk waarvan de universiteit zelf de beheerder is. Binnen zo'n systeem mag echter geen woonfunctie voorkomen. Daarom zijn de woontorens niet aangesloten op het TU/e-energiesysteem. In plaats daarvan wekken de torens hun eigen energie op, onder andere met zonnepanelen op de daken.",
        },
        {
          heading: "WKO-verbinding",
          body: "Toch is er wél een belangrijke verbinding met de TU/e: de woontorens ontvangen hun warmte via het WKO-systeem van de universiteit. Dat zorgt voor duurzame verwarming, zonder gebruik van fossiele brandstoffen. Op één van de torens vind je bovendien PVT-panelen — dat zijn panelen die zowel zonne-energie als warmte opwekken.",
        },
        {
          heading: "GENIUS onderzoek",
          body: "Het onderzoeksproject GENIUS richt zich op energiegebruik op de campus. De woontorens geven waardevolle inzichten in het verschil tussen energiepatronen van wonen en werken. Overdag stijgt het energieverbruik op de campus, wanneer onderwijs en onderzoek op volle toeren draaien. In de woontorens gebeurt juist het tegenovergestelde: daar begint het gebruik pas in de avond.",
        },
      ],
    },
  },
  {
    id: 4,
    title: "Koeltorens en WKO-systeem",
    shortTitle: "Stop 4",
    coordinates: { lat: 51.44666334838292, lng: 5.495005135106835 },
    audioFile: "/audio/stop4.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "We staan hier bij de koeltorens, een belangrijk onderdeel van het Warmte- en Koudeopslagsysteem, kortweg het WKO-systeem, dat de hele TU/e-campus voorziet van duurzame verwarming en koeling.",
      sections: [
        {
          heading: "Bronnen en temperaturen",
          body: "Onder de campus bevinden zich in totaal 32 bronnen – 16 warme en 16 koude – verdeeld over zes bronclusters. Het koude bronwater heeft een temperatuur van ongeveer 7 graden, en het warme water zo'n 15 graden. In de zomer gebruiken we het koude water om gebouwen direct te koelen. In de winter gebeurt het omgekeerde: het warme water wordt via een warmtepomp opgewarmd tot zo'n 50 graden.",
        },
        {
          heading: "Twee ringen systeem",
          body: "Wat dit systeem bijzonder maakt, is dat het op de TU/e twee ringen heeft: één voor warmte en één voor koude. Daardoor kunnen gebouwen tegelijkertijd worden verwarmd én gekoeld – iets wat in de meeste WKO-systemen niet mogelijk is.",
        },
        {
          heading: "Balans en regeneratie",
          body: "Op de campus is de vraag naar koeling groter dan de vraag naar warmte. Daardoor ontstaat soms een onbalans tussen de warme en koude bronnen in de bodem. Om die balans te herstellen, worden de koeltorens ingezet. Zij zorgen ervoor dat overtollige warmte wordt afgevoerd en er nieuwe koude wordt geproduceerd.",
        },
        {
          heading: "Historie",
          body: "De TU/e gebruikt dit WKO-systeem al sinds 2002 en liep daarmee landelijk voorop. Het is zo succesvol dat het later als voorbeeld heeft gediend voor andere locaties, zoals de High Tech Campus Eindhoven en de Universiteit Utrecht.",
        },
      ],
    },
  },
  {
    id: 5,
    title: "Flux",
    shortTitle: "Stop 5",
    coordinates: { lat: 51.44724473348637, lng: 5.492124167524252 },
    audioFile: "/audio/stop5.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "We zijn nu bij gebouw Flux, een van de nieuwere gebouwen op de campus. Flux is ontworpen met een sterk focus op energie-efficiëntie en maakt gebruik van een innovatief systeem dat betonkernactivering wordt genoemd.",
      sections: [
        {
          heading: "Betonkernactivering",
          body: "In de betonnen vloeren en plafonds lopen duizenden dunne buisjes, waardoor water stroomt. Dat water houdt de betonkern continu op een temperatuur van ongeveer 20 graden – zowel in de zomer als in de winter. Het principe is eenvoudig maar effectief: in de zomer neemt het beton warmte op en helpt zo om het gebouw te koelen, en in de winter geeft het juist warmte af om het comfortabel te houden.",
        },
        {
          heading: "WKO-integratie",
          body: "De energie hiervoor komt uit het WKO-systeem. Daaruit halen we water van ongeveer 15 graden, en dat hoeft maar een beetje te worden bijverwarmd om de betonkern op 20 graden te houden. Juist dat maakt Flux uitzonderlijk zuinig in energieverbruik.",
        },
        {
          heading: "Isolatie",
          body: "Bovendien heeft het gebouw een hoge isolatiegraad, waardoor warmte en koude goed worden vastgehouden. Samen zorgt dat voor een stabiel binnenklimaat met minimale energie-input – een mooi voorbeeld van slimme, duurzame bouwtechniek in de praktijk.",
        },
      ],
    },
  },
  {
    id: 6,
    title: "Helix",
    shortTitle: "Stop 6",
    coordinates: { lat: 51.446490271252905, lng: 5.487777090328055 },
    audioFile: "/audio/stop6.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "We zijn bij gebouw Helix, dat opvalt door zijn unieke H-vorm en slimme architectuur.",
      sections: [
        {
          heading: "Ontwerp voor stabiele temperaturen",
          body: "Het ontwerp is afgestemd op stabiele temperaturen in de laboratoria. De labs zitten aan de binnenzijde, terwijl de kantoren aan de buitenzijde liggen. De zuidgevel is volledig dicht, waardoor zonnestraling hier geen effect heeft. Daarnaast zorgt de positie van het gebouw dat de schaduw van de ene vleugel over de andere valt, afhankelijk van de stand van de zon.",
        },
        {
          heading: "Hybride verwarming",
          body: "Het gebouw is hybride verwarmd: normaal is het onderdeel van het WKO-systeem, maar als het vermogen beperkt is, kan het overschakelen op gas. Dat geldt ook voor het naastgelegen Vertigo-gebouw. Op deze manier kunnen beide gebouwen flexibel reageren op pieken in energiegebruik.",
        },
        {
          heading: "Power to Power experimenten",
          body: "Daarnaast is Helix interessant voor experimenten met synthetisch gas, bijvoorbeeld via kleine demonstraties van Power to Power. Hiermee wordt onderzocht of we in de toekomst duurzame alternatieven kunnen inzetten voor gas.",
        },
      ],
    },
  },
  {
    id: 7,
    title: "Atlas",
    shortTitle: "Stop 7",
    coordinates: { lat: 51.44777468574409, lng: 5.486364541036568 },
    audioFile: "/audio/stop7.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "Welkom bij Atlas! We bevinden ons hier bij een iconisch stukje van de campus, oorspronkelijk gebouwd in 1963, maar onlangs volledig gerenoveerd. Atlas combineert innovatieve technologie en duurzaamheid, terwijl het zijn karakteristieke architectuur behouden heeft.",
      sections: [
        {
          heading: "Parallellen uitzetramen",
          body: "Als je naar de gevel kijkt, zie je de parallellen uitzetramen die kenmerkend zijn voor Atlas. Deze ramen zijn ontworpen om efficiënt met de natuur samen te werken. Wanneer de wind tegen het raam komt, wordt deze gecontroleerd naar binnen of naar buiten geleid zodra het raam opengaat. Het gebouw kan zo 's ochtends vroeg volledig geventileerd worden met frisse lucht.",
        },
        {
          heading: "BREEAM Outstanding",
          body: "Bij de renovatie is het gebouw getoetst aan BREEAM, het internationaal erkende duurzaamheidskeurmerk voor gebouwen. Atlas heeft de hoogste score behaald: BREEAM Outstanding. Dit gebouw was, direct na de renovatie, het meest duurzame onderwijsgebouw van de wereld.",
        },
        {
          heading: "Gasloos en energie-efficiënt",
          body: "Het gebouw is volledig gasloos, met driedubbele beglazing en energie-efficiënte verlichting. Met een energieverbruik van slechts 44 kWh per vierkante meter per jaar, ligt het ver onder de norm van 70 kWh die geldt voor gebouwen van deze grootte.",
        },
        {
          heading: "GENIUS onderzoek",
          body: "In Atlas is GENIUS momenteel aan het onderzoeken hoe warmte zich door het gebouw verspreidt. Dit maakt het mogelijk om warmtepompen op de juiste momenten in te schakelen – bijvoorbeeld 's nachts – zodat niet alle gebouwen op de campus tegelijkertijd energie gebruiken.",
        },
      ],
    },
  },
  {
    id: 8,
    title: "Einde audiotour",
    shortTitle: "Stop 8",
    coordinates: { lat: 51.44645383396237, lng: 5.484546259501781 },
    audioFile: "/audio/stop8.mp3",
    triggerRadius: 25,
    content: {
      introduction:
        "Je hebt nu een indruk gekregen van hoe de TU/e-campus zich ontwikkelt tot een plek waar duurzaamheid en innovatie samenkomen. Van het gerenoveerde Atlas-gebouw tot de nieuwe labs en woontorens — overal wordt nagedacht over slimmer gebruik van energie, hergebruik van materialen en het verbinden van onderzoek met de praktijk.",
      sections: [
        {
          heading: "Uitbreiding van de proeftuin",
          body: "De TU/e wil dat onderzoek zichtbaar en tastbaar is. Niet alleen in laboratoria, maar juist ook hier, in de gebouwen en buitenruimtes van de campus. Hier worden nieuwe ideeën getest, verbeterd en gedeeld. Zo groeit de campus uit tot een uitbreiding van de proeftuin, waar techniek, wetenschap en samenleving elkaar ontmoeten.",
        },
        {
          heading: "Bedankt",
          body: "Dank je wel voor het meewandelen. Hopelijk heb je tijdens deze tour gezien hoe de TU/e niet alleen kennis ontwikkelt, maar die kennis ook toepast in haar eigen leefomgeving — een campus die zichzelf voortdurend vernieuwt, met oog voor mens en milieu.",
        },
      ],
    },
  },
];
