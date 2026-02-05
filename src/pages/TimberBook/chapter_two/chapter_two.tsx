
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

export const ChapterTwo = () => {
    const firstDialogue = `**Alex:** Jordan, Chapter 1 felt like the perfect foundation—literally. I'm ready to move up. Let's do Chapter 2 in the same style: Floor Framing – Joists, Beams, and Sheathing. Hit me with the dialogue version, Winnipeg winters in mind, and keep the NBC 2020 Part 9 and CSA O86 references tight.

**Jordan:** You got it, Conrad. Here's how Chapter 2 would read in the book. We're building right on top of that mudsill we just anchored.

### Chapter 2: Framing the Floor – Joists, Beams, and Sheathing

**Alex:** Alright Jordan, mudsill is bolted down, foundation is level, gasket in place. Now we start the floor system. What's the backbone?

**Jordan:** The **floor joists**—those horizontal members that span from foundation wall to foundation wall (or to a central beam), carrying all the live and dead loads of the floor above. In most Winnipeg homes, we're talking 2×10 or 2×12 Douglas Fir-Larch or Spruce-Pine-Fir No. 2 grade lumber, spaced 16 inches on centre.

NBC 2020 Table 9.23.4.2-(1) gives you the prescriptive spans right there—no engineering required for a typical Part 9 house. For example, with 40 psf live load + 10 psf dead (standard residential), a 2×10 SPF at 16" o/c can span up to about 4.57 m (15 ft) for floors. If you need longer, you jump to engineered options—we'll get to those later.

Here are a couple of clear shots showing floor joists being set on the mudsill, with the typical layout:

**Alex:** Nice and tidy. But what if the house is wider than those spans allow?

**Jordan:** That's when you introduce a **support beam** (or girder) running down the middle, perpendicular to the joists. Could be built-up from multiple 2×12s nailed together, or more commonly now, a steel beam or **LVL** (laminated veneer lumber) beam. The beam sits on posts or columns that bear on concrete footings below.

NBC 9.23.8.2 requires beams to be sized per Table 9.23.8.2-(1) or engineered. In CSA O86 terms, you're checking bending moment capacity (fb), shear (fv), and deflection (E-value) under specified loads from NBC Table 9.4.2.1.

**Alex:** Got it. Now how do we close off the perimeter?

**Jordan:** Enter the **rim joist** (or band joist). Same dimension as your floor joists, nailed to the ends of the joists and sitting directly on the mudsill. It boxes everything in, provides lateral bracing, and gives you a solid nailing surface for the exterior wall bottom plate later.

Here you see the rim joist in place, with joist hangers where needed for dropped headers:

**Alex:** What about openings—stairs, chimneys, that kind of thing?

**Jordan:** For any opening in the floor, you frame with **floor headers**—usually doubled-up joists (or tripled for bigger spans) running perpendicular to the main joists. The cut joists butt into the header with joist hangers. NBC 9.23.9.5 says headers must be sized per the tables or engineered, and you transfer loads properly.

To keep the whole system from twisting or buckling under load, add **blocking** (solid lumber pieces between joists at mid-span or ends) or **bridging** (cross X-bracing). Part 9 requires bridging or solid blocking at ≤ 2.4 m intervals for joists deeper than 286 mm (11¼").

**Alex:** And finally, we walk on it?

**Jordan:** Almost. The top surface is **floor sheathing**—usually 19 mm (¾") tongue-and-groove OSB or plywood, glued and screwed (or nailed per NBC 9.23.17) to the joists. This creates a rigid diaphragm that distributes loads and adds huge shear strength to the floor.

CSA O86 Clause 9 covers panel products—look for APA-rated Sturd-I-Floor or similar, with span ratings stamped right on the sheet (e.g., 24/16 means 24" joist spacing for roofs, 16" for floors).

Check these installation photos—glue lines, staggered joints, and proper fastening pattern:

**Alex:** That subfloor looks rock-solid. Quick checklist for a Winnipeg Part 9 floor?

**Jordan:** Here it is, straight from the codes:
- Joists: sized per NBC Table 9.23.4.2-(1), min. No. 2 grade or better
- Spacing: 305 mm (12") or 406 mm (16") o/c typical
- Rim joist: same size, nailed per 9.23.3.4
- Headers & trimmer joists: sized and supported per tables
- Blocking/bridging: required for joists > 286 mm deep
- Sheathing: 19 mm min., glued + fastened, edges over joists or blocked
- Deflection: L/360 live load typical (serviceability per NBC 9.4.3.1)

And always store lumber off the ground and covered—our humidity swings are brutal.

**Alex:** This is clicking fast. I can see the whole floor deck now. Refill questions: What if we want open-concept with longer spans? And how much does frost heave affect floor framing?

**Jordan:** Longer spans = engineered wood (I-joists or open-web floor trusses)—we'll cover those in Chapter 7. Frost heave? As long as the foundation is below frost line (2.4 m in Winnipeg), the floor framing sits happy. If you get settlement, it's usually differential and shows up as cracked drywall upstairs, not floor bounce.

**Alex:** Perfect. Chapter 3 walls next time? My coffee's gone, but I'm wide awake.

**Jordan:** You're on. Let's keep building this book one cup at a time.`;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-8">Chapter 2: Framing the Floor – Joists, Beams, and Sheathing</h1>
            <div className="space-y-4">
                {formatDialogue(firstDialogue)}
            </div>
        </div>
    )
}
