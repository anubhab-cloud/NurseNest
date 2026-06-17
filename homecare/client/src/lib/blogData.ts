// ── Design tokens for blog ─────────────────────────────────────────────────
export const BLOG_COLORS = {
  primary:    '#2563EB',
  secondary:  '#14B8A6',
  accent:     '#06B6D4',
  bg:         '#F8FAFC',
  card:       '#FFFFFF',
  textPrimary:'#0F172A',
  textSecond: '#64748B',
  border:     '#E2E8F0',
  gradient:   'linear-gradient(135deg,#2563EB 0%,#14B8A6 100%)',
};

export interface Author {
  id:   string;
  name: string;
  role: string;
  exp:  string;
  bio:  string;
  avatar: string;
  articles: number;
}

export interface BlogPost {
  id:          string;
  slug:        string;
  title:       string;
  subtitle:    string;
  excerpt:     string;
  category:    string;
  tags:        string[];
  author:      Author;
  publishDate: string;
  updatedDate: string;
  readTime:    number;
  views:       number;
  featured:    boolean;
  coverEmoji:  string;
  coverGradient: string;
  content:     string;
}

export const AUTHORS: Author[] = [
  { id: 'a1', name: 'Dr. Priya Nair',    role: 'Senior Home Nurse',      exp: '12 yrs', bio: 'Specializes in geriatric care and post-operative home nursing. Published researcher in home healthcare outcomes.',   avatar: 'PN', articles: 24 },
  { id: 'a2', name: 'Dr. Ramesh Kumar',  role: 'Physiotherapist',         exp: '9 yrs',  bio: 'Expert in neurorehabilitation and musculoskeletal physiotherapy. Helped 2000+ patients recover at home.',          avatar: 'RK', articles: 18 },
  { id: 'a3', name: 'Dr. Anjali Singh',  role: 'General Physician',       exp: '14 yrs', bio: 'Family medicine specialist focused on preventive care and chronic disease management for home patients.',            avatar: 'AS', articles: 31 },
  { id: 'a4', name: 'Ms. Sunita Rao',   role: 'Postnatal Care Expert',   exp: '10 yrs', bio: 'Certified lactation consultant and postnatal nurse. Supported 500+ new mothers through their recovery journey.',    avatar: 'SR', articles: 15 },
  { id: 'a5', name: 'Dr. Suresh Pillai', role: 'Geriatric Specialist',   exp: '16 yrs', bio: 'Dedicated to improving quality of life for elderly patients. Expert in dementia care and fall prevention programs.', avatar: 'SP', articles: 22 },
];

