import eitIcon from "../../../assets/images/eit.png";
import pengIcon from "../../../assets/images/peng.png";
import { QuizQuestion, ChapterQuiz, type QuizQuestionData } from "../../../components/QuizQuestion";

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

export const ChapterOne = () => {
    // Inline question after mudsill introduction
    const inlineQuestion1: QuizQuestionData = {
        id: 'ch1-inline-1',
        question: 'What is the primary purpose of the mudsill in wood-frame construction?',
        options: [
            { id: 'a', text: 'To provide insulation between the foundation and floor' },
            { id: 'b', text: 'To act as the base plate connecting wood framing to the concrete foundation' },
            { id: 'c', text: 'To support the roof rafters directly' },
            { id: 'd', text: 'To create a vapor barrier for the basement' },
        ],
        correctOptionId: 'b',
        explanation: 'The mudsill (or sill plate) is the first wooden element attached to the foundation. It bridges the concrete-to-wood transition, provides a level starting point, and anchors the entire structure against uplift and lateral forces.'
    };

    // Inline question after floor framing discussion
    const inlineQuestion2: QuizQuestionData = {
        id: 'ch1-inline-2',
        question: 'What is the function of blocking or bridging between floor joists?',
        options: [
            { id: 'a', text: 'To increase the floor height' },
            { id: 'b', text: 'To provide space for electrical wiring' },
            { id: 'c', text: 'To prevent twisting and distribute loads evenly' },
            { id: 'd', text: 'To connect the floor to the walls' },
        ],
        correctOptionId: 'c',
        explanation: 'Blocking (solid lumber pieces) and bridging (X-shaped cross-bracing) keep the floor system rigid, prevent joists from twisting under load, and help distribute forces evenly across the structure.'
    };

    // End-of-chapter quiz questions
    const chapterQuizQuestions: QuizQuestionData[] = [
        {
            id: 'ch1-quiz-1',
            question: 'According to NBC 2020 Part 9.23.6.1, what is the minimum thickness required for a sill plate?',
            options: [
                { id: 'a', text: '25 mm (nominal 1")' },
                { id: 'b', text: '38 mm (nominal 2")' },
                { id: 'c', text: '50 mm (nominal 3")' },
                { id: 'd', text: '64 mm (nominal 4")' },
            ],
            correctOptionId: 'b',
            explanation: 'NBC 2020 Part 9.23.6.1 requires the sill plate to be at least 38 mm thick (nominal 2"). This ensures adequate bearing capacity and durability for the wood-to-concrete connection.'
        },
        {
            id: 'ch1-quiz-2',
            question: 'What is the maximum spacing for anchor bolts connecting the mudsill to the foundation per NBC 2020?',
            options: [
                { id: 'a', text: '1.2 m (4 ft)' },
                { id: 'b', text: '1.8 m (6 ft)' },
                { id: 'c', text: '2.4 m (8 ft)' },
                { id: 'd', text: '3.0 m (10 ft)' },
            ],
            correctOptionId: 'c',
            explanation: 'Anchor bolts must be spaced no more than 2.4 m (approximately 8 feet) apart. In high-wind or seismic zones, closer spacing or additional hold-downs may be required.'
        },
        {
            id: 'ch1-quiz-3',
            question: 'Why must the mudsill be pressure-preservative treated?',
            options: [
                { id: 'a', text: 'To increase its structural strength' },
                { id: 'b', text: 'To make it easier to drill for anchor bolts' },
                { id: 'c', text: 'To prevent rot from contact with concrete' },
                { id: 'd', text: 'To improve its thermal insulation properties' },
            ],
            correctOptionId: 'c',
            explanation: 'Untreated wood in contact with concrete absorbs moisture and rots quickly. Pressure-preservative treatment per CSA O86 Clause 4.4 (using borate or ACQ) protects the mudsill from decay and extends its service life.'
        },
        {
            id: 'ch1-quiz-4',
            question: 'What is placed between the concrete foundation and the mudsill to create an air/moisture barrier?',
            options: [
                { id: 'a', text: 'Metal flashing' },
                { id: 'b', text: 'Sill gasket or foam seal' },
                { id: 'c', text: 'Concrete grout' },
                { id: 'd', text: 'Plywood shim' },
            ],
            correctOptionId: 'b',
            explanation: 'A sill gasket or foam seal is placed between the concrete and wood to create an air and moisture barrier. This is especially important in climates with freeze-thaw cycles, like Manitoba.'
        },
    ];

    // Split dialogue for inline questions
    const dialoguePart1 = `**Junior Engineer (Alex):** Hey Jordan, thanks for meeting me here at the coffee shop. I've been reviewing those structural plans for the new residential project, but I'm getting tangled up in some of the framing terms. Like, how do all these parts fit together from the ground up? Mind walking me through it? Start from the bottom, maybe?

**Principal Engineer (Jordan):** No problem, Alex. Grab your latte—let's build a house in our heads while we sip. Okay, everything starts with the foundation. Imagine we've got our concrete foundation walls or piers poured. The first wooden element we attach is the **mudsill**. That's basically a pressure-treated board, usually 2x6 or wider, bolted directly to the foundation. It acts as the base plate for the entire floor system, sealing against moisture and providing a level starting point. Without a solid mudsill, your whole structure could shift or rot.

**Alex:** Got it, like the anchor between concrete and wood. So, what's next? The floor, right?`;

    const dialoguePart2 = `**Jordan:** Exactly. On top of the mudsill, we lay out the **floor joists**—those are the horizontal beams, typically 2x10 or 2x12 lumber, spaced 16 inches on center, running parallel across the foundation to support the floor load. If the span is too long for the joists alone, we might add a **support beam** underneath, like a hefty laminated veneer lumber (LVL) or steel girder, running perpendicular to the joists to carry the weight and prevent sagging.

**Alex:** Makes sense. And how do we cap the ends of those joists?

**Jordan:** Good question. At the perimeter, the joists connect to **rim joists**, which are boards of the same dimension as the joists, nailed along the outer edge. They box in the floor system, providing lateral stability and a nailing surface for the walls later. If there's an opening, say for stairs, we'd use **floor headers**—short joists doubled up and perpendicular to the main joists—to frame around it and transfer loads.

To keep everything rigid and prevent twisting, we install **blocking** or **bridging**. Blocking is solid pieces of lumber cut to fit between joists, often at the ends or mid-span, while bridging is X-shaped cross-bracing, usually metal straps or wood, to stop lateral movement and distribute loads evenly.

**Alex:** Ah, so that's why floors don't feel bouncy. And then we cover it all?`;

    const dialoguePart3 = `**Jordan:** Yep, the top layer is **floor sheathing**—plywood or oriented strand board (OSB) sheets, typically 3/4-inch thick, nailed or screwed down over the joists. That creates your subfloor, ready for finish flooring like hardwood or tile. It's what makes the floor feel solid underfoot.

Now, moving up: walls. **Exterior walls** bear the load from above and resist wind and weather, while **interior partition walls** divide spaces but usually don't carry roof weight—they're non-load-bearing.

**Alex:** Okay, how do we build them?

**Jordan:** Walls start with **wall plates**—horizontal boards at the bottom (sole plate) and top (top plate, often doubled for strength). Between them, vertical **studs**—2x4 or 2x6 at 16 or 24 inches on center—form the skeleton. For **exterior walls**, they're deeper for insulation; interiors might be thinner.

At corners, we have a **corner assembly**: three studs nailed together in an L-shape for nailing surfaces on both sides. Where a partition wall meets another wall, a **partition backer**—extra studs or blocking—provides a solid nailing point.

For openings like windows or doors, we use **jack studs** (trimmer studs) on either side of the opening to support the header above. Flanking them are **king studs**, full-height studs that run from sole to top plate, framing the rough opening. The **sill** is the horizontal bottom piece under a window, and if the header is high, we fill below it with short **cripple studs** to support the sill or above the header to reach the top plate.

**Alex:** Wow, that's a lot for walls. And sheathing there too?

**Jordan:** Absolutely. **Wall sheathing**—again, plywood or OSB—gets nailed to the exterior side of the studs for shear strength, resisting racking from wind or earthquakes. Interiors might get drywall later, but that's finish work.

**Alex:** Cool. Now the ceiling and roof? How does that tie in?

**Jordan:** Ceiling first: **ceiling joists** span across the top plates of the walls, parallel like floor joists, supporting the ceiling finish and any attic load. They also tie the walls together to prevent spreading.

For the roof, we have **rafters**—sloped beams from the top of the exterior walls up to the peak. They meet at the **ridge**, a horizontal board at the top that runs the length of the roof, providing a nailing point and stability.

**Alex:** And covering?

**Jordan:** **Roof sheathing**—plywood or OSB again—covers the rafters, creating the base for shingles or whatever roofing material. To prevent the rafters from sagging or spreading under load, we add **collar ties**, horizontal boards connecting opposing rafters about a third of the way down from the ridge. They act like tension members, keeping the roof from pushing the walls outward.

**Alex:** That all clicks now—like a story from foundation to peak. Thanks, Jordan. This coffee's gone cold, but my understanding's heated up.

**Jordan:** Anytime, Alex. Next time, we'll tackle trusses or engineered wood if you want. Refill? 

**Alex:** Jordan, that book outline is solid. If we're really doing this, let's sample one chapter in full dialogue style—like Chapter 1: Laying the Groundwork – Foundations and Mudsills. Walk me through how you'd write it, with the back-and-forth, code references, and some visuals to make it pop.

**Jordan:** Perfect, let's brew up a sample. Here's how Chapter 1 might read in the book—conversational, technical, Winnipeg-flavored since we're both dealing with those brutal prairie winters, and tied tightly to NBC 2020 Part 9 and CSA O86.

### Chapter 1: Laying the Groundwork – Foundations and Mudsills

**Alex:** Okay Jordan, we're starting from the dirt—literally. In Manitoba, with our frost depths and clay soils, foundations are no joke. What's the first wood piece we touch, and how do the codes govern it?

**Jordan:** Right, Alex. Everything starts below grade with the foundation—usually poured concrete walls or ICF in new Winnipeg builds. But the moment wood enters the picture is the **mudsill** (or sill plate). That's your pressure-treated 2x6 or 2x8 lumber bolted directly to the top of the concrete foundation wall. It bridges the concrete-to-wood transition, levels the structure, and anchors everything against uplift and lateral forces.

NBC 2020 Part 9.23.6.1 requires the sill plate to be at least 38 mm thick (nominal 2"), pressure-preservative treated per CSA O86 Clause 4.4 for ground contact, and anchored with 12.7 mm (1/2") diameter anchor bolts spaced no more than 2.4 m apart, embedded at least 100 mm into the concrete. In high-wind or seismic zones (we're Zone 4 for wind here in Winnipeg), you might need closer spacing or hold-downs.

Here are some real-world shots of mudsills being installed—notice the anchor bolts protruding and the treated lumber color:

**Alex:** Those bolts look beefy. How do we make sure it's level and sealed?

**Jordan:** Great eye. Before setting the mudsill, you shim the foundation top for level (within 3 mm over 3 m per NBC 9.15.6.3 tolerances), then lay a sill gasket or foam seal between concrete and wood for air/moisture barrier. Pressure-treated is mandatory because untreated wood against concrete rots fast—CSA O86 specifies retention levels for borate or ACQ treatments.

Once placed, you drill and drop the mudsill over the bolts, add washers and nuts, and torque to snug-plus-a-quarter-turn. In frost-prone Manitoba, we also ensure the foundation extends below frost line (about 2.4 m in Winnipeg per NBC climatic data).

**Alex:** And if we're using permanent wood foundations (PWF)?

**Jordan:** PWF is allowed under NBC 9.15.4 and detailed in CSA S406—basically treated plywood and studs forming the foundation itself. But for most light-frame houses, we stick with concrete + mudsill. CSA O86 Annex B gives supplementary guidance on PWF design, but Part 9 keeps it simple for standard housing.

Check this close-up of the bolt connection and sill gasket—critical for durability in our freeze-thaw cycles:

**Alex:** Makes sense. So the mudsill sets the stage for the floor system?

**Jordan:** Exactly. Next chapter we'll build on it with floor joists sitting directly on the mudsill, but first: never forget the code checklist. For a typical Part 9 house:
- Sill plate: min. 38 mm thick, treated per CSA O86
- Anchors: ½" bolts @ ≤ 2400 mm o/c, min. 100 mm embedment
- Bearing: full width on foundation
- Protection: gasket or sealant

If you're in a high snow load area (like northern Manitoba), double-check NBC Table 9.4.2.1 for specified loads that might push you into engineered design.

**Alex:** Solid start. I can already picture the book pages—dialogue, code callouts, and these photos. Refill questions: What happens if the foundation is out of level more than allowed? And how does CSA O86 factor into mudsill strength?

**Jordan:** Ha, good ones. If out of level, you shim with non-compressible material or grind concrete—never over-shim wood. As for strength, mudsills are mostly compressive and bearing per CSA O86 Clause 6.5, but we rarely size them for bending since they're continuous on concrete. The real design is in the anchors resisting uplift.

**Alex:** Loving it. Let's keep going—next sample could be Chapter 2 on floors?

**Jordan:** You're on. This coffee's getting us somewhere.`;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-8">Chapter 1: Laying the Groundwork – Foundations and Mudsills</h1>
            
            {/* Part 1: Introduction to mudsill */}
            <div className="space-y-4">
                {formatDialogue(dialoguePart1)}
            </div>

            {/* Inline Question 1: After mudsill introduction */}
            <QuizQuestion data={inlineQuestion1} />

            {/* Part 2: Floor joists and blocking */}
            <div className="space-y-4">
                {formatDialogue(dialoguePart2)}
            </div>

            {/* Inline Question 2: After blocking/bridging discussion */}
            <QuizQuestion data={inlineQuestion2} />

            {/* Part 3: Rest of the chapter */}
            <div className="space-y-4">
                {formatDialogue(dialoguePart3)}
            </div>

            {/* End of Chapter Quiz */}
            <ChapterQuiz 
                title="Chapter 1 Review Quiz" 
                questions={chapterQuizQuestions} 
            />
        </div>
    )
}
