export interface ExamComparisonData {
  exam: string;
  majorTopics: string;
  overlap: string;
  notes: string;
}

export const examComparisonData: ExamComparisonData[] = [
  {
    exam: 'State PSCs (e.g. MPSC)',
    majorTopics: 'Current Affairs; History (incl. local); Geography (local/natl); Polity; Economy; Environment; Science',
    overlap: '~100% (core topics)',
    notes: 'Adds local state history/geography (no UPSC counterpart)',
  },
  {
    exam: 'SSC CGL',
    majorTopics: 'GA: History, Geography, Polity, Economy, Science; Quant, English; Reasoning',
    overlap: '~60–70% (GA portion)',
    notes: 'Includes large Quant/Reasoning/English sections (new)',
  },
  {
    exam: 'CAPF (AC)',
    majorTopics: 'History, Geography, Polity, Economy, Science, Current Events; Reasoning/Quant',
    overlap: '~85–90%',
    notes: 'Emphasizes admin/security issues; adds Reasoning/Quant',
  },
  {
    exam: 'NDA/CDS',
    majorTopics: 'History, Geography, Polity, Economy, Science; English; Mathematics',
    overlap: '~70–80%',
    notes: 'Includes advanced Math/Physics (no UPSC); less economy',
  },
  {
    exam: 'EPFO/APFC',
    majorTopics: 'Culture, Heritage, History; Polity/Constitution; Economy; Social issues; Labour laws; Science',
    overlap: '~70–80%',
    notes: 'Adds labour law, accounting, social security, ICT',
  },
  {
    exam: 'RBI/NABARD',
    majorTopics: 'Macroeconomics, Microeconomics, Banking, Finance; Current Affairs; GS (limited)',
    overlap: '~40–50%',
    notes: 'Deep economics and statistics (beyond UPSC basics)',
  },
  {
    exam: 'Banking (SBI/IBPS)',
    majorTopics: 'Economy/Banking Awareness; Polity (brief); General Science; English; Reasoning; Quant',
    overlap: '~50–60% (limited GA)',
    notes: 'Emphasis on banking terms, comp sci; adds Math/Reasoning',
  },
  {
    exam: 'UGC NET / CSIR NET',
    majorTopics: 'Teaching Aptitude, Research Aptitude (NET-I); Advanced Life Sciences (NET-II/CSIR)',
    overlap: '~5–10%',
    notes: 'Specialized biology topics (no overlap); research meth.',
  },
  {
    exam: 'GATE / JAM (Life Sci)',
    majorTopics: 'Advanced Biotechnology, Genetics, Physiology, Ecology etc.',
    overlap: '~0–5%',
    notes: 'Focus on technical content; UPSC covers only basic bio.',
  },
  {
    exam: 'IFoS',
    majorTopics: 'GS (same as UPSC) + Forestry (Ecology, Botany, Zoology)',
    overlap: '~80% (GS papers)',
    notes: 'Forestry/environment specialization additional',
  },
  {
    exam: 'IB ACIO',
    majorTopics: 'Polity, Economy, Geography, History, Science; English; Reasoning',
    overlap: '~60%',
    notes: 'Adds logic puzzles, basic math; UPSC-style GA content',
  },
  {
    exam: 'RRB NTPC / Group B',
    majorTopics: 'GA (History, Geography, Economics, Science); Basics of Engineering/Trade (for tech posts)',
    overlap: '~50%',
    notes: 'Engineering topics (if any) not in UPSC; GK smaller part',
  },
  {
    exam: 'Technical Scientist',
    majorTopics: 'Specialized Life Sciences (depending on stream)',
    overlap: '~0%',
    notes: 'Apart from basic science, no overlap',
  },
  {
    exam: 'Medical/Agri Entrance',
    majorTopics: 'Advanced Biology/Chemistry/Medicine',
    overlap: '~0%',
    notes: 'No overlap; focus on professional fields',
  },
];