export const CATEGORIES = [
  { id: 'all',          label: 'All Articles',  count: 48 },
  { id: 'elder-care',   label: 'Elder Care',    count: 12 },
  { id: 'nursing',      label: 'Nursing Care',  count: 9  },
  { id: 'physio',       label: 'Physiotherapy', count: 8  },
  { id: 'post-surgery', label: 'Post Surgery',  count: 7  },
  { id: 'child-care',   label: 'Child Care',    count: 5  },
  { id: 'mental-health',label: 'Mental Health', count: 4  },
  { id: 'emergency',    label: 'Emergency Care',count: 3  },
  { id: 'health-tips',  label: 'Health Tips',   count: 11 },
  { id: 'nutrition',    label: 'Nutrition',     count: 6  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'bp1', slug: '10-signs-elderly-parent-needs-home-care', featured: true, views: 18420, readTime: 7,
    title: '10 Signs Your Elderly Parent Needs Professional Home Care',
    subtitle: 'Recognizing early warning signs can prevent health crises and improve quality of life.',
    excerpt: 'Recognizing when a loved one needs more support at home can be challenging. Here are the key signs every family should watch for before seeking professional caregiving assistance.',
    category: 'Elder Care', tags: ['Elder Care', 'Family Health', 'Geriatrics', 'Home Nursing'],
    author: AUTHORS[4], publishDate: 'June 15, 2026', updatedDate: 'June 17, 2026',
    coverEmoji: '👴', coverGradient: 'linear-gradient(135deg,#1E40AF,#0EA5E9)',
    content: `## Introduction\n\nAs our parents grow older, subtle changes in their daily behavior and health can signal that they need more support than family members alone can provide. Early recognition is the single most important factor in ensuring they receive appropriate care before a health crisis occurs.\n\n## 1. Increased Falls or Near-Falls\n\nFalls are the leading cause of injury among adults over 65. If your parent has experienced even one fall in the past 6 months, it warrants a professional assessment. Look for unexplained bruises, reluctance to walk, or holding onto furniture while moving around the home.\n\n> **Important:** A single fall doubles the risk of a subsequent fall. Don't wait for a second incident.\n\n## 2. Difficulty Managing Medications\n\nMedication mismanagement is responsible for approximately 30% of hospital admissions among the elderly. Warning signs include:\n\n- Missed doses regularly\n- Taking wrong medications or wrong dosages\n- Expired medications still in the cabinet\n- Multiple prescriptions from different doctors without coordination\n\n## 3. Poor Personal Hygiene\n\nNotice if your parent has stopped bathing regularly, wearing the same clothes for several days, or neglecting dental care. This often indicates they need help with Activities of Daily Living (ADLs) — a core service our certified caregivers provide.\n\n## 4. Unexplained Weight Loss\n\nA loss of more than 5% of body weight within 6 months without intentional dieting is a significant warning sign. This may indicate difficulty cooking, swallowing problems, depression, or early dementia.\n\n## 5. Cognitive Decline or Confusion\n\nOccasional forgetfulness is normal aging. However, these are red flags requiring professional assessment:\n\n- Getting lost in familiar places\n- Difficulty managing finances or bills\n- Confusion about time, dates, or seasons\n- Repeating the same questions multiple times per hour\n\n## 6. Social Withdrawal\n\nElders who were previously social but have become increasingly isolated may be struggling with mobility, depression, or cognitive decline. Social engagement is critical for mental health and overall longevity.\n\n## 7. Decline in Home Maintenance\n\nAccumulated mail, expired food in the refrigerator, unpaid bills, and a general decline in household cleanliness can indicate that managing daily tasks has become overwhelming.\n\n## 8. Increased Emergency Room Visits\n\nIf your parent has visited the ER more than once in the past year, this strongly indicates that their health needs are exceeding what they can self-manage or what family can provide.\n\n## 9. Caregiver Burnout in Family Members\n\nIf family members are exhausted, resentful, or have begun experiencing their own health problems due to caregiving responsibilities, professional home care is no longer optional — it's necessary.\n\n## 10. The Parent Themselves Asks for Help\n\nThis is often the clearest signal and the one families most often dismiss. When a parent — who may have resisted help for years — asks for assistance, they have reached a critical threshold.\n\n## What To Do Next\n\nIf you recognized three or more of these signs, we recommend a professional care assessment. Our certified geriatric care specialists can evaluate your parent's needs and design a personalized care plan.\n\n| Assessment Area | What We Evaluate |\n|-----------------|------------------|\n| Physical Health | Mobility, medication, nutrition |\n| Cognitive Health | Memory, orientation, daily tasks |\n| Safety | Fall risk, home hazards |\n| Social | Isolation, engagement |\n| Mental Health | Depression, anxiety screening |`,
  },
  {
    id: 'bp2', slug: 'complete-guide-post-surgery-recovery-home', featured: false, views: 12300, readTime: 9,
    title: 'Complete Guide to Post-Surgery Recovery at Home',
    subtitle: 'Everything you need to know to ensure a safe and fast recovery without leaving home.',
    excerpt: 'Recovering after surgery at home requires careful planning, professional support, and the right environment. This comprehensive guide covers wound care, medication management, and when to seek emergency help.',
    category: 'Post Surgery', tags: ['Post Surgery', 'Recovery', 'Wound Care', 'Nursing'],
    author: AUTHORS[0], publishDate: 'June 12, 2026', updatedDate: 'June 14, 2026',
    coverEmoji: '🏥', coverGradient: 'linear-gradient(135deg,#059669,#0EA5E9)',
    content: `## Why Home Recovery Works\n\nStudies consistently show that patients who recover in their home environment — supported by professional nursing — have 40% lower rates of hospital-acquired infections, recover 25% faster, and report significantly higher satisfaction scores than those who remain hospitalized.\n\n## Setting Up Your Recovery Space\n\nBefore discharge, ensure your home is prepared:\n\n- **Ground floor access** if stairs are a challenge\n- **Hospital bed rental** if mobility is severely limited\n- **Grab bars** in bathroom and near bed\n- **Good lighting** in all areas used at night\n- **Clear pathways** free of rugs and obstacles\n\n> **Critical Note:** Never attempt post-surgical recovery alone. Have a plan for professional nursing support from day one.\n\n## Wound Care Protocols\n\nThis is the area where professional nursing adds the most value. Our nurses follow clinical protocols for:\n\n1. Daily wound inspection and documentation\n2. Sterile dressing changes using hospital-grade materials\n3. Infection monitoring (redness, warmth, discharge, odor)\n4. Suture and staple care\n5. Drain management where applicable\n\n## Medication Management\n\nPost-surgical medication regimens are often complex. A typical patient may be managing:\n\n| Medication Type | Purpose | Risk if Missed |\n|-----------------|---------|----------------|\n| Antibiotics | Prevent infection | Infection return |\n| Pain medication | Comfort | Undertreatment of pain |\n| Blood thinners | DVT prevention | Blood clots |\n| Diabetes meds | Blood sugar | Complications |\n\n## Warning Signs to Act Immediately\n\n- Temperature above 38.5°C (101.3°F)\n- Wound edges separating (dehiscence)\n- Red streaking from wound site\n- Sudden chest pain or shortness of breath\n- Calf swelling or tenderness (DVT)\n\nIf any of these occur, call our emergency line immediately.`,
  },
  {
    id: 'bp3', slug: 'physiotherapy-at-home-vs-clinic', featured: false, views: 8900, readTime: 6,
    title: 'Physiotherapy at Home vs Clinic: What Research Says',
    subtitle: 'A data-driven comparison to help you choose the right rehabilitation setting.',
    excerpt: 'The debate between home physiotherapy and clinic sessions has a clear winner for most patients. Discover the research-backed benefits of receiving physiotherapy in your own environment.',
    category: 'Physiotherapy', tags: ['Physiotherapy', 'Rehabilitation', 'Recovery', 'Research'],
    author: AUTHORS[1], publishDate: 'June 8, 2026', updatedDate: 'June 10, 2026',
    coverEmoji: '🏃', coverGradient: 'linear-gradient(135deg,#7C3AED,#0EA5E9)',
    content: `## The Research Is Clear\n\nA 2024 meta-analysis published in the Journal of Physiotherapy analyzed 47 randomized controlled trials with over 6,000 participants. The conclusion: home-based physiotherapy produced equivalent or superior outcomes in 38 of 47 studies.\n\n## Why Home Physiotherapy Works Better\n\nThe functional environment advantage cannot be overstated. When a patient practices standing up from their own couch, navigating their own bathroom, or climbing their own staircase — the neurological and muscular adaptations are specific to those exact movements.\n\n## Cost Comparison\n\n| Factor | Clinic-Based | Home-Based |\n|--------|-------------|------------|\n| Session cost | ₹800–1,200 | ₹700–900 |\n| Transport cost | ₹200–500 | ₹0 |\n| Time cost | 2–3 hours | 45–60 min |\n| Missed appointments | 22% rate | 8% rate |\n\n## Who Benefits Most from Home Physio\n\n- Post-hip/knee replacement patients\n- Stroke rehabilitation\n- COPD and cardiac rehab\n- Elderly patients with mobility limitations\n- Post-partum pelvic floor rehabilitation`,
  },
  {
    id: 'bp4', slug: 'postnatal-care-tips-new-mothers', featured: false, views: 11200, readTime: 8,
    title: 'Essential Postnatal Care: What No One Tells New Mothers',
    subtitle: 'Evidence-based guidance for the critical first 6 weeks after delivery.',
    excerpt: 'The first 6 weeks after delivery are the most critical for both mother and baby. Our certified postnatal nurses share what the textbooks don\'t tell you about home recovery.',
    category: 'Child Care', tags: ['Postnatal', 'Newborn', 'Mother Care', 'Lactation'],
    author: AUTHORS[3], publishDate: 'June 5, 2026', updatedDate: 'June 7, 2026',
    coverEmoji: '👶', coverGradient: 'linear-gradient(135deg,#DB2777,#F59E0B)',
    content: `## The Fourth Trimester\n\nThe "fourth trimester" — the 12 weeks following birth — is a period of profound physiological and psychological change. Yet most healthcare systems discharge mothers within 48 hours of delivery with minimal follow-up.\n\n## Physical Recovery Timeline\n\n- **Days 1–3:** Uterine contractions (afterpains), perineal soreness, engorgement\n- **Week 1–2:** Lochia (post-delivery discharge), fatigue peak, baby blues possible\n- **Week 3–4:** Gradual energy return, establishing feeding routine\n- **Week 5–6:** Pelvic floor begins strengthening, c-section scar healing\n\n## When to Call Immediately\n\n1. Temperature over 38°C\n2. Heavy bleeding (soaking more than one pad per hour)\n3. Signs of infection at wound or perineum\n4. Severe headache with visual changes\n5. Signs of postnatal depression (persistent sadness, inability to bond)\n\n## Newborn Warning Signs\n\n| Sign | Action |\n|------|--------|\n| No wet nappies for 6+ hours | Call nurse immediately |\n| Jaundice spreading below chest | Medical evaluation same day |\n| Temperature below 36.5°C | Immediate medical attention |\n| Difficulty breathing | Emergency services |\n| Inconsolable crying 3+ hours | Contact healthcare provider |`,
  },
  {
    id: 'bp5', slug: 'managing-chronic-pain-home-nursing-guide', featured: false, views: 7600, readTime: 7,
    title: 'Managing Chronic Pain at Home: A Clinical Nursing Guide',
    subtitle: 'Evidence-based strategies for patients and caregivers dealing with persistent pain.',
    excerpt: 'Chronic pain affects 1 in 5 adults and is the leading cause of disability worldwide. Our clinical nurses share practical, evidence-based strategies for management at home.',
    category: 'Nursing Care', tags: ['Chronic Pain', 'Nursing', 'Pain Management', 'Wellness'],
    author: AUTHORS[0], publishDate: 'May 28, 2026', updatedDate: 'June 2, 2026',
    coverEmoji: '💊', coverGradient: 'linear-gradient(135deg,#1E40AF,#7C3AED)',
    content: `## Understanding Chronic Pain\n\nChronic pain is defined as pain persisting beyond the normal healing time — typically 3 months or more. Unlike acute pain, it often serves no protective biological function and can fundamentally alter the nervous system through a process called central sensitization.\n\n## Non-Pharmacological Interventions\n\nThe evidence for non-drug approaches has grown dramatically in the last decade:\n\n1. **Heat therapy** — reduces muscle spasm, increases blood flow\n2. **Cold therapy** — reduces inflammation and nerve conduction velocity\n3. **TENS therapy** — electrical stimulation disrupts pain signals\n4. **Mindfulness-based stress reduction** — shown to reduce pain by 30–40%\n5. **Graded activity** — carefully graduated exercise to rebuild function\n\n## The Pain Diary: Your Most Valuable Tool\n\n| Time | Pain Level (0–10) | Location | Activity | Medication |\n|------|------------------|-----------|-----------|-----------|\n| 8 AM | 4 | Lower back | Rest | None |\n| 12 PM | 6 | Lower back | Walking | Paracetamol |\n| 6 PM | 3 | Lower back | Resting | None |`,
  },
  {
    id: 'bp6', slug: 'ai-technology-home-healthcare-2026', featured: false, views: 15800, readTime: 5,
    title: 'How AI is Transforming Home Healthcare in 2026',
    subtitle: 'From intelligent caregiver matching to predictive health monitoring — the future is here.',
    excerpt: 'Artificial intelligence is fundamentally changing how home healthcare is delivered. We explore the technologies already in use and what\'s coming next.',
    category: 'Health Tips', tags: ['AI', 'Technology', 'Innovation', 'Future Health'],
    author: AUTHORS[2], publishDate: 'May 20, 2026', updatedDate: 'May 25, 2026',
    coverEmoji: '🤖', coverGradient: 'linear-gradient(135deg,#0F172A,#1E40AF)',
    content: `## AI in Home Healthcare: Beyond the Hype\n\nThe promise of AI in healthcare has often outpaced reality. But in home healthcare specifically, several AI applications have moved from experimental to clinical standard in 2025–2026.\n\n## Current Applications That Work\n\n### 1. Predictive Fall Detection\nWearable sensors combined with machine learning models can now predict falls 24–48 hours before they occur with 78% accuracy, giving caregivers time to intervene.\n\n### 2. Intelligent Caregiver Matching\nOur platform uses a proprietary algorithm that analyzes 47 variables — clinical needs, caregiver skills, personality compatibility, geography, and availability — to match patients with optimal caregivers.\n\n### 3. Vitals Anomaly Detection\nRemote patient monitoring devices feed continuous data to AI systems that detect subtle patterns humans would miss — detecting early signs of deterioration hours before clinical symptoms appear.\n\n## The Next 24 Months\n\n| Technology | Current Status | Expected Timeline |\n|------------|---------------|-------------------|\n| Voice-based health assessment | Pilot | Q4 2026 |\n| Autonomous medication dispensing | Beta | Q2 2027 |\n| AR-guided wound care | Testing | Q1 2027 |\n| Robotic mobility assistance | R&D | 2028 |`,
  },
];

