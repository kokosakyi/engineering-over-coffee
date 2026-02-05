import bookData from ".././data/bookData";
import InteractiveImage from ".././data/interactiveImage";
import eitIcon from "../../../assets/images/eit.png";
import pengIcon from "../../../assets/images/peng.png";

const getProfileIcon = (speaker: string): string | null => {
    const lowerSpeaker = speaker.toLowerCase();
    if (lowerSpeaker.includes('alex')) {
        return eitIcon;
    }
    if (lowerSpeaker.includes('jordan')) {
        return pengIcon;
    }
    return null;
};

const DialogueLine = ({ speaker, children }: { speaker: string; children: React.ReactNode }) => {
    const profileIcon = getProfileIcon(speaker);

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
                {profileIcon && (
                    <img
                        src={profileIcon}
                        alt={speaker}
                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                )}
                <div className="font-medium text-gray-900 dark:text-gray-100">{speaker}</div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-gray-200 dark:border-gray-700 text-justify">
                {children}
            </div>
        </div>
    );
};

const formatDialogue = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const elements: React.ReactNode[] = [];
    let currentSpeaker: string | null = null;
    let currentContent: string[] = [];

    const flushCurrent = () => {
        if (currentSpeaker && currentContent.length > 0) {
            const content = currentContent.join(' ').trim();
            if (content) {
                elements.push(
                    <DialogueLine key={elements.length} speaker={currentSpeaker}>
                        {formatText(content)}
                    </DialogueLine>
                );
            }
            currentContent = [];
        }
    };

    for (const line of lines) {
        const speakerMatch = line.match(/^\*\*(.+?):\*\*(.+)$/);
        if (speakerMatch) {
            flushCurrent();
            currentSpeaker = speakerMatch[1].trim();
            const content = speakerMatch[2].trim();
            if (content) {
                currentContent.push(content);
            }
        } else if (line.match(/^###/)) {
            flushCurrent();
            const heading = line.replace(/^###\s*/, '').trim();
            elements.push(
                <h2 key={elements.length} className="text-2xl font-medium text-gray-900 dark:text-gray-100 mt-12 mb-6">
                    {heading}
                </h2>
            );
        } else if (line.trim().startsWith('-')) {
            flushCurrent();
            const listItem = line.replace(/^-\s*/, '').trim();
            elements.push(
                <div key={elements.length} className="ml-4 mb-2 text-gray-700 dark:text-gray-300">
                    {formatText(listItem)}
                </div>
            );
        } else if (currentSpeaker && line.trim()) {
            currentContent.push(line.trim());
        } else if (line.trim()) {
            flushCurrent();
            elements.push(
                <p key={elements.length} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatText(line.trim())}
                </p>
            );
        }
    }
    flushCurrent();

    return elements;
};

const formatText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-semibold text-gray-900 dark:text-gray-100">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
};

