export interface Project {
  id: string
  title: string
  subtitle: string
  year: string
  category: string
  tags: string[]
  description: string
  longDescription: string
  coverImage: string
  images: string[]
  color: string
  index: string
}

export interface LabProject {
  id: string
  title: string
  subtitle: string
  year: string
  category: string
  tags: string[]
  description: string
  longDescription?: string
  coverImage: string
  images?: string[]
  link?: string
}

export const mainProjects: Project[] = [
  {
    id: 'neuroportals',
    title: 'NeuroPortals',
    subtitle: 'Brain-Computer Interface Installation',
    year: '2024',
    category: 'Interactive Installation',
    tags: ['BCI', 'TouchDesigner', 'Fabrication', 'Interactive'],
    description: 'An immersive installation exploring neural signals as a medium for spatial interaction — two portals that respond to the visitor\'s brainwaves.',
    longDescription: 'NeuroPortals is an interactive installation that uses EEG headsets to read visitors\' neural signals in real time, translating them into light and motion through two large fabricated portal structures. Built with TouchDesigner for visual processing and custom hardware for the physical response system.',
    coverImage: '/images/NeuroPortals/neuroIntro.png',
    images: [
      '/images/NeuroPortals/neuroIntro.png',
      '/images/NeuroPortals/porteL.png',
      '/images/NeuroPortals/porteR.png',
      '/images/NeuroPortals/porteL2.png',
      '/images/NeuroPortals/porteR2.png',
      '/images/NeuroPortals/TouchDesigner1.png',
      '/images/NeuroPortals/TouchDesigner2.png',
      '/images/NeuroPortals/fab1.JPG',
      '/images/NeuroPortals/fab2.JPG',
      '/images/NeuroPortals/Image_vision.png',
      '/images/NeuroPortals/proto.png',
    ],
    color: '#0047FF',
    index: '01',
  },
  {
    id: 'elastup',
    title: 'Elastup',
    subtitle: 'Holographic Wearable Prototype',
    year: '2024',
    category: 'Wearable Technology',
    tags: ['Industrial Design', 'Holography', 'Prototype', 'Wearable'],
    description: 'A wearable device that projects holographic interfaces from the wrist — merging fashion and functional AR into a single garment-integrated system.',
    longDescription: 'Elastup is a wearable prototype exploring the intersection of fashion and augmented reality. The device integrates holographic projection technology into an elastic band worn on the wrist, projecting interactive interfaces into the space around the user\'s hand.',
    coverImage: '/images/Elastup/Elastup1.png',
    images: [
      '/images/Elastup/ElastupHolo.png',
      '/images/Elastup/Elastup1.png',
      '/images/Elastup/Elastup2.JPG',
      '/images/Elastup/design1.png',
      '/images/Elastup/Note1.png',
      '/images/Elastup/Colors.JPG',
      '/images/Elastup/Poster1.jpg',
      '/images/Elastup/Poster2.jpg',
      '/images/Elastup/Ipad1.JPG',
      '/images/Elastup/Recap.jpg',
    ],
    color: '#0047FF',
    index: '02',
  },
  {
    id: 'sakekagami',
    title: 'Sakekagami',
    subtitle: 'Interactive Sake Mirror Installation',
    year: '2024',
    category: 'Installation Design',
    tags: ['3D Modeling', 'Fabrication', 'Physical Computing', 'Craft'],
    description: 'A traditional masu cup reimagined as an interactive mirror installation — combining Japanese craft heritage with embedded electronics and light.',
    longDescription: 'Sakekagami (酒鏡) is a pair of connected masu cups that use real-time AI image diffusion to turn a shared drink into a mirror moment — letting two people see each other refracted across distance, somewhere between reflection and presence.',
    coverImage: '/images/Sakekagami/Poster.JPG',
    images: [
      '/images/Sakekagami/sakekagamiPoster.png',
      '/images/Sakekagami/MasuB1.JPG',
      '/images/Sakekagami/MasuB2.JPG',
      '/images/Sakekagami/MasuB_Y.JPG',
      '/images/Sakekagami/sketch1.png',
      '/images/Sakekagami/sketch2.png',
      '/images/Sakekagami/sketch3.png',
      '/images/Sakekagami/Poster.JPG',
    ],
    color: '#0047FF',
    index: '03',
  },
  {
    id: 'terubot',
    title: 'Terubot',
    subtitle: 'Expressive Robot Companion',
    year: '2024',
    category: 'Robotics',
    tags: ['Robotics', 'AI', 'Fabrication', 'Interaction Design'],
    description: 'A soft expressive robot inspired by the Japanese teru teru bozu — designed to communicate emotion through light, sound, and physical movement.',
    longDescription: 'Terubot is an expressive companion robot inspired by the traditional Japanese teru teru bozu paper doll. The robot uses servo motors, embedded LEDs, and a custom AI model to generate expressive behaviors in response to its environment and the people it interacts with.',
    coverImage: '/images/Terubot/TeruBot_App.jpeg',
    images: [
      '/images/Terubot/terubotposter2.png',
      '/images/Terubot/TERUTERUBOZU.png',
      '/images/Terubot/happy1.JPG',
      '/images/Terubot/TeruBot_App.jpeg',
      '/images/Terubot/application.png',
      '/images/Terubot/mapping.png',
      '/images/Terubot/terubot_mapping.png',
      '/images/Terubot/terubot1.jpeg',
      '/images/Terubot/DSCF7529.JPG',
    ],
    color: '#0047FF',
    index: '04',
  },
]