export const RESOURCES = [
  { emoji: '📋', title: 'Caregiver Handbook', desc: 'Complete 45-page guide covering all aspects of professional home caregiving. Protocols, procedures, and best practices.', tag: 'PDF Guide', downloads: '12.4k', gradient: 'linear-gradient(135deg,#1E40AF,#0EA5E9)' },
  { emoji: '🏥', title: 'Recovery Protocols', desc: 'Evidence-based post-surgery recovery timelines and care checklists for 12 common surgical procedures.', tag: 'Clinical Guide', downloads: '8.7k', gradient: 'linear-gradient(135deg,#059669,#14B8A6)' },
  { emoji: '💊', title: 'Medication Safety Guide', desc: 'Drug interaction checker, storage requirements, and administration protocols for the 50 most common home care medications.', tag: 'Safety Resource', downloads: '10.2k', gradient: 'linear-gradient(135deg,#7C3AED,#06B6D4)' },
  { emoji: '👨‍👩‍👧', title: 'Family Care Toolkit', desc: 'Practical tools for families managing a loved one\'s care — including care diaries, doctor checklists, and communication templates.', tag: 'Family Resource', downloads: '15.1k', gradient: 'linear-gradient(135deg,#DB2777,#F59E0B)' },
];

export const BLOG_FAQS = [
  { q: 'Are all articles written by qualified healthcare professionals?', a: 'Yes. Every article on HomeCare+ Knowledge Center is written or reviewed by a qualified healthcare professional with minimum 5 years of clinical experience. Author credentials are displayed on every article.' },
  { q: 'How often is the content updated?', a: 'Our clinical team reviews all existing articles quarterly and updates them to reflect the latest clinical guidelines and research. Each article displays both the publish date and the last updated date.' },
  { q: 'Can I use these articles to make medical decisions?', a: 'Our content is educational and designed to help you have more informed conversations with healthcare professionals. It does not replace professional medical advice. Always consult a qualified healthcare provider for medical decisions.' },
  { q: 'How do I submit a question for an article topic?', a: 'Use the "Suggest a Topic" button in the newsletter section, or contact our editorial team at editorial@homecareplus.in. We publish new articles weekly based on community demand.' },
  { q: 'Are the resources available in regional languages?', a: 'We currently publish in English and Hindi. Tamil, Kannada, and Bengali versions are in development and will be available by Q4 2026. Use the language selector in the top navigation.' },
];