export const Introduction = () => {
    const firstDialogue = `**Alex:** Jordan, imagine someone picks up this book in a Winnipeg coffee shop on a -30°C January morning. They're a junior designer, a builder, an inspector, or maybe just a homeowner who wants to understand why their house doesn't collapse under two feet of snow. What's the first thing we tell them?

**Jordan:** We tell them this isn't another dry code handbook or engineering textbook full of factored resistances and deflection equations (though we'll get to those when needed). This is a conversation. Two engineers—one still learning the ropes, one who's been framing houses and fighting frost heave for decades—sitting at a corner table, sketching on napkins, pulling up code sections on phones, and building a house together one chapter at a time.

The book you're holding is called *Brewed Blueprints: Casual Chats on Canadian Wood Framing – A Guide to Residential Light-Frame Design per CSA O86 and NBC 2020*. It's written for anyone who works with (or lives in) wood-frame houses in Canada, especially in places like Manitoba where the ground freezes deep, the snow piles high, and the wind can howl like it's personal.

**Alex:** So who is this really for?

**Jordan:** 
- Junior structural engineers and technologists who just passed their exams and now stare at residential plans wondering why everything looks different from steel or concrete.
- Carpenters, framers, and site supervisors who want to know *why* the code says what it says, not just *what* it says.
- Building inspectors and plan reviewers who need a quick, practical refresher when a builder asks, “Can we do 24-inch stud spacing here?”
- Homeowners, DIY enthusiasts, or renovators who want to speak the same language as their contractor or engineer.
- Anyone curious about how a typical Canadian house stands up—without needing a PhD in timber engineering.

We assume you have basic familiarity with construction drawings and some exposure to the National Building Code of Canada (NBC). If you're brand new, don't worry—we'll explain terms as we go, and we'll keep the math light until we need it.

**Alex:** Why focus on NBC 2020 and CSA O86?

**Jordan:** Because those are the documents that actually govern wood design in Canada right now (as of 2026). NBC 2020 Part 9 gives us the prescriptive path—the span tables, nailing schedules, braced-wall requirements—for most houses up to three storeys and 600 m² per floor. It's fast, reliable, and covers the vast majority of detached homes, duplexes, and small multi-family buildings in Winnipeg, Brandon, Thompson, or anywhere else in the prairies.

But when a house gets taller, wider, has big open spans, irregular shapes, or heavy snow loads (hello, northern Manitoba), Part 9 says “engineer it per Part 4.” That's where CSA O86: Engineering Design in Wood comes in—the national standard for limit-states design of sawn lumber, glulam, SCL, CLT, connections, and light-frame shearwalls. We'll show you exactly when and how to bridge from Part 9's simplicity to O86's precision.

**Alex:** And why the coffee-shop format?

**Jordan:** Because real learning happens in conversations, not lectures. We've all sat in meetings or on job sites asking “Wait, why do we need collar ties?” or “What's the difference between jack and king studs again?” This book recreates those moments. You'll hear me (the principal) explain things to Alex (the junior), ask questions back, poke holes in assumptions, and circle back when something doesn't click. It's how most of us actually learned this stuff—over coffee, on the tailgate of a truck, or during a site walkthrough.

We'll reference code sections directly (e.g., NBC 9.23.4.2 for joist spans, CSA O86 Clause 7.3 for LVL), include quick checklists for Part 9 compliance, and show real photos of framing in progress—because no amount of text beats seeing a proper birdsmouth cut or 6/12 nailing pattern.

**Alex:** What's the journey look like?

**Jordan:** We build the house from the ground up, chapter by chapter:
1. Foundations and mudsills  
2. Floor framing  
3. Wall framing  
4. Sheathing and shear  
5. Ceiling joists, rafters, and ridges  
6. Trusses  
7. Engineered wood products  
8. Mass timber basics  
9. Connections and fasteners  
10. Loads, limits, and when Part 4 takes over  
11. Fire, durability, and preservation  
12. Case studies and putting it all together

By the end, you'll understand the full load path—from snow on the roof to the concrete footing—and know when to trust Part 9 tables versus when to break out the O86 design values.

**Alex:** Final thought before we dive in?

**Jordan:** Wood is forgiving, sustainable, and still the dominant material for Canadian housing. But it only works when we respect the physics, the climate, and the code. This book is our way of passing on what we've learned—one cup, one question, one chapter at a time.

So grab your coffee (or tea, no judgment), pull up a chair, and let's start building.

**Alex:** Cheers to that. First round's on me.

**Jordan:** Deal. Turn the page—we've got a house to frame.

**Alex:** Jordan, that feels like the perfect opener. Sets the tone, welcomes everyone, and tees up the whole book. Ready for Chapter 6 on trusses whenever you are.

**Jordan:** Let's do it next time. This is shaping up to be something people will actually read cover to cover. Your round again?`;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-8">Introduction</h1>
            <div className="space-y-4">
                {formatDialogue(firstDialogue)}
            </div>
            {bookData.chapters[1].hasImage && bookData.chapters[1].imageUrl && (
                <div className="my-12">
                    <InteractiveImage imageUrl={bookData.chapters[1].imageUrl} hotspots={bookData.chapters[1].hotspots || []} />
                </div>
            )}

        </div>
    )
}