export const labProjects: LabProject[] = [
  {
    id: '3d-modeling',
    title: '3D Modeling',
    subtitle: 'HondaJet Recreation',
    year: '2024',
    category: '3D / CAD',
    tags: ['Blender', '3D', 'Industrial'],
    description: 'High-fidelity 3D recreation of the HondaJet aircraft, modeled from technical drawings with full detail.',
    longDescription: 'A personal challenge to push my Blender skills — I recreated the HondaJet from scratch using official technical drawings and photo references. The project focused on surface modeling, material shading, and photorealistic rendering. Every panel line, engine nacelle, and winglet was modeled with accuracy in mind.',
    coverImage: '/images/3D/HondaJet3D1.png',
    images: [
      '/images/3D/HondaJet3D1.png',
      '/images/3D/HondaJet3D2.png',
      '/images/3D/HondaJet3D3.png',
      '/images/3D/HondaJet3D4.png',
      '/images/3D/HondaJet3D5.png',
      '/images/3D/HondaJet3D6.png',
    ],
  },
  {
    id: 'antenna',
    title: 'Antenna',
    subtitle: 'Signal Art Installation',
    year: '2024',
    category: 'Physical Computing',
    tags: ['Electronics', 'Art', 'Signal'],
    description: 'A physical computing experiment using antennas as expressive instruments — translating electromagnetic signals into light and audio.',
    longDescription: 'Antenna explores the invisible landscape of electromagnetic signals that surrounds us. Custom-built antenna arrays capture ambient radio frequencies and map them to light intensity and audio synthesis in real time. The installation makes the invisible tangible — a room where the air itself becomes the instrument.',
    coverImage: '/images/Antenna/Antenna.png',
    images: [
      '/images/Antenna/Antenna.png',
      '/images/Antenna/Antenna1.png',
      '/images/Antenna/Antenna2.png',
      '/images/Antenna/Antenna3.jpg',
      '/images/Antenna/Antenna4.jpg',
      '/images/Antenna/Antenna5.png',
    ],
  },
  {
    id: 'arduino-laser',
    title: 'Arduino Laser Wall',
    subtitle: 'Physical Game Installation',
    year: '2023',
    category: 'Physical Computing',
    tags: ['Arduino', 'Game', 'Laser'],
    description: 'An interactive laser wall game built with Arduino — players dodge and navigate through dynamic laser patterns.',
    longDescription: 'Built as a playful experiment in physical gaming, this laser wall uses an Arduino-controlled grid of laser emitters and photodetectors to create a body-scale interactive game. Players navigate through shifting laser patterns using full-body movement. The system tracks interruptions in real time and generates increasingly complex patterns.',
    coverImage: '/images/Arduino/laser1.png',
    images: [
      '/images/Arduino/laser1.png',
      '/images/Arduino/laser2.png',
      '/images/Arduino/laser3.png',
      '/images/Arduino/laser4.png',
      '/images/Arduino/wiring.png',
      '/images/Arduino/board.jpg',
    ],
  },
  {
    id: 'mnist',
    title: 'MNIST Fighter',
    subtitle: 'ML Fighting Game',
    year: '2023',
    category: 'Machine Learning',
    tags: ['ML', 'Game', 'Python'],
    description: 'A fighting game controlled by hand-drawn digits — MNIST classifier translates your drawings into character moves.',
    longDescription: 'MNIST Fighter is a two-player fighting game where each move is triggered by drawing a digit (0–9) on a touch surface. A custom-trained MNIST classifier reads the drawing in real time and maps it to a specific attack, block, or special move. The project merges machine learning with physical play — drawing becomes fighting.',
    coverImage: '/images/Mnist/mnist1.png',
    images: [
      '/images/Mnist/mnist1.png',
      '/images/Arduino/RyuVsLucas.png',
      '/images/Arduino/characters.png',
    ],
  },
  {
    id: 'touchdesigner',
    title: 'AudioSakura',
    subtitle: 'Reactive Visual System',
    year: '2024',
    category: 'Generative Art',
    tags: ['TouchDesigner', 'Audio', 'Generative'],
    description: 'A TouchDesigner audio-reactive visual system — sakura petals bloom and scatter in response to music.',
    longDescription: 'AudioSakura is a real-time generative visual system built in TouchDesigner. Audio input is analysed for frequency, amplitude, and transients — each parameter controls a different aspect of a particle system representing sakura blossoms. Quiet passages produce slow, drifting petals; loud transients trigger explosive blooms.',
    coverImage: '/images/Touchdesigner/TDSakura.png',
    images: ['/images/Touchdesigner/TDSakura.png'],
  },
  {
    id: 'photography',
    title: 'Photography',
    subtitle: 'Travel & Street',
    year: '2022–2024',
    category: 'Photography',
    tags: ['Film', 'Street', 'Travel'],
    description: 'A visual diary — street photography across Tokyo, Barcelona, Busan, and beyond.',
    longDescription: 'A collection of photographs taken during travels across Asia and Europe. The work focuses on light, texture, and fleeting human moments — shot on a mix of digital and film. Cities covered include Tokyo, Kyoto, Busan, Barcelona, and Paris.',
    coverImage: '/images/photo/fuji.jpg',
    images: [
      '/images/photo/fuji.jpg',
      '/images/photo/busan.JPG',
      '/images/photo/barcelone.JPG',
      '/images/photo/couvent.JPG',
      '/images/photo/dune.JPG',
      '/images/photo/etoiles.JPG',
      '/images/photo/lune.JPG',
      '/images/photo/grue.JPG',
      '/images/photo/orange.JPG',
      '/images/photo/temple1.jpg',
    ],
  },
  {
    id: 'portfolio-v1',
    title: 'Portfolio V1',
    subtitle: 'Previous Website',
    year: '2023',
    category: 'Web Design',
    tags: ['Web', 'Design', 'React'],
    description: 'The first iteration of my personal portfolio — exploring editorial layouts and motion design.',
    longDescription: 'The first version of my portfolio was built to explore editorial web design and React animation. It served as a testing ground for layout experiments, typographic hierarchies, and page transitions before evolving into the current version.',
    coverImage: '/images/portfolio/home.png',
    images: [
      '/images/portfolio/home.png',
      '/images/portfolio/projects.png',
      '/images/portfolio/myLab.png',
    ],
  },
  {
    id: 'cv',
    title: 'Resume',
    subtitle: 'Curriculum Vitae',
    year: '2024',
    category: 'Document',
    tags: ['Design', 'Typography'],
    description: 'My CV — available as a downloadable PDF.',
    longDescription: 'A clean, typographically considered CV designed from scratch. Available as a downloadable PDF.',
    coverImage: '/images/photo/photo1.png',
    images: ['/images/photo/photo1.png'],
    link: '/fichier/CV_RyuOSADA.pdf',
  },
]
