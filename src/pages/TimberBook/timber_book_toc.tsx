import { Link } from "react-router";
import frontCover from "../../assets/images/books/light_frame_wood_construction.jpg";

const TimberBookTOC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-8">
                Brewed Blueprints - Light Frame Wood Construction Edition
            </h1>
            <div className="mb-12 flex justify-center">
                <img
                    src={frontCover}
                    alt="Brewed Blueprints - Light Frame Wood Construction Edition"
                    className="w-3/4 max-w-2xl h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                />
            </div>
            <div className="space-y-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        <Link
                            to="/timber-book/introduction"
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Introduction:
                        </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This book, Brewed Blueprints, is a casual, coffee-shop-style conversation between a junior and principal engineer explaining residential light-frame wood design in Canada. It uses NBC 2020 Part 9 prescriptive rules and CSA O86 engineering standards to guide readers—from juniors to builders to homeowners—through building a typical house step by step, with real code references, photos, and practical Winnipeg-flavored insights. The goal is to make complex framing concepts clear and approachable, one chapter (and one cup) at a time.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        <Link
                            to="/timber-book/chapter-one"
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Chapter 1: Laying the Groundwork - Foundations and Mudsills
                        </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Start with the base: Concrete foundations per NBC 9.15, tying into wood with mudsills (pressure-treated per CSA O86 Clause 5). Discuss anchoring, moisture barriers, and permanent wood foundations (PWF) from CSA O86 Annex B.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        <Link
                            to="/timber-book/chapter-two"
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Chapter 2: Framing the Floor – Joists, Beams, and Sheathing
                        </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Dive into floor systems: Sizing joists and beams using NBC 9.23 tables or CSA O86 Clause 6 for bending/shear. Cover rim joists, headers, blocking/bridging for stability, and subfloor sheathing (OSB/plywood per CSA O86 Clause 9).
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 3: Raising the Walls – Studs, Plates, and Assemblies
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Exterior and interior walls: Stud spacing, plates, and assemblies per NBC 9.23. Include corner setups, partition backers, and openings with jack/king/cripple studs. Reference CSA O86 for compressive strengths and NBC for wind/earthquake bracing.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 4: Sheathing and Shear – Wall and Floor Diaphragms
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Sheathing materials (OSB/plywood) for racking resistance per CSA O86 Clause 11. Explain light-frame shearwalls, nailing patterns from NBC 9.23.13, and how they tie into overall lateral load paths.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 5: Ceiling and Roof Basics – Joists, Rafters, and Ridges
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Ceiling joists for attic loads (NBC 9.23.4), rafters with ridges and collar ties. Use CSA O86 Clause 6 for slopes and spans, plus snow/wind loads from NBC Part 4/9.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 6: Truss Talk – Engineered Roof and Floor Systems
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Truss types (fink, scissor) per CSA O86 Clause 7.5. Discuss installation, bracing, and how they replace rafters/joists for efficiency in NBC-compliant spans.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 7: Engineered Wood Wonders – LVL, I-Joists, Glulam, and More
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Break down EWP like LVL (CSA O86 Clause 7.3), I-joists (Clause 7.4), glulam (Clause 7.2), and SCL. Compare to sawn lumber strengths, with NBC allowances for longer spans in residential builds.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 8: Mass Timber Intro – CLT and Emerging Options
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Touch on cross-laminated timber (CSA O86 Clause 7.6) and encapsulated mass timber for up to 12 storeys per NBC 2020 updates—great for taller "light" residential hybrids.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 9: Connections and Fasteners – Nails, Bolts, and Hardware
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The glue holding it together: Lateral and withdrawal resistances from CSA O86 Clause 12. Include NBC 9.23.3 for nailing schedules and hurricane ties for high-wind areas.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 10: Loads and Limits – Snow, Wind, Seismic per NBC
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Apply NBC Part 4/9 loads (e.g., 9.4.2 for specified loads) to wood design via CSA O86's LSD format. Cover deflection limits, load-sharing, and serviceability.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 11: Fire and Durability – Protection and Preservation
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Fire-resistance ratings (NBC 9.10), preservative treatments (CSA O86 Clause 4.4), and durability for moisture-prone areas like Winnipeg winters.
                    </p>
                </div>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Chapter 12: Putting It All Together – Case Studies and Code Compliance
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Wrap with real-world examples: A two-storey home walkthrough, checklists for NBC inspections, and tips on when to engineer beyond Part 9 (e.g., high seismic zones).
                    </p>
                </div>
                <div className="pt-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                        Each chapter would end with "Refill Questions" for readers to ponder, plus appendices with CSA O86 tables for specified strengths (e.g., bending fb for D.Fir-L) and NBC span charts.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TimberBookTOC;