interface Hotspot {
    id: number;
    x: number;
    y: number;
    title: string;
    description: string;
}

interface Chapter {
    id: number;
    title: string;
    content: string;
    hasImage: boolean;
    imageUrl?: string;
    hotspots?: Hotspot[];
}

interface BookData {
    title: string;
    chapters: Chapter[];
}

const bookData: BookData = {
    title: 'Timber Book',
    chapters: [
        {
            id: 1,
            title: "Introduction to Ancient Rome",
            content: "Ancient Rome was a civilization that began as a small settlement in central Italy and grew to become one of the largest empires in history.",
            hasImage: false
        },
        {
            id: 2,
            title: "The Roman Forum",
            content: "The Roman Forum was the center of public life in ancient Rome. Here you can explore different buildings and monuments.",
            hasImage: true,
            imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387ceeb;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23e0f6ff;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23sky)' width='800' height='600'/%3E%3Crect x='150' y='350' width='120' height='200' fill='%23c19a6b'/%3E%3Crect x='170' y='370' width='20' height='180' fill='%23d4a574'/%3E%3Crect x='210' y='370' width='20' height='180' fill='%23d4a574'/%3E%3Crect x='250' y='370' width='20' height='180' fill='%23d4a574'/%3E%3Cpolygon points='140,350 280,350 260,320 160,320' fill='%23a0826d'/%3E%3Crect x='420' y='280' width='180' height='100' fill='%23b8956a'/%3E%3Cpath d='M 420 280 L 510 230 L 600 280 Z' fill='%239d7a54'/%3E%3Crect x='480' y='310' width='60' height='70' fill='%23654321'/%3E%3Cellipse cx='650' cy='380' rx='100' ry='120' fill='%23c9b18a'/%3E%3Cellipse cx='650' cy='380' rx='70' ry='90' fill='%23a89968'/%3E%3Cellipse cx='650' cy='380' rx='40' ry='60' fill='%238b7355'/%3E%3Crect x='0' y='550' width='800' height='50' fill='%23d2b48c'/%3E%3Ctext x='400' y='590' font-family='Arial' font-size='24' fill='%23654321' text-anchor='middle'%3ERoman Forum Scene%3C/text%3E%3C/svg%3E",
            hotspots: [
                {
                    id: 1,
                    x: 25,
                    y: 40,
                    title: "Temple of Saturn",
                    description: "One of the oldest temples in Rome, dedicated to the god Saturn. It housed the state treasury."
                },
                {
                    id: 2,
                    x: 60,
                    y: 35,
                    title: "Arch of Septimius Severus",
                    description: "A triumphal arch built in 203 AD to commemorate the victories of Emperor Septimius Severus."
                },
                {
                    id: 3,
                    x: 75,
                    y: 55,
                    title: "The Colosseum",
                    description: "The largest amphitheater ever built, capable of holding 50,000-80,000 spectators."
                }
            ]
        },
        {
            id: 3,
            title: "Roman Architecture",
            content: "Roman architecture is known for its use of arches, vaults, and concrete. These innovations allowed Romans to build structures that still stand today.",
            hasImage: true,
            imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f5f5dc' width='800' height='600'/%3E%3Crect x='100' y='200' width='600' height='350' fill='%23daa520'/%3E%3Crect x='120' y='220' width='100' height='280' fill='%23f4e4c1'/%3E%3Crect x='130' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='160' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='190' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='340' y='220' width='100' height='280' fill='%23f4e4c1'/%3E%3Crect x='350' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='380' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='410' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='560' y='220' width='100' height='280' fill='%23f4e4c1'/%3E%3Crect x='570' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='600' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Crect x='630' y='230' width='20' height='270' fill='%23d4a574'/%3E%3Cpath d='M 250 350 Q 320 280 390 350' fill='none' stroke='%23a0826d' stroke-width='30'/%3E%3Cpath d='M 470 350 Q 540 280 610 350' fill='none' stroke='%23a0826d' stroke-width='30'/%3E%3Crect x='0' y='550' width='800' height='50' fill='%23d2b48c'/%3E%3Ctext x='400' y='590' font-family='Arial' font-size='24' fill='%23654321' text-anchor='middle'%3ERoman Architecture%3C/text%3E%3C/svg%3E",
            hotspots: [
                {
                    id: 1,
                    x: 30,
                    y: 45,
                    title: "Roman Columns",
                    description: "Romans used three main column styles: Doric, Ionic, and Corinthian, with Corinthian being the most ornate."
                },
                {
                    id: 2,
                    x: 70,
                    y: 60,
                    title: "Stone Arches",
                    description: "The arch was a Roman architectural innovation that distributed weight efficiently, allowing for larger structures."
                }
            ]
        },
    ]
}

export default bookData;