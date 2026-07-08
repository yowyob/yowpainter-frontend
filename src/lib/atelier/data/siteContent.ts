import type { Fiche, Roadmap, ThemeVariant } from '../types'

export const heroStats = [
  { value: '320+', label: 'Fiches' },
  { value: '48', label: 'Roadmaps guidées' },
  { value: '1 200', label: 'Membres actifs' },
]

export const fiches: Fiche[] = [
  // ===================================================================
  // TECHNIQUE (8 fiches)
  // ===================================================================
  {
    slug: 'glacis',
    title: 'Le glacis',
    question: 'Qu\'est-ce que le glacis et comment le maîtriser ?',
    category: 'Technique',
    tool: 'Peinture à l\'huile',
    duration: '35 min',
    level: 'Intermédiaire',
    summary: 'Technique fondamentale de superposition de couches transparentes. Le glacis est l\'une des plus importantes techniques de la peinture à l\'huile, utilisée par les plus grands maîtres depuis le XVe siècle pour obtenir une profondeur et une luminosité inégalées.',
    tags: ['transparence', 'huile', 'couches', 'profondeur', 'médium', 'Van Eyck', 'Rembrandt', 'superposition'],
    sections: [
      { label: 'Définition', title: 'Principe optique du glacis', paragraphs: [
        'Un glacis est une couche de peinture très diluée, posée sur une couche déjà parfaitement sèche. Contrairement à une couche opaque qui masque ce qui se trouve en dessous, le glacis agit comme un filtre coloré translucide. La lumière traverse la couche supérieure, rebondit sur la couche inférieure et remonte vers l\'œil du spectateur — c\'est ce double trajet lumineux qui confère au glacis sa profondeur caractéristique.',
        'Physiquement, ce phénomène est comparable à celui d\'un vitrail : la lumière est partiellement absorbée et partiellement réfléchie à chaque interface air/peinture et peinture/sous-couche. Le résultat est une couleur composite que l\'on ne peut pas obtenir par simple mélange sur palette. Un rouge glacé sur un bleu ne donne pas du violet, mais un rouge profond vibrant que seul l\'œil peut percevoir dans toute sa complexité.',
        'Cette technique exploite le principe de la synthèse soustractive : chaque couche de glacis absorbe certaines longueurs d\'onde et en transmet d\'autres. En superposant des glacis de couleurs différentes, on peut créer des teintes d\'une richesse inouïe — c\'est ce qui explique la luminosité quasi surnaturelle des portraits de Van Eyck ou des natures mortes de Chardin.',
        'La différence fondamentale avec une couche opaque réside dans le fait que le glacis laisse lire la valeur et la texture sous-jacentes. C\'est un outil de nuance et de modulation, pas de couverture. Là où une couche opaque écrase ce qui se trouve en dessous, le glacis le sublime.',
      ]},
      { label: 'Histoire', title: 'Cinq siècles de glacis', paragraphs: [
        'L\'histoire du glacis est indissociable de celle de la peinture à l\'huile elle-même. Au début du XVe siècle, les frères Van Eyck perfectionnent la technique de la peinture à l\'huile en Flandre. Jan van Eyck, en particulier, pousse le glacis à un niveau de maîtrise inégalé. Son retable de L\'Agneau Mystique (1432) présente des glacis superposés qui donnent aux rouges et aux bleus une intensité jamais vue auparavant. Chaque couleur semble émettre sa propre lumière.',
        'Au XVIe siècle, les peintres vénitiens — Titien, Véronèse, Tintoret — adoptent et transforment la technique. Titien aurait superposé jusqu\'à trente glacis sur certaines zones de ses tableaux. Il utilisait des glacis chauds sur des fonds froids pour créer des carnations d\'une sensualité troublante. Sa technique, appelée "velatura" en italien, consistait à voiler progressivement la surface de couches toujours plus transparentes.',
        'Rubens, au XVIIe siècle, systématise l\'usage du glacis dans la peinture flamande baroque. Il applique des glacis sur des empâtements blancs pour créer des rehauts de lumière spectaculaires. Rembrandt, son contemporain hollandais, utilise le glacis de manière radicalement différente : il le pose sur des empâtements très épais (impasto) pour créer des effets de clair-obscur dramatiques où la lumière semble jaillir de l\'obscurité.',
        'Au XIXe siècle, les peintres académiques comme Ingres perpétuent la tradition du glacis pour la finition des portraits. Les Impressionnistes, en revanche, rejettent largement cette technique au profit de la touche directe et de la peinture alla prima. Mais au XXe siècle, les peintres réalistes et hyperréalistes redécouvrent le glacis pour sa capacité à produire des effets de profondeur photoréalistes.',
      ]},
      { label: 'Matériaux', title: 'Chimie et matériaux du glacis', paragraphs: [
        'Le choix du médium est crucial. Pour la peinture à l\'huile, l\'huile de lin clarifiée est le liant traditionnel. Elle jaunit légèrement avec le temps mais offre une excellente transparence. L\'huile de noix jaunit moins et était préférée par les grands maîtres pour les glacis clairs. L\'huile de carthame est encore plus stable mais plus coûteuse.',
        'Les résines naturelles comme la résine dammar ou la résine mastic sont souvent ajoutées au médium à glacis. Elles augmentent la brillance, la dureté du film et réduisent le temps de séchage. Un médium à glacis classique se compose d\'une part de résine dammar dissoute dans de l\'essence de térébenthine, mélangée à de l\'huile de lin standolie (pré-polymérisée par chauffage).',
        'Pour l\'acrylique, les médiums glacis sont à base de liant acrylique dilué dans de l\'eau avec des agents mouillants qui améliorent la fluidité. Ils permettent des transparences remarquables sans les problèmes de jaunissement de l\'huile. Le médium brillant acrylique dilué à 50% avec de l\'eau constitue un excellent glacis pour débuter.',
        'Le choix des pigments est tout aussi déterminant. Seuls certains pigments sont suffisamment transparents pour réaliser des glacis efficaces. Les pigments opaques (comme le blanc de titane, les cadmiums ou l\'ocre jaune) ne conviennent pas — ils produiraient un voile laiteux et non un glacis transparent. Les pigments idéaux pour le glacis sont les laques organiques (alizarine cramoisie, laque de garance, jaune indien), les phtalocyanines (bleu et vert), les terres naturelles (en couche très fine), le jaune de Naples, et le noir d\'ivoire (pour les glacis sombres).',
        'Une astuce de peintre confirmé : ajouter une micro-pointe de blanc de zinc (pas de titane !) dans un glacis peut le rendre légèrement laiteux tout en conservant sa transparence. Cela produit un effet vaporeux très utile pour les ciels et les lointains atmosphériques.',
      ]},
      { label: 'Préparation', title: 'Préparer la surface avant le glacis', paragraphs: [
        'La réussite d\'un glacis dépend à 50% de la qualité de la surface sous-jacente. La couche sur laquelle on glace doit être parfaitement sèche — au moins 48 heures pour l\'acrylique, et jusqu\'à 2 semaines pour l\'huile selon l\'épaisseur. Un test simple : poser le dos de la main sur la surface. Si elle est froide ou collante, elle n\'est pas sèche.',
        'La surface doit être impeccablement propre. La moindre poussière, le moindre cheveu sera piégé dans le glacis et restera visible. Nettoyer la surface avec un chiffon doux légèrement humide, ou mieux, avec un pinceau propre et sec. Les peintres professionnels travaillent dans un atelier soigneusement dépoussiéré avant une séance de glacis.',
        'Si la sous-couche présente des empâtements, le glacis va s\'accumuler dans les creux et glisser sur les reliefs. Cela peut produire un beau effet de vieillissement, mais pour un glacis uniforme, la surface doit être lisse. On peut poncer très légèrement au papier de verre grain 800 à 1200 pour égaliser la surface avant de glacer.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel pas à pas : réaliser son premier glacis', paragraphs: [
        'Étape 1 — Préparer le médium : dans un petit godet, mélanger 2 parts d\'huile de lin standolie avec 1 part d\'essence de térébenthine. Ajouter éventuellement 1/2 part de résine dammar dissoute pour plus de brillance.',
        'Étape 2 — Prélever une très petite quantité de couleur (l\'équivalent d\'un grain de riz) et la déposer sur la palette. Ajouter 5 à 10 fois son volume de médium. Le mélange doit ressembler à de l\'encre colorée, pas à de la peinture.',
        'Étape 3 — Charger un pinceau souple (martre ou synthétique doux) et l\'essorer légèrement sur un chiffon. Le pinceau doit être chargé mais pas dégoulinant.',
        'Étape 4 — Appliquer le glacis en une passe continue, sans revenir. Travailler dans un seul sens, de gauche à droite pour les droitiers. La couche doit être parfaitement uniforme.',
        'Étape 5 — Avec un pinceau propre et sec (un blaireau ou un pinceau éventail), tapoter très légèrement la surface pour éliminer les bulles d\'air et uniformiser la couche. Ne pas frotter, juste tamponner.',
        'Étape 6 — Laisser sécher 24 à 48 heures dans un endroit sans poussière, à température ambiante. Ne jamais accélérer le séchage avec un sèche-cheveux — cela ferait cloquer le glacis.',
        'Étape 7 — Évaluer le résultat. Si la teinte est trop faible, appliquer un second glacis identique après séchage complet. Trois glacis fins valent toujours mieux qu\'un seul épais.',
      ]},
      { label: 'Erreurs', title: 'Les 7 erreurs courantes du glacis', paragraphs: [
        'Erreur n°1 — Appliquer sur une couche pas assez sèche. Résultat : le glacis se mélange à la sous-couche et devient opaque. La transparence est perdue.',
        'Erreur n°2 — Utiliser trop de couleur. Un glacis doit être transparent. Si on voit la couleur du glacis avant de voir la sous-couche, il y a trop de pigment.',
        'Erreur n°3 — Revenir sur le glacis en cours de séchage. Dès que le glacis commence à "tirer" (devenir poisseux), il ne faut plus y toucher. Toute retouche créera des traces et des marbrures.',
        'Erreur n°4 — Utiliser des pigments opaques. Un glacis au blanc de titane n\'est pas un glacis, c\'est un voile. Réserver les pigments opaques pour les empâtements.',
        'Erreur n°5 — Appliquer un glacis trop épais. Plus un glacis est épais, plus il risque de craqueler en séchant. Les glacis épais jaunissent également davantage.',
        'Erreur n°6 — Négliger la règle du "gras sur maigre". Si la sous-couche est plus grasse que le glacis, le glacis va craqueler. Toujours ajouter plus de médium dans le glacis que dans la sous-couche.',
        'Erreur n°7 — Travailler dans un environnement poussiéreux. Chaque poussière sera emprisonnée dans le glacis et visible pour toujours.',
      ]},
      { label: 'Avancé', title: 'Glacis superposés : la maîtrise avancée', paragraphs: [
        'La superposition de glacis est l\'étape ultime de la maîtrise. Les grands maîtres superposaient couramment 5 à 10 glacis, parfois jusqu\'à 30 pour les zones de carnation les plus délicates. Chaque couche doit être parfaitement sèche avant la suivante.',
        'La règle d\'or de la superposition : commencer par les couleurs chaudes, terminer par les froides. Un glacis bleu sur un fond orangé crée une vibration optique que l\'on ne peut obtenir autrement. Les ombres des portraits de Rembrandt sont construites sur ce principe : fond chaud, glacis froid par-dessus.',
        'Pour contrôler la saturation, alterner des glacis de couleurs complémentaires. Un glacis vert sur un fond rouge assombrit et neutralise progressivement la teinte sans la rendre terne — contrairement à un mélange direct sur palette qui produirait un gris sale.',
        'La technique du "glacis à l\'essence" consiste à diluer la couleur uniquement dans de l\'essence de térébenthine, sans huile. Ces glacis ultra-maigres sèchent en quelques heures et peuvent être superposés rapidement. Ils sont parfaits pour les premières couches de glacis, mais doivent être suivis de glacis plus gras pour respecter la règle du "gras sur maigre".',
      ]},
      { label: 'Arts', title: 'Les grands maîtres du glacis', paragraphs: [
        'Jan van Eyck (1390-1441) — Le père du glacis à l\'huile. Ses portraits comme "L\'Homme au turban rouge" ou "Les Époux Arnolfini" présentent des glacis d\'une perfection technique jamais égalée. Chaque perle, chaque reflet sur le métal est construit par superposition de glacis transparents.',
        'Titien (1488-1576) — Le maître vénitien du glacis coloré. Sa technique de la "velatura" consistait à appliquer des glacis extrêmement dilués qui modifiaient subtilement la teinte sous-jacente sans jamais la masquer. Ses derniers tableaux, presque monochromes en dessous, sont entièrement construits par glacis.',
        'Rembrandt (1606-1669) — Le génie du glacis sur empâtement. Il appliquait d\'abord des empâtements très épais (parfois au couteau) puis les recouvrait de glacis transparents qui s\'accumulaient dans les creux. Cette technique produit un effet tridimensionnel saisissant où la lumière semble émaner de l\'intérieur de la peinture.',
        'Vermeer (1632-1675) — Le maître de la lumière diffuse. Ses intérieurs doivent leur luminosité exceptionnelle à des glacis superposés de bleu et de jaune qui créent une lumière douce et enveloppante. Sa "Jeune Fille à la perle" doit l\'éclat de sa perle à un unique glacis blanc sur fond gris.',
      ]},
      { label: 'Conservation', title: 'Conservation et vieillissement des glacis', paragraphs: [
        'Le principal ennemi des glacis est le jaunissement. L\'huile de lin jaunit naturellement avec le temps, surtout à l\'obscurité. Un glacis clair peut ainsi virer au jaune-brun en quelques décennies. C\'est pourquoi les restaurateurs utilisent aujourd\'hui des médiums synthétiques non jaunissants.',
        'Les glacis anciens sont extrêmement fragiles. Ils ne doivent jamais être nettoyés avec des solvants, sous peine de les dissoudre. La restauration des glacis est l\'une des opérations les plus délicates de la conservation de peinture.',
        'Pour protéger un glacis, appliquer un vernis final une fois le tableau parfaitement sec (6 à 12 mois pour l\'huile). Le vernis protège le glacis des poussières, des UV et des variations d\'humidité. Choisir un vernis réversible (à base de résine acrylique) pour permettre une restauration future.',
      ]},
    ],
  },
  {
    slug: 'impasto',
    title: 'L\'impasto',
    question: 'Qu\'est-ce que l\'impasto et comment le maîtriser ?',
    category: 'Technique',
    tool: 'Peinture à l\'huile / Acrylique',
    duration: '30 min',
    level: 'Intermédiaire',
    summary: 'Technique de peinture en relief où la matière est appliquée en couches épaisses. L\'impasto donne une présence physique à la peinture — les coups de brosse et de couteau deviennent des éléments sculpturaux.',
    tags: ['texture', 'relief', 'huile', 'acrylique', 'matière', 'Van Gogh', 'Rembrandt', 'couteau'],
    sections: [
      { label: 'Définition', title: 'Qu\'est-ce que l\'impasto ?', paragraphs: [
        'L\'impasto (de l\'italien impastare, "pétrir") consiste à appliquer la peinture en couche épaisse, directement sortie du tube ou très peu diluée. Contrairement aux techniques de glacis qui recherchent la transparence et la planéité, l\'impasto revendique la présence physique de la matière picturale. Les coups de brosse ou de couteau restent visibles et créent un relief tridimensionnel qui capte la lumière réelle de la pièce.',
        'L\'effet est double : d\'une part, la texture en relief crée des ombres portées microscopiques qui enrichissent la perception visuelle ; d\'autre part, la surface irrégulière accroche la lumière différemment selon l\'angle de vue, donnant au tableau une vie changeante au fil de la journée. C\'est cette qualité sculpturale qui distingue l\'impasto des techniques de peinture lisse.',
        'Physiquement, un impasto réussi repose sur trois facteurs : la viscosité de la peinture (qui doit tenir le relief sans s\'affaisser), l\'outil utilisé (brosse dure, couteau, spatule) et le geste du peintre (rapide et décidé). Une peinture trop liquide s\'étalera ; une peinture trop épaisse se craquellera en séchant.',
      ]},
      { label: 'Histoire', title: 'De Rembrandt à l\'expressionnisme abstrait', paragraphs: [
        'Rembrandt (1606-1669) est l\'un des premiers grands utilisateurs de l\'impasto. Il appliquait d\'épaisses couches de blanc de plomb pour les rehauts de lumière — cols de dentelle, reflets sur le métal, perles — qui semblent littéralement jaillir du tableau. Ses autoportraits tardifs montrent des empâtements si épais qu\'ils en deviennent presque abstraits vus de près.',
        'Vincent van Gogh (1853-1890) a poussé la technique à son paroxysme émotionnel. Dans "La Nuit étoilée" ou "Les Tournesols", chaque coup de pinceau est un événement. La peinture est appliquée en virgules épaisses qui suivent le mouvement de la main, créant un tourbillon d\'énergie. Van Gogh utilisait la peinture directement du tube, sans dilution, ce qui explique la fraîcheur et l\'immédiateté de sa touche.',
        'Au XXe siècle, l\'impasto devient un langage à part entière. Les expressionnistes abstraits américains — Jackson Pollock, Willem de Kooning, Franz Kline — utilisent des empâtements monumentaux. De Kooning appliquait la peinture au couteau en couches si épaisses qu\'elles mettaient des années à sécher complètement. Frank Auerbach, peintre britannique, construit ses portraits par accumulation de dizaines de couches d\'impasto, créant des surfaces presque sculpturales.',
      ]},
      { label: 'Outils', title: 'Les outils de l\'impasto', paragraphs: [
        'Le couteau à peindre est l\'outil roi de l\'impasto. Sa lame flexible en acier permet de prélever, d\'étaler et de sculpter la peinture comme du beurre. Les couteaux en forme de losange (pointe) sont les plus polyvalents. Les couteaux droits (spatule) conviennent aux grands surfaces. La pression exercée, l\'angle de la lame et la vitesse du geste déterminent l\'aspect final de l\'empâtement.',
        'Les brosses dures en soie de porc sont idéales pour l\'impasto à l\'huile. Contrairement aux pinceaux souples en martre, elles permettent de déposer une charge importante de peinture et de travailler la matière sans s\'écraser. Les pinceaux éventails et les brosses à pocher créent des textures spécifiques (pointillés, stries).',
        'Les médiums d\'empâtement (gels, cires, médiums structurés) permettent d\'épaissir la peinture sans en altérer la couleur. Les gels acryliques existent en différentes viscosités (souple, lourd, extra-lourd) et peuvent être mélangés directement à la peinture. Pour l\'huile, les médiums oléo-résineux et les cires (medium de Venetia, cire d\'abeille) donnent du corps à la pâte.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel : peindre un paysage en impasto', paragraphs: [
        'Étape 1 — Préparer sa palette : disposer les couleurs en tas généreux. Pour l\'impasto, on consomme 3 à 5 fois plus de peinture que pour une technique classique.',
        'Étape 2 — Ébaucher les grandes masses avec une brosse large et de la peinture légèrement diluée. Cette sous-couche permet de ne pas avoir à couvrir la toile blanche en impasto.',
        'Étape 3 — Commencer par le fond (ciel, lointains) avec des empâtements modérés. Plus on avance vers le premier plan, plus on épaissit la matière.',
        'Étape 4 — Pour le premier plan, prélever la peinture au couteau et l\'étaler d\'un geste ferme. Ne pas hésiter à laisser des crêtes, des stries. Varier l\'angle du couteau pour créer différents effets.',
        'Étape 5 — Les rehauts de lumière se posent en dernier, en empâtement maximal. C\'est le blanc le plus épais qui captera la lumière réelle.',
        'Étape 6 — Laisser sécher plusieurs semaines. Ne jamais empiler du frais sur du sec en impasto — les couches se décolleraient.',
      ]},
      { label: 'Erreurs', title: 'Les erreurs à éviter', paragraphs: [
        'Erreur n°1 — Peinture trop diluée. L\'impasto exige une peinture peu ou pas diluée. Si la peinture coule, ce n\'est plus de l\'impasto.',
        'Erreur n°2 — Surcharger la toile. Un impasto trop épais (plus de 3-4 mm) peut ne jamais sécher complètement, ou se craqueler en séchant de l\'extérieur vers l\'intérieur.',
        'Erreur n°3 — Empâter sur une couche trop grasse. Respecter la règle du "gras sur maigre" même en impasto : les sous-couches doivent être plus maigres que les empâtements finaux.',
        'Erreur n°4 — Négliger la composition. L\'impasto attire l\'œil. Un empâtement mal placé déséquilibre le tableau. Réserver les plus forts reliefs aux points focaux.',
        'Erreur n°5 — Utiliser des pigments bon marché. Les pigments de faible qualité contiennent trop de charge (craie, baryte) et produisent des empâtements ternes et cassants.',
      ]},
      { label: 'Maîtres', title: 'Les grands maîtres de l\'impasto', paragraphs: [
        'Rembrandt — Le maître du clair-obscur empâté. Ses autoportraits tardifs (1659-1669) présentent des empâtements qui semblent jaillir de l\'obscurité.',
        'Van Gogh — L\'impasto comme expression émotionnelle. "La Nuit étoilée" (1889) est un tourbillon d\'empâtements qui donne vie au ciel.',
        'Frank Auerbach — L\'extrême de l\'accumulation. Ses portraits sont construits par superposition de dizaines de couches d\'impasto, créant des reliefs de plusieurs centimètres.',
        'Lucian Freud — L\'impasto au service de la chair. Ses nus présentent des empâtements qui restituent la texture même de la peau.',
        'Jackson Pollock — L\'impasto par projection. Ses drippings sont une forme d\'empêtement aérien où la peinture atterrit en couches superposées.',
      ]},
      { label: 'Conservation', title: 'Conservation des empâtements', paragraphs: [
        'Les empâtements à l\'huile peuvent mettre des années à sécher complètement. Un impasto de 5 mm peut rester mou au cœur pendant 5 à 10 ans. Ne jamais vernir un impasto avant séchage complet.',
        'La poussière est l\'ennemie des empâtements : elle s\'accumule dans les creux et les reliefs. Un dépoussiérage délicat au pinceau doux est recommandé une fois par an.',
        'Les craquelures de séchage sont normales dans les très forts empâtements. Elles font partie de l\'esthétique de la technique. Pour les éviter, ajouter un médium qui ralentit le séchage et améliore l\'élasticité du film.',
      ]},
    ],
  },
  {
    slug: 'sfumato',
    title: 'Le sfumato',
    question: 'Qu\'est-ce que le sfumato et comment le pratiquer ?',
    category: 'Technique',
    tool: 'Peinture à l\'huile',
    duration: '28 min',
    level: 'Avancé',
    summary: 'L\'art du flou léonardien. Le sfumato est l\'une des techniques les plus subtiles de l\'histoire de la peinture — estomper les contours jusqu\'à les faire disparaître dans une brume douce.',
    tags: ['flou', 'dégradé', 'huile', 'portrait', 'Léonard', 'Renaissance', 'estompage'],
    sections: [
      { label: 'Définition', title: 'Qu\'est-ce que le sfumato ?', paragraphs: [
        'Le mot sfumato vient de l\'italien "fumo" (fumée) et du verbe "sfumare" (s\'évaporer, se dissiper comme de la fumée). En peinture, il désigne la technique qui consiste à estomper les contours et les transitions entre les tons de manière si subtile qu\'aucune ligne ou bordure nette n\'est perceptible. Le passage de la lumière à l\'ombre se fait de façon continue, sans rupture.',
        'Léonard de Vinci décrivait lui-même le sfumato comme "sans lignes ni contours, à la façon de la fumée". Il considérait que la nature ne connaît pas de lignes — les contours nets sont une abstraction de l\'esprit humain. Le sfumato vise à restituer la perception naturelle où les formes se fondent les unes dans les autres.',
        'Sur le plan optique, le sfumato exploite le principe de la diffraction de la lumière aux bords des objets. Dans la réalité, aucun contour n\'est parfaitement net — il existe toujours une zone de transition, infime mais réelle. Le sfumato amplifie délibérément cette zone de transition pour créer une atmosphère de mystère et de douceur.',
        'Le sfumato se distingue du simple dégradé par son intention : là où le dégradé est une transition mécanique entre deux valeurs, le sfumato est une dissolution progressive de la forme elle-même dans l\'espace qui l\'entoure.',
      ]},
      { label: 'Histoire', title: 'Léonard et le sfumato', paragraphs: [
        'Léonard de Vinci (1452-1519) is l\'inventeur et le maître absolu du sfumato. Il a passé des années à développer cette technique, étudiant l\'optique, la perception visuelle et la manière dont la lumière se diffuse dans l\'atmosphère. Ses carnets contiennent de nombreuses notes sur la "perspective aérienne" — l\'idée que les objets lointains apparaissent plus flous et plus bleutés à cause de l\'atmosphère interposée.',
        'La Joconde (1503-1519) est l\'exemple le plus célèbre de sfumato. Le sourire de Mona Lisa doit son mystère à l\'absence totale de contour net autour des lèvres et des yeux. Les coins de la bouche se fondent dans la chair environnante, rendant l\'expression insaisissable. C\'est cette ambiguïté visuelle qui fascine depuis cinq siècles.',
        'Dans La Vierge aux rochers (1483-1486), le sfumato est utilisé pour créer une atmosphère mystique dans la grotte. Les personnages émergent doucement de l\'obscurité, leurs contours se dissolvant dans la pénombre du fond rocheux.',
        'Après Léonard, le sfumato a été adopté par ses élèves (Bernardino Luini, Giovanni Antonio Boltraffio) puis par Corrège et Raphaël. Au XVIIe siècle, le Caravage utilise un sfumato dramatique dans ses clairs-obscurs. Au XIXe siècle, les Symbolistes comme Odilon Redon redécouvrent le sfumato pour ses qualités oniriques.',
      ]},
      { label: 'Technique', title: 'Comment réaliser un sfumato', paragraphs: [
        'Le sfumato se pratique exclusivement sur une surface encore fraîche ou semi-sèche. La peinture doit pouvoir se travailler, se fondre, s\'estomper sans laisser de traces. C\'est pourquoi il est traditionnellement associé à la peinture à l\'huile, dont le temps de séchage lent permet de longues séances de travail.',
        'Le pinceau blaireau est l\'outil de prédilection. Ses poils extrêmement doux permettent d\'estomper sans rayer la surface. On peut aussi utiliser un doigt propre (technique traditionnelle des peintres de la Renaissance), un chiffon doux, ou un pinceau éventail sec.',
        'La superposition de glacis ultra-fins est la deuxième composante essentielle. Chaque glacis atténue le contraste de la couche précédente. Après 5 à 10 glacis successifs, les transitions deviennent imperceptibles. C\'est un travail de patience : Léonard aurait passé des mois sur le seul visage de La Joconde.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel : sfumato sur un portrait', paragraphs: [
        'Étape 1 — Établir le dessin et les valeurs principales en grisaille légère. Les traits doivent être précis mais pas trop marqués.',
        'Étape 2 — Modeler les volumes avec des glacis de gris et de terre, en veillant à ne jamais créer de contour dur.',
        'Étape 3 — Travailler les transitions avec un blaireau sec. Tapoter doucement la zone de jonction entre deux valeurs.',
        'Étape 4 — Pour les zones d\'ombre profonde (orbites, commissures), estomper vers l\'extérieur. L\'ombre doit sembler s\'évaporer dans la lumière.',
        'Étape 5 — Évaluer le résultat à distance. Le sfumato se juge à 2-3 mètres, pas le nez sur la toile.',
      ]},
      { label: 'Erreurs', title: 'Les erreurs à éviter', paragraphs: [
        'Erreur n°1 — Trop estomper. Un sfumato excessif donne un effet "flou de bougé" peu flatteur. Les formes doivent rester lisibles.',
        'Erreur n°2 — Travailler sur une couche déjà sèche. L\'estompage sur le sec crée des traces et des marbrures impossibles à rattraper.',
        'Erreur n°3 — Négliger le dessin sous-jacent. Le sfumato adoucit, il ne corrige pas. Un mauvais dessin restera mauvais, même flouté.',
        'Erreur n°4 — Utiliser des pinceaux sales. La moindre trace de couleur parasite sera étalée sur toute la zone estompée.',
      ]},
    ],
  },
  {
    slug: 'grisaille',
    title: 'La grisaille',
    question: 'Comment peindre une grisaille et pourquoi l\'utiliser ?',
    category: 'Technique',
    tool: 'Tous médiums',
    duration: '25 min',
    level: 'Intermédiaire',
    summary: 'Art du monochrome préparatoire. La grisaille est la fondation invisible des plus grands chefs-d\'œuvre — une peinture en nuances de gris qui sert de squelette aux glacis colorés.',
    tags: ['monochrome', 'gris', 'sous-couche', 'valeurs', 'préparation', 'glacis'],
    sections: [
      { label: 'Définition', title: 'Qu\'est-ce que la grisaille ?', paragraphs: [
        'La grisaille (du français "gris") est une peinture exécutée intégralement en nuances de gris — noir, blanc, et tous leurs mélanges intermédiaires. Elle constitue une étape préparatoire fondamentale dans la technique de peinture par couches successives (glacis).',
        'Son rôle est double : d\'une part, établir le dessin et la composition ; d\'autre part, définir précisément toutes les valeurs lumineuses du tableau, des ombres les plus profondes aux lumières les plus éclatantes. Une fois la grisaille achevée et sèche, les couleurs sont appliquées par-dessus sous forme de glacis transparents.',
        'Cette séparation radicale entre le travail de la valeur (grisaille) et celui de la couleur (glacis) est l\'une des grandes inventions de la peinture occidentale. Elle permet au peintre de résoudre tous les problèmes de dessin et de modelé avant même de se préoccuper de la couleur.',
      ]},
      { label: 'Histoire', title: 'La grisaille à travers les siècles', paragraphs: [
        'Les Flamands du XVe siècle (Van Eyck, Van der Weyden, Memling) utilisaient systématiquement la grisaille comme sous-couche. Leurs tableaux étaient d\'abord entièrement peints en valeurs de gris, puis colorés par glacis. Cette méthode explique la perfection de leur modelé.',
        'En Italie, les peintres de fresques utilisaient une variante appelée "verdaccio" — une grisaille teintée de vert (terre verte) qui servait de sous-couche pour les carnations. Cette teinte verdâtre, transparente sous les glacis roses et ocres, produisait des chairs d\'un réalisme saisissant.',
        'Au XVIIe siècle, Rubens systématise la grisaille dans son atelier. Ses esquisses à l\'huile (les "modelli") sont souvent de pures grisailles, destinées à être présentées au commanditaire avant l\'exécution du tableau définitif en couleurs.',
        'La grisaille n\'est pas qu\'une étape préparatoire : certains artistes en ont fait une fin en soi. Les volets extérieurs des retables flamands sont souvent peints en grisaille pour imiter la sculpture de pierre (trompe-l\'œil). Au XXe siècle, Picasso a réalisé son chef-d\'œuvre "Guernica" (1937) en quasi-grisaille.',
      ]},
      { label: 'Palette', title: 'La palette de la grisaille', paragraphs: [
        'La palette classique se compose de : blanc de titane, noir d\'ivoire, et éventuellement une terre d\'ombre ou une terre de Sienne pour réchauffer légèrement les gris. Éviter le noir de vigne (trop bleuté) qui donne des gris froids peu flatteurs.',
        'Certains peintres ajoutent une pointe de bleu (outremer) et de brun (terre de Sienne brûlée) dans leur grisaille pour obtenir des gris colorés plus subtils. Cette "grisaille colorée" offre plus de richesse à l\'étape du glacis.',
        'Pour la grisaille acrylique, le noir de Mars (PBk11) est recommandé car il est plus neutre que le noir d\'ivoire. Le médium mat permet de contrôler la brillance et d\'obtenir une surface idéale pour les glacis ultérieurs.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel : peindre une nature morte en grisaille', paragraphs: [
        'Étape 1 — Établir un dessin précis au fusain ou au crayon sur la toile apprêtée. Fixer le dessin.',
        'Étape 2 — Préparer 5 valeurs de gris sur la palette : blanc pur, gris clair, gris moyen, gris foncé, noir. C\'est la gamme de valeurs qui servira pour tout le tableau.',
        'Étape 3 — Poser les grandes masses : fond en gris moyen, ombres en gris foncé, lumières en blanc. Ne pas détailler à ce stade.',
        'Étape 4 — Modeler les volumes en travaillant les transitions entre les valeurs. Le pinceau doit être propre pour fondre les passages.',
        'Étape 5 — Ajouter les détails fins (reflets, textures) en dernier, avec les valeurs extrêmes (blanc pur, noir).',
        'Étape 6 — Laisser sécher complètement (48h minimum) avant d\'appliquer le premier glacis de couleur.',
      ]},
      { label: 'Erreurs', title: 'Erreurs à éviter', paragraphs: [
        'Erreur n°1 — Empâter la grisaille. Elle doit rester fine et lisse, sinon les glacis s\'accumuleront dans les creux et glisseront sur les bosses.',
        'Erreur n°2 — Utiliser des contrastes excessifs. La grisaille doit couvrir toute la gamme des valeurs, mais sans aller jusqu\'au blanc pur partout — réserver les extrêmes aux points focaux.',
        'Erreur n°3 — Ne pas laisser sécher assez longtemps. Un glacis sur une grisaille encore fraîche se mélange et perd sa transparence.',
      ]},
    ],
  },
  {
    slug: 'alla-prima',
    title: 'Peinture alla prima',
    question: 'Comment peindre alla prima et réussir un tableau en une séance ?',
    category: 'Technique',
    tool: 'Peinture à l\'huile',
    duration: '22 min',
    level: 'Intermédiaire',
    summary: 'L\'art de la peinture directe. L\'alla prima est l\'approche la plus spontanée de la peinture — tout le tableau est réalisé en une seule session, les couleurs se mélangeant directement sur la toile.',
    tags: ['direct', 'frais', 'huile', 'rapide', 'expression', 'Impressionnisme', 'spontanéité'],
    sections: [
      { label: 'Définition', title: 'Qu\'est-ce que l\'alla prima ?', paragraphs: [
        'Alla prima signifie « au premier jet » en italien. Le peintre achève son tableau en une seule séance de travail, sans attendre le séchage entre les couches. Les couleurs sont appliquées « dans le frais » (wet-on-wet), se mélangeant directement sur la toile.',
        'Cette approche s\'oppose à la technique par couches successives (glacis sur grisaille) qui peut prendre des semaines. L\'alla prima exige une exécution rapide, sûre, et une bonne planification mentale du tableau avant de commencer.',
        'L\'alla prima n\'est pas une technique de débutant — c\'est au contraire une approche qui requiert une excellente maîtrise du dessin et de la couleur, car il n\'y a pas de droit à l\'erreur : une fois la peinture appliquée, elle ne peut pas être corrigée après séchage sans repeindre entièrement la zone.',
      ]},
      { label: 'Histoire', title: 'De Frans Hals aux Impressionnistes', paragraphs: [
        'Frans Hals (1582-1666), le grand portraitiste hollandais, est considéré comme l\'un des précurseurs de l\'alla prima. Ses portraits aux touches vives et apparentes étaient peints en une seule séance de pose — une prouesse technique sidérante.',
        'Diego Velázquez (1599-1660) pratiquait également une forme d\'alla prima dans ses portraits de cour. Sa touche libre et assurée, visible dans Les Ménines, donne une impression de spontanéité qui influencera les générations futures.',
        'Au XIXe siècle, John Singer Sargent (1856-1925) porte l\'alla prima à un niveau de virtuosité inégalé. Ses portraits mondains sont exécutés en 2 à 3 heures, chaque coup de pinceau étant définitif. Il disait : « Un portrait est une peinture où il y a quelque chose qui ne va pas dans la bouche. »',
        'Les Impressionnistes (Monet, Renoir, Pissarro) adoptent l\'alla prima comme méthode de travail principale, car elle seule permet de capturer les effets changeants de la lumière naturelle. Monet peignait parfois 3 à 4 toiles différentes dans la même journée pour suivre le soleil.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel : peindre une nature morte alla prima', paragraphs: [
        'Étape 1 — Préparer sa palette avec toutes les couleurs nécessaires, en tas généreux. On ne veut pas perdre de temps à refaire des mélanges en cours de séance.',
        'Étape 2 — Ébaucher la composition au pinceau fin et à la peinture diluée (essence de térébenthine). Ce tracé maigre sèche en quelques minutes.',
        'Étape 3 — Poser les grandes masses colorées rapidement, sans se soucier des détails. Couvrir toute la toile. C\'est l\'étape du « blocage ».',
        'Étape 4 — Travailler du général au particulier : affiner les volumes, poser les demi-teintes, puis les ombres, puis les lumières.',
        'Étape 5 — Les rehauts finaux (touches de lumière) sont posés en dernier, en empâtement généreux.',
        'Étape 6 — Signer. Poser les pinceaux. Ne plus toucher à rien. L\'alla prima se gâche quand on « bricole » trop longtemps.',
      ]},
      { label: 'Erreurs', title: 'Les erreurs à éviter en alla prima', paragraphs: [
        'Erreur n°1 — Vouloir trop bien faire. L\'alla prima récompense l\'audace, pas la prudence. Accepter l\'imperfection.',
        'Erreur n°2 — Utiliser trop de médium. L\'alla prima exige une peinture peu diluée. Trop de médium rend la surface glissante et empêche les superpositions.',
        'Erreur n°3 — S\'attarder sur un détail. Si on passe 30 minutes sur un œil pendant que le reste du visage sèche, l\'harmonie est perdue.',
        'Erreur n°4 — Vouloir corriger une zone sèche. On ne retouche pas un alla prima le lendemain. Si c\'est raté, on recommence une nouvelle toile.',
      ]},
      { label: 'Maîtres', title: 'Les grands maîtres de l\'alla prima', paragraphs: [
        'Frans Hals — L\'inventeur de la touche visible et rapide. Ses portraits de la Bohème hollandaise sont des leçons de virtuosité gestuelle.',
        'John Singer Sargent — Le maître absolu du portrait alla prima. Son tableau « Carnation, Lily, Lily, Rose » (1885) fut peint en plein air, chaque soir au crépuscule, pendant des semaines.',
        'Claude Monet — L\'alla prima au service de la lumière. Ses séries (Meules, Cathédrale de Rouen) sont des exercices de capture de l\'instant lumineux.',
        'Richard Schmid (1934-2021) — Le grand représentant contemporain de l\'alla prima. Ses paysages et portraits sont exécutés en une seule séance avec une maîtrise époustouflante.',
      ]},
    ],
  },
  {
    slug: 'frottis',
    title: 'Le frottis',
    question: 'Qu\'est-ce que le frottis en peinture ?',
    category: 'Technique',
    tool: 'Peinture à l\'huile',
    duration: '8 min',
    level: 'Intermédiaire',
    summary: 'Couche très mince de peinture opaque frottée sur la toile pour créer une transition douce entre deux tons.',
    tags: ['mince', 'transition', 'huile', 'unifier'],
    sections: [
      { label: 'Définition', title: 'Qu\'est-ce qu\'un frottis ?', paragraphs: ['Le frottis est une couche de peinture opacifiée (souvent avec un peu de blanc) appliquée en frottant avec un pinceau sec ou très peu chargé.', 'Contrairement au glacis transparent, le frottis est semi-opaque : il couvre partiellement la couche inférieure tout en la laissant transparaître.'] },
      { label: 'Usage', title: 'Quand utiliser le frottis ?', paragraphs: ['Idéal pour unifier des zones de valeurs proches, créer des transitions atmosphériques ou adoucir des contours trop durs.', 'Appliquer avec un pinceau éventail ou un blaireau en mouvements circulaires légers.'] },
    ],
  },
  {
    slug: 'degrade',
    title: 'Le dégradé',
    question: 'Comment réussir un dégradé parfait ?',
    category: 'Technique',
    tool: 'Tous médiums',
    duration: '10 min',
    level: 'Débutant',
    summary: 'Transition progressive entre deux couleurs ou deux valeurs — fondamentale pour les ciels, les fonds et les volumes.',
    tags: ['dégradé', 'transition', 'fond', 'ciel', 'volume'],
    sections: [
      { label: 'Technique humide', title: 'Dégradé dans le frais', paragraphs: ['Pour l\'huile et l\'acrylique, appliquer les deux couleurs côte à côte puis travailler la jonction avec un pinceau propre et sec en mouvements croisés.', 'À l\'aquarelle, travailler sur papier humide : le pigment se diffuse naturellement. Incliner le support pour guider la migration.'] },
      { label: 'Astuces', title: 'Éviter les erreurs', paragraphs: ['Ne pas sur-travailler la zone de transition : trop de passages créent de la boue. Laisser le mélange optique faire son travail.', 'Pour un dégradé régulier, diviser mentalement la zone en segments et traiter chaque transition l\'une après l\'autre.'] },
    ],
  },
  {
    slug: 'lavis',
    title: 'Le lavis',
    question: 'Qu\'est-ce que la technique du lavis ?',
    category: 'Technique',
    tool: 'Aquarelle / Encre',
    duration: '9 min',
    level: 'Débutant',
    summary: 'Technique consistant à appliquer une couche diluée et uniforme de couleur sur le papier, typique de l\'aquarelle.',
    tags: ['aquarelle', 'encre', 'dilution', 'fond', 'transparence'],
    sections: [
      { label: 'Principe', title: 'Le lavis à l\'aquarelle', paragraphs: ['Un lavis est une couche de couleur très diluée appliquée uniformément sur le papier. C\'est la technique de base de l\'aquarelle.', 'On distingue le lavis uniforme, le lavis dégradé (plus foncé en haut) et le lavis humide-sur-humide (bords diffus).'] },
      { label: 'Pratique', title: 'Réussir un beau lavis', paragraphs: ['Préparer une quantité suffisante de mélange dilué. Travailler sur papier incliné à 15 degrés.', 'Appliquer en une seule passe, sans revenir. Laisser sécher complètement avant de superposer un nouveau lavis.'] },
    ],
  },

  // ===================================================================
  // PIGMENT (8 fiches avec swatches)
  // ===================================================================
  {
    slug: 'blanc-titane',
    title: 'Blanc de titane',
    question: 'Pourquoi utiliser le blanc de titane ?',
    category: 'Pigment',
    tool: 'Acrylique / Huile',
    duration: '10 min',
    level: 'Débutant',
    summary: 'Blanc couvrant à forte opacité, le plus utilisé des blancs modernes. Idéal pour les rehauts et les mélanges opaques.',
    tags: ['opacité', 'rehaut', 'mélange', 'couvrant', 'base'],
    pigmentCode: 'PW6',
    swatch: ['#f7f4ef', '#f0ebe4', '#e5ddd1', '#d8cbb7', '#c2b29b'],
    sections: [
      { label: 'Propriétés', title: 'Un blanc de référence', paragraphs: ['Le blanc de titane (dioxyde de titane, PW6) offre la plus forte opacité parmi tous les blancs. Stable à la lumière et non toxique.', 'Inventé au début du XXe siècle, il a remplacé le blanc de plomb toxique. Pouvoir couvrant environ 10 fois supérieur au blanc de zinc.'] },
      { label: 'Usage', title: 'Bonnes pratiques', paragraphs: ['Utiliser avec parcimonie dans les mélanges : trop de blanc de titane rend les couleurs crayeuses et froides.', 'Pour les glacis, préférer le blanc de zinc (PW4), plus transparent. Pour les empâtements, le blanc de titane est idéal.'] },
    ],
  },
  {
    slug: 'bleu-de-prusse',
    title: 'Bleu de Prusse',
    question: 'Qu\'est-ce que le Bleu de Prusse et pourquoi est-il si important ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '32 min',
    level: 'Intermédiaire',
    summary: 'Le plus célèbre des bleus synthétiques. Découvert par accident en 1704, le Bleu de Prusse a révolutionné l\'histoire de l\'art en rendant le bleu accessible à tous les peintres.',
    tags: ['bleu', 'semi-transparent', 'glacis', 'froid', 'synthétique', 'Berlin', 'Hokusai', 'Picasso'],
    pigmentCode: 'PB27',
    swatch: ['#0a1f35', '#1a3a5c', '#2a5580', '#3d729e', '#5a90b8'],
    sections: [
      { label: 'Découverte', title: '1704 : l\'accident qui changea la peinture', paragraphs: [
        'En 1704, à Berlin, le fabricant de couleurs Heinrich Diesbach travaille à la fabrication d\'un rouge carmin à base de cochenille. Il lui manque de la potasse pour précipiter le colorant. Il emprunte de la potasse contaminée à l\'alchimiste Johann Conrad Dippel — de la potasse qui avait été en contact avec du sang animal.',
        'Quand Diesbach mélange cette potasse à son bain de cochenille, au lieu du rouge attendu, il obtient un bleu profond et intense. Le fer contenu dans le sang avait réagi avec les cyanures de la potasse pour former du ferrocyanure ferrique — le premier pigment bleu synthétique de l\'histoire.',
        'Ce bleu, d\'abord appelé "Berliner Blau" (Bleu de Berlin), se répand rapidement dans toute l\'Europe. Pour la première fois, les peintres disposent d\'un bleu intense et abordable — le très coûteux outremer de lapis-lazuli perd enfin son monopole.',
      ]},
      { label: 'Chimie', title: 'Structure chimique et formule', paragraphs: [
        'Le Bleu de Prusse is un ferrocyanure ferrique de formule Fe₄[Fe(CN)₆]₃ · xH₂O. C\'est un composé de coordination où des ions ferreux Fe²⁺ sont liés à des groupes cyanure CN⁻, formant un réseau cristallin cubique dans lequel des ions ferriques Fe³⁺ occupent les interstices.',
        'La couleur bleue profonde provient d\'un transfert de charge entre les ions Fe²⁺ et Fe³⁺, un phénomène appelé "transfert d\'intervalence". L\'électron absorbe la lumière orangée-rouge (600-700 nm) en sautant d\'un ion à l\'autre, ce qui laisse passer les longueurs d\'onde bleues.',
        'Sa granulométrie est très fine (particules de 0,01 à 0,05 μm), ce qui explique son pouvoir colorant exceptionnel. Une quantité infime suffit à teinter fortement un blanc. Il est insoluble dans l\'eau et dans les solvants organiques.',
      ]},
      { label: 'HistoireArt', title: 'Impact sur l\'histoire de l\'art', paragraphs: [
        'L\'arrivée du Bleu de Prusse sur le marché européen vers 1710 a démocratisé l\'usage du bleu en peinture. Avant lui, le bleu était un luxe réservé aux mécènes fortunés (outremer) ou un compromis terne (azurite, smalt). Soudain, n\'importe quel peintre pouvait s\'offrir un bleu splendide.',
        'Les peintres romantiques du XVIIIe et XIXe siècles — Gainsborough, Constable, Turner — l\'adoptent pour leurs ciels et leurs paysages. Sa teinte froide convient parfaitement aux atmosphères tourmentées et aux effets de brume.',
        'Au Japon, le Bleu de Prusse (appelé "bero-ai" — bleu de Berlin) est introduit au début du XIXe siècle. Hokusai l\'utilise abondamment dans sa célèbre série des Trente-six vues du mont Fuji, notamment dans "La Grande Vague de Kanagawa" (1831).',
        'Au XXe siècle, Picasso traverse une "période bleue" (1901-1904) où le Bleu de Prusse domine largement sa palette. Ces tableaux monochromes expriment la mélancolie et la pauvreté des marginaux de Barcelone et Paris.',
      ]},
      { label: 'Propriétés', title: 'Propriétés physiques et optiques', paragraphs: [
        'Semi-transparent à transparent : idéal pour les glacis. Pouvoir colorant extrêmement élevé : une pointe suffit à teinter 10 fois son volume de blanc. Cette intensité est à la fois une force et un danger — le Bleu de Prusse domine tous les mélanges.',
        'Excellente résistance à la lumière (Lightfastness I ou II selon les fabricants, soit la meilleure catégorie). Les œuvres au Bleu de Prusse ne passent pratiquement pas avec le temps.',
        'Son séchage est moyen à l\'huile, rapide à l\'acrylique et à l\'aquarelle. Sa texture est onctueuse et facile à travailler.',
      ]},
      { label: 'Compatibilité', title: 'Compatibilités et incompatibilités', paragraphs: [
        'Compatible avec tous les médiums : huile, acrylique, aquarelle, gouache, tempera, pastel. En fresque, il est déconseillé car instable en milieu alcalin (la chaux le décompose).',
        'Mélanges : avec les jaunes (ocre, cadmium), il donne des verts profonds de sous-bois. Avec les rouges, des violets sourds. Avec le blanc, des bleus ciel frais. Avec les terres, des ombres riches.',
        'Ne pas mélanger avec des pigments à base de plomb ou de cuivre en grandes quantités — des réactions chimiques peuvent altérer la teinte à long terme.',
      ]},
      { label: 'Comparaison', title: 'Comparaison avec les autres bleus', paragraphs: [
        'Bleu de Prusse (PB27) vs Outremer (PB29) : le Bleu de Prusse est plus froid, plus vert. L\'outremer est plus chaud, plus violet. En mélange avec du blanc, le Bleu de Prusse donne des bleus frais et lumineux ; l\'outremer donne des bleus plus sourds.',
        'Bleu de Prusse (PB27) vs Bleu de Cobalt (PB28) : le cobalt est plus clair, plus opaque, plus cher. Le Bleu de Prusse est plus intense et plus économique.',
        'Bleu de Prusse (PB27) vs Phtalocyanine de cuivre (PB15) : le phtalo est le remplaçant moderne — encore plus intense, plus transparent, plus stable chimiquement, mais sa teinte tire davantage vers le cyan.',
      ]},
      { label: 'Usages', title: 'Usage par les grands maîtres', paragraphs: [
        'Hokusai (1760-1849) — Le maître japonais de l\'estampe a fait du Bleu de Prusse la signature chromatique de ses paysages les plus célèbres, notamment "La Grande Vague" où le bleu profond contraste avec l\'écume blanche.',
        'Caspar David Friedrich (1774-1840) — Le peintre romantique allemand utilise le Bleu de Prusse for ses ciels crépusculaires et ses ambiances méditatives.',
        'Pablo Picasso (1881-1973) — Sa "période bleue" (1901-1904) exploite les qualités psychologiques du bleu pour exprimer la mélancolie.',
        'Yves Klein (1928-1962) — Bien qu\'ayant créé son propre "International Klein Blue" (IKB) à base d\'outremer, Klein admirait le Bleu de Prusse pour sa profondeur.',
      ]},
      { label: 'Tutoriel', title: 'Tutoriel : peindre un ciel au Bleu de Prusse', paragraphs: [
        'Étape 1 — Sur une toile apprêtée blanche, appliquer un lavis très dilué de Jaune de Naples sur la moitié inférieure du ciel (horizon).',
        'Étape 2 — Préparer un mélange de Bleu de Prusse + une pointe de Blanc de titane + médium. Appliquer au pinceau large du haut vers le bas.',
        'Étape 3 — Dégradé : plus on descend vers l\'horizon, plus on dilue le bleu. Le Bleu de Prusse est si intense qu\'une dilution extrême suffit.',
        'Étape 4 — Pour les nuages, prélever de la peinture au chiffon (retrait) dans le bleu encore frais. La blancheur du dessous apparaît.',
      ]},
      { label: 'Sécurité', title: 'Toxicité et précautions', paragraphs: [
        'Le Bleu de Prusse est considéré comme peu toxique (aucune classification de danger selon le règlement CLP). Cependant, il peut libérer du cyanure d\'hydrogène s\'il est chauffé à très haute température (> 200°C) ou en présence d\'acides forts.',
        'Précautions standard : éviter l\'inhalation de poussière lors du ponçage à sec. Ne pas chauffer. Ne pas ingérer. En utilisation normale, c\'est un pigment très sûr.',
      ]},
      { label: 'Cyanotype', title: 'Bleu de Prusse et cyanotype', paragraphs: [
        'Le Bleu de Prusse est le pigment qui se forme lors du procédé de cyanotype, inventé par John Herschel en 1842. Ce procédé photographique utilise des sels de fer qui, exposés aux UV, se transforment en Bleu de Prusse insoluble.',
        'Les "cyanotypes" sont ces images monochromes bleues caractéristiques, utilisées notamment par les botanistes pour reproduire des planches d\'herbier. La première femme photographe, Anna Atkins, a publié en 1843 un livre entièrement illustré de cyanotypes.',
        'Le Bleu de Prusse est donc à la fois un pigment de peinture, un pigment photographique, et un médicament (il est utilisé comme antidote en cas d\'empoisonnement au thallium ou au césium radioactif). Peu de pigments ont une histoire aussi riche.',
      ]},
    ],
  },
  {
    slug: 'jaune-naples',
    title: 'Jaune de Naples',
    question: 'À quoi sert le Jaune de Naples ?',
    category: 'Pigment',
    tool: 'Peinture à l\'huile',
    duration: '12 min',
    level: 'Intermédiaire',
    summary: 'Jaune chaud et opaque, indispensable pour les carnations délicates et les paysages méditerranéens.',
    tags: ['jaune', 'opaque', 'chair', 'chaud', 'paysage'],
    pigmentCode: 'PY41',
    swatch: ['#f4e8c1', '#edd99a', '#e0c472', '#d4a847', '#c29235'],
    sections: [
      { label: 'Origine', title: 'Un jaune historique', paragraphs: ['Le véritable Jaune de Naples (PY41) est un antimoniate de plomb utilisé depuis l\'Antiquité. On le trouve dans les fresques de Pompéi.', 'Sa teinte chaude et sa texture onctueuse en font un favori des portraitistes. Les versions modernes sans plomb offrent une teinte proche sans toxicité.'] },
      { label: 'Usage', title: 'Peindre avec le Jaune de Naples', paragraphs: ['Excellent pour les ciels de fin de journée, les chairs, les pierres chaudes. Se mélange magnifiquement avec les terres et les ocres.', 'En mélange avec du blanc, il produit des tons chair lumineux incomparables.'] },
    ],
  },
  {
    slug: 'terre-sienne',
    title: 'Terre de Sienne',
    question: 'Comment utiliser la Terre de Sienne ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '11 min',
    level: 'Débutant',
    summary: 'Pigment naturel brun-rouge chaud, tiré de l\'argile toscane. Semi-transparent, idéal pour les glacis chauds et les ombres.',
    tags: ['terre', 'brun', 'chaud', 'naturel', 'glacis'],
    pigmentCode: 'PBr7',
    swatch: ['#8c5a35', '#a0683d', '#b07848', '#c48a55', '#d6a068'],
    sections: [
      { label: 'Origine', title: 'Un pigment toscan', paragraphs: ['La Terre de Sienne tire son nom de Sienne, en Toscane, où cette argile riche en oxyde de fer est extraite depuis la Renaissance.', 'La version naturelle est brun-rouge chaud. La version brûlée est calcinée pour un rouge plus intense et opaque.'] },
      { label: 'Usage', title: 'Polyvalence', paragraphs: ['Semi-transparente, parfaite pour les glacis chauds sur carnations. En mélange avec du blanc, donne des tons chair délicats.', 'Sert aussi pour les ombres de paysages. Compatible avec tous les médiums.'] },
    ],
  },
  {
    slug: 'alizarine',
    title: 'Alizarine cramoisie',
    question: 'Qu\'est-ce que l\'Alizarine cramoisie ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '12 min',
    level: 'Intermédiaire',
    summary: 'Rouge profond et transparent, idéal pour les glacis rouges intenses et les mélanges violets.',
    tags: ['rouge', 'transparent', 'glacis', 'intense', 'violet'],
    pigmentCode: 'PR83',
    swatch: ['#8c1a2a', '#a82835', '#c44048', '#d65a5e', '#e87878'],
    sections: [
      { label: 'Propriétés', title: 'Un rouge de glacis', paragraphs: ['Le L\'Alizarine cramoisie (PR83) est un pigment organique synthétique dérivé de la garance naturelle.', 'Très transparente, idéale pour les glacis rouges profonds. Sa teinte froide tire vers le violet à l\'éclaircissement.'] },
      { label: 'Précautions', title: 'Stabilité', paragraphs: ['L\'alizarine traditionnelle a une tenue à la lumière moyenne. Pour exposition, préférer les alternatives modernes (quinacridone).', 'Très intense : une pointe suffit pour teinter une grande quantité de blanc.'] },
    ],
  },
  {
    slug: 'vert-emeraude',
    title: 'Vert émeraude',
    question: 'Comment utiliser le Vert émeraude ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '10 min',
    level: 'Intermédiaire',
    summary: 'Vert vif, transparent et lumineux. Excellent pour les paysages et les glacis de végétation.',
    tags: ['vert', 'transparent', 'paysage', 'végétation', 'lumineux'],
    pigmentCode: 'PG18',
    swatch: ['#1a4a2a', '#2a6644', '#3d8258', '#55a070', '#72b888'],
    sections: [
      { label: 'Propriétés', title: 'Un vert lumineux', paragraphs: ['Le Vert émeraude (PG18) est un vert transparent intense, très lumineux. Il ne ternit pas en séchant.', 'Sa transparence le rend parfait pour les glacis de paysage : superposé à un fond chaud, il crée des verts vibrants.'] },
      { label: 'Mélanges', title: 'Harmonies', paragraphs: ['Avec du Jaune de Naples : verts printaniers. Avec Terre de Sienne : verts olive chauds. Avec Bleu de Prusse : verts profonds de sous-bois.', 'À l\'aquarelle, c\'est un vert de base indispensable tant il se mélange bien avec tous les autres pigments.'] },
    ],
  },
  {
    slug: 'ocre-jaune',
    title: 'Ocre jaune',
    question: 'À quoi sert l\'Ocre jaune ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '9 min',
    level: 'Débutant',
    summary: 'Pigment naturel jaune-brun, utilisé depuis la Préhistoire. Opaque et économique, base de nombreuses palettes.',
    tags: ['ocre', 'jaune', 'naturel', 'opaque', 'ancien'],
    pigmentCode: 'PY43',
    swatch: ['#d4b870', '#c8a855', '#ba983d', '#a88828', '#947818'],
    sections: [
      { label: 'Histoire', title: 'Un pigment préhistorique', paragraphs: ['L\'ocre jaune est utilisé depuis la Préhistoire (peintures rupestres de Lascaux). C\'est une argile riche en oxyde de fer.', 'Présent dans toutes les traditions picturales, de l\'Égypte ancienne à la Renaissance italienne.'] },
      { label: 'Usage', title: 'Un incontournable', paragraphs: ['Opaque et couvrant, excellent jaune de base. Donne des tons pierre, sable, paille très naturels.', 'Mélangé au Bleu de Prusse, il donne une gamme de verts naturels superbes.'] },
    ],
  },
  {
    slug: 'outremer',
    title: 'Bleu outremer',
    question: 'Qu\'est-ce que le Bleu outremer ?',
    category: 'Pigment',
    tool: 'Tous médiums',
    duration: '13 min',
    level: 'Débutant',
    summary: 'Bleu profond légèrement violacé, synthétisé au XIXe siècle. Plus chaud que le Bleu de Prusse, le bleu le plus polyvalent.',
    tags: ['bleu', 'chaud', 'polyvalent', 'synthétique', 'base'],
    pigmentCode: 'PB29',
    swatch: ['#1a2860', '#2a3d80', '#3d55a0', '#5570bb', '#7288d0'],
    sections: [
      { label: 'Histoire', title: 'Du lapis-lazuli au synthétique', paragraphs: ['L\'outremer véritable était extrait du lapis-lazuli d\'Afghanistan. Au Moyen Âge, il était plus cher que l\'or.', 'En 1826, le chimiste Guimet met au point l\'outremer synthétique (PB29), chimiquement identique mais infiniment moins coûteux.'] },
      { label: 'Usage', title: 'Le bleu universel', paragraphs: ['Plus chaud que le Bleu de Prusse, c\'est le bleu le plus utilisé. Excellent pour les ciels, les ombres, les mélanges verts et violets.', 'Semi-transparent, il fonctionne aussi bien en glacis qu\'en empâtement. Granulométrie fine idéale pour l\'aquarelle.'] },
    ],
  },

  // ===================================================================
  // MÉDIUM (4 fiches)
  // ===================================================================
  {
    slug: 'huile-de-lin',
    title: 'Huile de lin',
    question: 'À quoi sert l\'huile de lin en peinture ?',
    category: 'Médium',
    tool: 'Peinture à l\'huile',
    duration: '15 min',
    level: 'Débutant',
    summary: 'Base du liant classique pour enrichir la pâte, ralentir le séchage et réaliser des glacis transparents.',
    tags: ['liant', 'glacis', 'huile', 'séchage', 'fluidité'],
    sections: [
      { label: 'Rôle', title: 'Liant et médium', paragraphs: ['L\'huile de lin clarifiée sert de liant : elle suspend les pigments, facilite l\'étalement et sèche par oxydation.', 'Plus on en ajoute, plus la peinture devient grasse et lente à sécher.'] },
      { label: 'Pratique', title: 'Bonnes pratiques', paragraphs: ['Ajouter par petites quantités. Respecter la règle du « gras sur maigre » : chaque couche successive contient plus d\'huile.', 'Trop d\'huile provoque des craquelures à long terme.'] },
    ],
  },
  {
    slug: 'essence-terebenthine',
    title: 'Essence de térébenthine',
    question: 'Comment utiliser l\'essence de térébenthine ?',
    category: 'Médium',
    tool: 'Peinture à l\'huile',
    duration: '10 min',
    level: 'Débutant',
    summary: 'Solvant traditionnel pour diluer la peinture à l\'huile, nettoyer les pinceaux et préparer les couches maigres.',
    tags: ['solvant', 'dilution', 'huile', 'nettoyage', 'maigre'],
    sections: [
      { label: 'Rôle', title: 'Solvant et diluant', paragraphs: ['L\'essence de térébenthine est un solvant végétal distillé à partir de la résine de pin. Elle fluidifie la peinture et accélère le séchage.', 'S\'utilise principalement pour les premières couches maigres et le nettoyage des pinceaux.'] },
      { label: 'Sécurité', title: 'Précautions essentielles', paragraphs: ['Toxique par inhalation et contact cutané. Toujours travailler dans un espace bien ventilé. Porter des gants.', 'Alternative : les essences minérales inodores (white spirit désaromatisé), moins agressives pour la santé.'] },
    ],
  },
  {
    slug: 'medium-a-peindre',
    title: 'Médium à peindre',
    question: 'Qu\'est-ce qu\'un médium à peindre ?',
    category: 'Médium',
    tool: 'Peinture à l\'huile',
    duration: '12 min',
    level: 'Intermédiaire',
    summary: 'Mélange prêt à l\'emploi d\'huile, de résine et de solvant. Améliore la fluidité, la transparence et la solidité.',
    tags: ['médium', 'fluide', 'transparence', 'résine'],
    sections: [
      { label: 'Composition', title: 'Que contient un médium à peindre ?', paragraphs: ['Un médium classique combine huile de lin, résine (dammar ou alkyde) et essence. La résine apporte brillance et solidité.', 'Les médiums alkydes modernes accélèrent le séchage tout en conservant une belle transparence.'] },
      { label: 'Usage', title: 'Quand l\'utiliser ?', paragraphs: ['Ajouter progressivement pour respecter le « gras sur maigre ». Un bon médium améliore l\'accroche entre les couches.'] },
    ],
  },
  {
    slug: 'vernis-final',
    title: 'Vernis final',
    question: 'Comment vernir un tableau terminé ?',
    category: 'Médium',
    tool: 'Peinture à l\'huile',
    duration: '14 min',
    level: 'Intermédiaire',
    summary: 'Couche protectrice appliquée sur tableau sec. Protège des UV, de la poussière et unifie la brillance.',
    tags: ['vernis', 'protection', 'finition', 'brillance', 'UV'],
    sections: [
      { label: 'Rôle', title: 'Pourquoi vernir ?', paragraphs: ['Le vernis final protège des poussières, des UV et de l\'humidité. Il unifie le fini de surface (mat, satiné ou brillant).', 'Un tableau à l\'huile doit sécher 6 à 12 mois avant d\'être verni, pour permettre l\'oxydation complète.'] },
      { label: 'Application', title: 'Comment vernir', paragraphs: ['Appliquer en couche fine et régulière avec un pinceau large et doux. Environnement sans poussière.', 'Les vernis modernes à base de résine acrylique sont réversibles : on peut les retirer pour restauration.'] },
    ],
  },

  // ===================================================================
  // SUPPORT (4 fiches)
  // ===================================================================
  {
    slug: 'gesso-acrylique',
    title: 'Gesso acrylique',
    question: 'Comment préparer une toile avec du gesso ?',
    category: 'Support',
    tool: 'Préparation de toile',
    duration: '20 min',
    level: 'Débutant',
    summary: 'Sous-couche blanche pour uniformiser l\'absorption et améliorer l\'accroche sur toile, bois ou papier.',
    tags: ['apprêt', 'toile', 'fond', 'préparation', 'blanc'],
    sections: [
      { label: 'Rôle', title: 'Pourquoi apprêter ?', paragraphs: ['Le gesso acrylique crée une barrière entre le support et la peinture. Il empêche l\'huile de dégrader les fibres.', 'Il offre une surface blanche légèrement absorbante qui améliore l\'accroche et la luminosité des couleurs.'] },
      { label: 'Application', title: 'Poser le gesso', paragraphs: ['Appliquer 2 à 3 couches croisées (horizontal puis vertical). Poncer légèrement entre chaque couche.', 'Pour une surface ultra-lisse, poncer la dernière couche au papier 400. Pour garder du grain, passer un chiffon humide.'] },
    ],
  },
  {
    slug: 'imprimature',
    title: 'Imprimature',
    question: 'Qu\'est-ce qu\'une imprimature ?',
    category: 'Support',
    tool: 'Ébauche',
    duration: '25 min',
    level: 'Intermédiaire',
    summary: 'Teinte de fond colorée posée sur le gesso. Établit une valeur moyenne guidant les ombres et lumières.',
    tags: ['fond', 'valeur', 'croquis', 'ébauche', 'ton'],
    sections: [
      { label: 'Principe', title: 'Valeur moyenne', paragraphs: ['L\'imprimature est une couche de couleur diluée posée sur le gesso sec. Elle établit une valeur moyenne.', 'Les zones laissées visibles deviennent des demi-teintes. Les rehauts et ombres se posent par-dessus.'] },
      { label: 'Pratique', title: 'Poser l\'imprimature', paragraphs: ['Choisir une teinte selon l\'ambiance : Terre de Sienne (chaud), gris neutre (froid), ocre (doré).', 'Essuyer les zones lumineuses avec un chiffon avant séchage pour guider la composition.'] },
    ],
  },
  {
    slug: 'toile-lin-vs-coton',
    title: 'Toile : lin vs coton',
    question: 'Quelle toile choisir : lin ou coton ?',
    category: 'Support',
    tool: 'Choix du support',
    duration: '9 min',
    level: 'Débutant',
    summary: 'Comparaison des deux principaux supports textiles : résistance, texture, prix et durabilité.',
    tags: ['toile', 'lin', 'coton', 'support', 'textile'],
    sections: [
      { label: 'Le lin', title: 'Noble et résistant', paragraphs: ['Fibre traditionnelle de la peinture à l\'huile. Très résistant, supporte les empâtements lourds et les variations d\'humidité.', 'Texture naturelle irrégulière qui donne du caractère. Prix élevé mais durée de vie exceptionnelle.'] },
      { label: 'Le coton', title: 'Économique et polyvalent', paragraphs: ['Plus abordable, surface régulière idéale pour les débutants. Absorbe davantage, convient bien à l\'acrylique.', 'Moins résistant sur la durée. Pour travaux destinés à durer, préférer un fort grammage (≥ 400 g/m²).'] },
    ],
  },
  {
    slug: 'papier-aquarelle',
    title: 'Papier aquarelle',
    question: 'Comment choisir son papier aquarelle ?',
    category: 'Support',
    tool: 'Aquarelle',
    duration: '10 min',
    level: 'Débutant',
    summary: 'Guide de choix : grammage, grain et composition pour maîtriser l\'eau et la diffusion des pigments.',
    tags: ['papier', 'aquarelle', 'grain', 'grammage', 'eau'],
    sections: [
      { label: 'Grammage', title: 'L\'épaisseur compte', paragraphs: ['Minimum 200 g/m². Le 300 g/m² est le standard professionnel. Au-delà pour techniques très humides.', 'En dessous de 200 g/m², le papier gondole et se déforme.'] },
      { label: 'Grain', title: 'Finition de surface', paragraphs: ['Grain fin (hot press) : lisse, idéal pour les détails précis.', 'Grain torchon (cold press) : texturé, le plus polyvalent. Grain rugueux : effets expressifs granuleux.'] },
    ],
  },

  // ===================================================================
  // SÉCURITÉ (2 fiches)
  // ===================================================================
  {
    slug: 'toxicite-pigments',
    title: 'Toxicité des pigments',
    question: 'Quels pigments sont toxiques et comment s\'en protéger ?',
    category: 'Sécurité',
    tool: 'Atelier',
    duration: '16 min',
    level: 'Débutant',
    summary: 'Guide des pigments toxiques (plomb, cadmium, cobalt) et mesures de protection indispensables en atelier.',
    tags: ['toxicité', 'sécurité', 'plomb', 'cadmium', 'protection'],
    sections: [
      { label: 'Pigments à risque', title: 'Les pigments toxiques', paragraphs: ['Blanc de plomb (PW1) : neurotoxique, interdit dans l\'UE sauf restauration. Cadmiums (rouge PR108, jaune PY35) : cancérigènes par inhalation.', 'Cobalt (bleu PB28, turquoise PG50) : toxique par ingestion et inhalation.'] },
      { label: 'Protection', title: 'Mesures de sécurité', paragraphs: ['Travailler dans un local ventilé. Porter des gants en nitrile. Ne pas manger, boire ou fumer en peignant.', 'Pour le ponçage : masque FFP2 minimum, aspiration à la source. Stocker les pigments hors de portée des enfants.'] },
    ],
  },
  {
    slug: 'ventilation-atelier',
    title: 'Ventilation de l\'atelier',
    question: 'Comment bien ventiler son atelier de peinture ?',
    category: 'Sécurité',
    tool: 'Atelier',
    duration: '8 min',
    level: 'Débutant',
    summary: 'Conseils pour évacuer les solvants, renouveler l\'air et protéger sa santé respiratoire.',
    tags: ['ventilation', 'atelier', 'solvant', 'air', 'santé'],
    sections: [
      { label: 'Enjeux', title: 'Pourquoi ventiler ?', paragraphs: ['Les solvants émettent des COV irritants. Un air insuffisamment renouvelé expose à des maux de tête et des pathologies respiratoires.'] },
      { label: 'Solutions', title: 'Bien ventiler', paragraphs: ['Deux ouvertures opposées pour un courant d\'air traversant. Ouvrir 15 min toutes les 2 heures.', 'En complément : extracteur d\'air ou VMC. Pour ateliers pro : hotte aspirante au-dessus de la zone de travail.'] },
    ],
  },

  // ===================================================================
  // OUTIL (2 fiches)
  // ===================================================================
  {
    slug: 'pinceaux',
    title: 'Les pinceaux',
    question: 'Comment choisir ses pinceaux de peinture ?',
    category: 'Outil',
    tool: 'Tous médiums',
    duration: '14 min',
    level: 'Débutant',
    summary: 'Guide complet des formes, tailles et types de poils : plat, rond, usé bombé, éventail et spalter.',
    tags: ['pinceau', 'outil', 'poil', 'forme', 'entretien'],
    sections: [
      { label: 'Formes', title: 'Quelle forme pour quel usage ?', paragraphs: ['Plat : couvrance rapide, bords nets. Rond pointu : détails et contours. Usé bombé (filbert) : formes organiques.', 'Éventail : effets de texture, fondus. Spalter : très large (5 à 15 cm), pour grands fonds et lavis.'] },
      { label: 'Poils', title: 'Naturels ou synthétiques ?', paragraphs: ['Martre : nec plus ultra pour l\'aquarelle, rétention d\'eau et pointe parfaite. Soie de porc : ferme pour l\'huile épaisse.', 'Synthétique : polyvalent, économique. Les fibres modernes imitent très bien la martre à moindre coût.'] },
      { label: 'Entretien', title: 'Faire durer ses pinceaux', paragraphs: ['Nettoyer immédiatement après usage. Ne jamais laisser tremper dans le solvant (déforme la pointe).', 'Sécher à plat ou tête en bas. Les stocker debout, poils vers le haut.'] },
    ],
  },
  {
    slug: 'couteau-a-peindre',
    title: 'Le couteau à peindre',
    question: 'Comment utiliser un couteau à peindre ?',
    category: 'Outil',
    tool: 'Peinture à l\'huile / Acrylique',
    duration: '8 min',
    level: 'Intermédiaire',
    summary: 'Outil en acier flexible pour appliquer la peinture en épaisseur, créer des textures et gratter la surface.',
    tags: ['couteau', 'outil', 'texture', 'impasto', 'empâtement'],
    sections: [
      { label: 'Formes', title: 'Les types de couteaux', paragraphs: ['Couteau pointe (losange) : le plus polyvalent. Couteau spatule : pour les grandes surfaces. Couteau palette : mélange des couleurs.', 'Les lames flexibles permettent des effets de courbure. Les lames rigides conviennent aux empâtements droits.'] },
      { label: 'Techniques', title: 'Peindre au couteau', paragraphs: ['Prendre la couleur sur le bout de la lame et l\'étaler comme du beurre. Varier la pression pour moduler l\'épaisseur.', 'Pour gratter (sgraffito), utiliser le bord de la lame sur une couche encore fraîche pour révéler la couleur sous-jacente.'] },
    ],
  },
]

export const roadmaps: Roadmap[] = [
  {
    slug: 'initiation-huile',
    title: 'Initiation à la peinture à l\'huile',
    audience: 'Débutant curieux',
    duration: '5 semaines',
    level: 'Progressif',
    summary: 'Un parcours pour apprendre le matériel, les couches et les temps de séchage.',
    steps: [
      { title: 'Matériel et sécurité', description: 'Découvrir les outils essentiels, les solvants et les règles de base de l\'atelier.', ficheSlugs: ['pinceaux', 'ventilation-atelier', 'toxicite-pigments'] },
      { title: 'Préparer le support', description: 'Gesso, ponçage et imprimature pour un fond prêt.', ficheSlugs: ['gesso-acrylique', 'imprimature'] },
      { title: 'Couleurs et valeurs', description: 'Construire un tableau avec palette limitée.', ficheSlugs: ['blanc-titane', 'ocre-jaune', 'terre-sienne', 'imprimature'] },
      { title: 'Glacis et empâtements', description: 'Maîtriser les couches transparentes et les médiums.', ficheSlugs: ['glacis', 'huile-de-lin', 'impasto', 'medium-a-peindre'] },
    ],
  },
  {
    slug: 'fondations-acrylique',
    title: 'Fondations de l\'acrylique',
    audience: 'Créatif polyvalent',
    duration: '3 semaines',
    level: 'Rapide',
    summary: 'Comprendre les textures, les médiums et la construction des masses colorées.',
    steps: [
      { title: 'Supports et apprêts', description: 'Choisir et préparer le support adapté.', ficheSlugs: ['gesso-acrylique', 'toile-lin-vs-coton'] },
      { title: 'Gestes et séchage', description: 'Adapter les gestes à la sécheresse rapide.', ficheSlugs: ['alla-prima', 'imprimature'] },
      { title: 'Effets de matière', description: 'Textures, empâtements et médiums.', ficheSlugs: ['impasto', 'blanc-titane', 'couteau-a-peindre'] },
      { title: 'Vernis et finitions', description: 'Protéger et unifier la surface.', ficheSlugs: ['vernis-final'] },
    ],
  },
  {
    slug: 'maitrise-pigments',
    title: 'Maîtrise des pigments',
    audience: 'Peintre intermédiaire',
    duration: '4 semaines',
    level: 'Progressif',
    summary: 'Parcours colorimétrique pour comprendre les pigments : opacité, transparence, mélanges et sécurité.',
    steps: [
      { title: 'Les bases : blanc et terres', description: 'Commencer avec les pigments les plus fondamentaux.', ficheSlugs: ['blanc-titane', 'ocre-jaune', 'terre-sienne'] },
      { title: 'Les bleus', description: 'Explorer la gamme des bleus.', ficheSlugs: ['bleu-de-prusse', 'outremer'] },
      { title: 'Les rouges et jaunes', description: 'Compléter la palette.', ficheSlugs: ['jaune-naples', 'alizarine'] },
      { title: 'Sécurité pigmentaire', description: 'Connaître les risques et se protéger.', ficheSlugs: ['toxicite-pigments', 'ventilation-atelier'] },
    ],
  },
  {
    slug: 'techniques-glacis',
    title: 'Techniques de glacis avancées',
    audience: 'Peintre confirmé',
    duration: '6 semaines',
    level: 'Avancé',
    summary: 'Perfectionner l\'art du glacis : transparence, superposition et profondeur optique.',
    steps: [
      { title: 'Principe du glacis', description: 'Comprendre la physique de la transparence.', ficheSlugs: ['glacis', 'huile-de-lin', 'medium-a-peindre'] },
      { title: 'Grisaille préparatoire', description: 'Établir les valeurs en monochrome.', ficheSlugs: ['grisaille', 'imprimature'] },
      { title: 'Superposition des couleurs', description: 'Jouer avec les pigments transparents.', ficheSlugs: ['alizarine', 'bleu-de-prusse', 'vert-emeraude'] },
      { title: 'Finition et vernis', description: 'Protéger l\'œuvre et sublimer les glacis.', ficheSlugs: ['vernis-final'] },
    ],
  },
]

export const themeVariants: ThemeVariant[] = [
  { slug: 'terre', name: 'Terre', description: 'Palette chaude, contraste brun et lumière ivoire.', background: 'linear-gradient(135deg, #36261f 0%, #7d5534 100%)', accent: '#d8b089' },
  { slug: 'nocturne', name: 'Nocturne', description: 'Ambiance profonde, presque muséale.', background: 'linear-gradient(135deg, #111218 0%, #2f3d4f 100%)', accent: '#d9cdb7' },
  { slug: 'neo', name: 'Neo', description: 'Contrastes nets, surfaces claires.', background: 'linear-gradient(135deg, #f3efe9 0%, #d8c6aa 100%)', accent: '#4a4a43' },
  { slug: 'brutalisme', name: 'Brutalisme', description: 'Grille dense, blocs francs.', background: 'linear-gradient(135deg, #dad4c8 0%, #a0886d 100%)', accent: '#1f1813' },
]

export function findFiche(slug: string | undefined) {
  return fiches.find((fiche) => fiche.slug === slug) ?? fiches[0]
}

export function findRoadmap(slug: string | undefined) {
  return roadmaps.find((roadmap) => roadmap.slug === slug) ?? roadmaps[0]
}

export function countRoadmapFiches(roadmap: Roadmap) {
  const slugs = new Set<string>()
  roadmap.steps.forEach((step) => step.ficheSlugs.forEach((s) => slugs.add(s)))
  return slugs.size
}

export function findRoadmapsForFiche(ficheSlug: string) {
  return roadmaps
    .map((roadmap) => {
      const stepIndex = roadmap.steps.findIndex((step) => step.ficheSlugs.includes(ficheSlug))
      if (stepIndex === -1) return null
      return { roadmap, stepIndex, step: roadmap.steps[stepIndex] }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export function getRelatedFiches(fiche: Fiche, limit = 3) {
  return fiches.filter((item) => item.slug !== fiche.slug && item.category === fiche.category).slice(0, limit)
}
