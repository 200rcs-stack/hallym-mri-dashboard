import React, { useState, useEffect } from 'react';
import './index.css';
import { protocolsDB as initialProtocols } from './data.js';

function App() {
  const [protocols, setProtocols] = useState(initialProtocols);
  const [scrolled, setScrolled] = useState(false);
  const [activePart, setActivePart] = useState('brain');
  const [selectedProtocolIndex, setSelectedProtocolIndex] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Flashcards State
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlashcardEditing, setIsFlashcardEditing] = useState(false);
  const [editFlashcardForm, setEditFlashcardForm] = useState(null);

  // Equipment State
  const [showEquipment, setShowEquipment] = useState(false);

  // Theory State
  const [showTheory, setShowTheory] = useState(false);

  const [flashcards, setFlashcards] = useState([
    // 테마 1: MRI 물리 및 기본 원리
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "TR(Repetition Time)이란 무엇인가요?", a: "한 슬라이스의 수소 원자를 자극하고 다음 자극까지 기다리는 시간으로, 영상의 T1 대조도를 결정합니다.\n\n(TR을 짧게 하면 T1 강조 영상이 됩니다)" },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "TE(Echo Time)란 무엇인가요?", a: "RF 자극 후 신호를 듣는 시점으로, 영상의 T2 대조도를 결정합니다.\n\n(TE를 길게 하면 T2 강조 영상이 됩니다)" },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "지방(Fat)과 물(Water)의 T1, T2 신호 특성은?", a: "지방은 T1이 짧아 T1 강조 영상에서 밝게 보이고,\n물은 T2가 길어 T2 강조 영상에서 밝게 보입니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "Voxel 크기를 키우면 영상 화질에 어떤 변화가 생기나요?", a: "신호량(SNR)이 높아져 영상이 깨끗해지지만, 작은 구조가 뭉개지는 부분용적효과(Partial Volume Effect)가 발생해 해상도는 떨어집니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "K-space의 중앙부와 주변부는 각각 영상의 어떤 요소를 결정하나요?", a: "중앙부는 대조도(명암)를 결정하고,\n주변부는 세부 윤곽선(해상도)을 결정합니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "평행 영상 획득(Parallel Imaging) 가속 팩터(R)를 올리면 SNR은 어떻게 변하나요?", a: "SNR은 가속 팩터의 루트 배(√R)만큼 무조건 감소합니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "대역폭(Bandwidth)을 넓히면 나타나는 장점과 단점은?", a: "장점: 물과 지방의 화학적 이동(Chemical Shift) 및 금속 인공물 왜곡이 감소합니다.\n\n단점: 잡음이 유입되어 전체적인 SNR은 크게 하락합니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "STIR(Short-Tau IR) 기법의 특징과 조영 검사 시 주의점은?", a: "자장 불균일이 심한 곳에서도 지방을 확실히 억제하지만, 조영제(Gadolinium)의 신호까지 함께 억제하므로 조영제 투여 후 스캔에는 절대 사용해선 안 됩니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "고속 스핀 에코(TSE/FSE)에서 터보 팩터(ETL)를 높일 때 발생하는 부작용은?", a: "뒤쪽 에코일수록 T2 감쇠가 진행되어 영상이 번지는 블러링(Blurring) 아티팩트가 심해지며, 180도 RF 펄스 증가로 환자의 체온을 올리는 SAR 위험이 커집니다." },
    { theme: "테마 1: MRI 물리 및 기본 원리", q: "SAR(Specific Absorption Rate)란 무엇이며 낮추는 방법은?", a: "1kg 몸이 1초에 흡수하는 RF 에너지입니다.\n\n낮추는 방법: TR을 늘리거나, Flip angle 및 ETL을 줄여서 낮출 수 있습니다." },

    // 테마 2: 제조사별 명칭
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "3D 고해상도 T1 강조 영상의 벤더별 명칭은?\n\n(Siemens / GE / Philips)", a: "- Siemens: MP-RAGE\n- GE: 3D BRAVO 또는 FSPGR\n- Philips: 3D TFE 또는 3D FFE" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "가변 숙임각을 이용한 3D 고해상도 T2/FLAIR 영상의 벤더별 명칭은?", a: "- Siemens: SPACE\n- GE: CUBE\n- Philips: VISTA" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "미세 출혈과 철분 침착을 보는 자화율 영상의 벤더별 명칭은?", a: "- Siemens: SWI\n- GE: SWAN\n- Philips: SWIp" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "물과 지방을 분리하는 Dixon 기법의 벤더별 명칭은?", a: "- Siemens: Dixon VIBE 또는 Dixon TSE\n- GE: IDEAL 또는 LAVA-Flex\n- Philips: mDixon" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "금속 인공물 감소 기법의 벤더별 명칭은?", a: "- Siemens: WARP 또는 SEMAC\n- GE: MAVRIC SL\n- Philips: O-MAR" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "고해상도 분할 확산(DWI) 기법의 벤더별 명칭은?", a: "- Siemens: RESOLVE\n- GE: PROPELLER DWI 또는 FOCUS\n- Philips: DWI with segmented EPI" },
    { theme: "테마 2: 제조사별 MRI 시퀀스 명칭", q: "복부 3D 역동적 조영(Dynamic CE) 스캔 기법의 벤더별 명칭은?", a: "- Siemens: VIBE\n- GE: LAVA\n- Philips: THRIVE 또는 eTHRIVE" },

    // 테마 3: 한림 프로토콜
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "한림대성심병원의 기본 Brain 검사 조합은?", a: "Brain + CE + MRA + Diffusion + Perfusion" },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "Dynamic Scan(뇌, 뇌하수체 조영 등) 시 촬영 범위 조정의 대원칙은?", a: "Slice 개수가 아닌 무조건 두께(Thickness)로 범위를 조절해야 합니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "비소세포폐암(NSCLC) 등 전이암 환자의 뇌 MRI 권장 프로토콜은?", a: "홍영길 교수 지정에 따라 BB(Black Blood) 및 SPACE 시퀀스를 활용합니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "L-Spine T2 SPACE COR (3D) 검사 시 반드시 영상에 포함해야 할 구조물은?", a: "Femur head (대퇴골두)" },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "Extremity (Knee, Shoulder 등) 검사 시 Coronal 구성 원칙은?", a: "기본 T2 COR는 삭제하고, T2 DIXON COR와 T1 COR 조합(총 2개)으로 대체합니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "Extremity에 Mass 처방 시 필수 추가 시퀀스와 옵션은?", a: "DWI(b=50, 400, 800) 시퀀스 필수 추가, 상황에 따라 Body Coil 사용이 허용됩니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "Perfusion(PWI) 영상 후처리 시 PACS 전송 룰은?", a: "1200장 작업 후 2, 3, 4, 5, 6번 영상만 PACS로 전송하고 소스 영상은 ISP 및 JLKPMI로 별도 전송합니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "3D TOF MRA Carotid 검사의 영상 후처리(MIP) 생성 룰은?", a: "왼쪽 24장 Clear bath 작업 후, SPIN 3번째 이미지로 MIP2, ROLL 1번째 이미지로 MIP1을 만듭니다." },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "간(Liver) Primovist 조영 검사 시 조영제 주입 속도는?", a: "1 mL/sec (Primovist + Saline)" },
    { theme: "테마 3: 한림대성심병원 실무 프로토콜", q: "전립선(Prostate) MRI 세팅 시 Diffusion과 Enhance 시퀀스의 위치 조작 팁은?", a: "Center를 따라가도록 설정하며, FOV가 좁으므로 Position을 P(앞), L(뒤)로 조정하고 Reference line은 1번만 허용해 중심선을 맞춥니다." },

    // 테마 4: 안전 및 가이드라인
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "MRI 절대 금기 대상(검사 불가) 체내 삽입물 3가지는?", a: "1. 심장박동기(Pacemaker)\n2. 신경자극기\n3. 인공 달팽이관(와우 이식)" },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "조영제 사용 전 반드시 의료진에게 고지해야 할 환자 과거력은?", a: "조영제 알레르기 반응 경험, 천식 등 특이 체질, 신장 질환 여부" },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "신기능이 저하된 환자(eGFR 60 이하)에게 가돌리늄 조영제 투여 시 발생할 수 있는 부작용은?", a: "신원성 전신섬유증 (NSF, Nephrogenic Systemic Fibrosis)" },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "소아 환자(8세 이하)의 안전한 조영제 검사를 위한 선제적 조치는?", a: "수면 진정 요법 시행을 고려하며, 조영제 투여 전 반드시 T2 Full Axial 영상을 선제적으로 확보하여 기본 상태를 평가합니다." },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "소장 검사(Enterography)를 위한 환자의 사전 음수 준비는?", a: "장관 확장을 위해 검사 1시간 전부터 레디프리 희석액 1리터를 1시간 동안 지속적으로 복용해야 합니다." },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "소장 검사 시 장 운동을 억제하기 위해 투여하는 약물은?", a: "부스코판(Buscopan) 주사제" },
    { theme: "테마 4: 환자 안전 및 조영제 가이드라인", q: "턱관절(TMJ) 검사 시 환자에게 주지시켜야 할 가장 중요한 주의사항은?", a: "센터를 인중에 맞추고 진행하므로, 검사 중 절대 침을 삼키지 말 것을 안내해야 합니다." }
  ]);

  const handleEditFlashcard = () => {
    setEditFlashcardForm({ ...flashcards[currentCardIndex] });
    setIsFlashcardEditing(true);
  };

  const handleSaveFlashcard = () => {
    const updated = [...flashcards];
    updated[currentCardIndex] = editFlashcardForm;
    setFlashcards(updated);
    setIsFlashcardEditing(false);
  };

  const handleDeleteFlashcard = () => {
    if(window.confirm('이 플래시카드를 삭제하시겠습니까?')) {
      const updated = [...flashcards];
      updated.splice(currentCardIndex, 1);
      if(updated.length === 0) {
        updated.push({ theme: "새 테마", q: "새 질문", a: "새 정답" });
      }
      setFlashcards(updated);
      setCurrentCardIndex(prev => prev >= updated.length ? updated.length - 1 : prev);
      setIsFlipped(false);
    }
  };

  const handleAddFlashcard = () => {
    const newCard = { theme: "새 테마", q: "질문을 입력하세요.", a: "정답을 입력하세요." };
    setFlashcards([...flashcards, newCard]);
    setCurrentCardIndex(flashcards.length);
    setEditFlashcardForm(newCard);
    setIsFlashcardEditing(true);
    setIsFlipped(false);
  };

  const handleCopyProtocol = (protocol) => {
    const textToCopy = `${protocol.name}\n\n[Sequences]\n${protocol.sequences.join('\n')}\n\n[Notes]\n${protocol.notes || 'None'}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('✅ 프로토콜 내용이 클립보드에 복사되었습니다! (Copied to clipboard)');
    }).catch(err => {
      console.error('Copy failed', err);
      alert('복사 기능이 지원되지 않는 환경입니다.');
    });
  };

  const bodyParts = [
    { id: 'brain', name: 'BRAIN / HEAD', ko: '머리 뇌 브레인', top: '4%', left: '41%', width: '18%', height: '11%', mriImage: '/mri_brain.png', protocols: protocols['brain'] },
    { id: 'c-spine', name: 'SPINE / NECK', ko: '척추 목 허리 스파인 경추 요추', top: '15%', left: '44%', width: '12%', height: '6%', mriImage: '/mri_spine.png', protocols: protocols['c-spine'] },
    { id: 'chest', name: 'CHEST', ko: '가슴 흉부 체스트', top: '21%', left: '33%', width: '34%', height: '16%', mriImage: '/mri_chest.png', protocols: protocols['chest'] },
    { id: 'abdomen', name: 'ABDOMEN', ko: '복부 배 간 압도멘', top: '37%', left: '34%', width: '32%', height: '14%', mriImage: '/mri_abdomen.png', protocols: protocols['abdomen'] },
    { id: 'pelvis', name: 'PELVIS', ko: '골반 펠비스', top: '51%', left: '36%', width: '28%', height: '10%', mriImage: '/mri_pelvis.png', protocols: protocols['pelvis'] },
    { id: 'knee', name: 'EXTREMITY / MSK', ko: '무릎 관절 팔다리 니 무릅 뼈', top: '61%', left: '25%', width: '50%', height: '37%', mriImage: '/mri_knee.png', protocols: protocols['knee'] }
  ];

  const closeModal = () => {
    setSelectedProtocolIndex(null);
    setIsEditing(false);
    setEditForm(null);
  };

  const handleEditClick = () => {
    const protocol = protocols[activePart][selectedProtocolIndex];
    setEditForm({ ...protocol, sequencesStr: protocol.sequences.join('\n') });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const updatedProtocols = { ...protocols };
    updatedProtocols[activePart][selectedProtocolIndex] = {
      name: editForm.name,
      time: editForm.time,
      sequences: editForm.sequencesStr.split('\n').filter(s => s.trim() !== ''),
      notes: editForm.notes
    };
    setProtocols(updatedProtocols);
    setIsEditing(false);
  };

  const deleteProtocol = (e, index) => {
    e.stopPropagation();
    if (window.confirm('정말 이 프로토콜을 삭제하시겠습니까?')) {
      if (window.confirm('삭제된 데이터는 복구할 수 없습니다. 정말로 삭제하시겠습니까? (최종 확인)')) {
        const updatedProtocols = { ...protocols };
        updatedProtocols[activePart] = [...updatedProtocols[activePart]];
        updatedProtocols[activePart].splice(index, 1);
        setProtocols(updatedProtocols);
      }
    }
  };

  const addProtocol = () => {
    const newProtocol = {
      name: '새 프로토콜',
      time: '0 Min',
      sequences: ['새 시퀀스'],
      notes: '설명을 입력하세요.'
    };
    const updatedProtocols = { ...protocols };
    updatedProtocols[activePart] = [...(updatedProtocols[activePart] || []), newProtocol];
    setProtocols(updatedProtocols);
  };

  const selectedProtocol = selectedProtocolIndex !== null ? protocols[activePart][selectedProtocolIndex] : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Added Hospital Logo. Needs logo.png in public folder */}
            <img src="/logo.png" alt="한림대학교성심병원" style={{ height: '35px', background: 'white', padding: '5px 10px', borderRadius: '4px', marginRight: '15px' }} />
            <span style={{ color: 'var(--text)' }}>HALLYM</span> <span style={{ marginLeft: '8px' }}>MRI</span>
          </a>
          <nav>
            <ul>
              <li><a href="#protocols">Protocols</a></li>
              <li><a href="#resources">Resources</a></li>
              <li><a href="#maintenance">Maintenance</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="hero">
        <img src="/hero-mri.png" alt="MRI Scanner Machine" className="hero-bg" />
        <div className="container grid-12 hero-grid">
          <div className="hero-content">
            <h1 className="glitch" data-text="PRECISION">PRECISION</h1>
            <h1 className="neon-text">IMAGING</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '2rem 0', color: 'var(--text-muted)' }}>
              Advanced MRI protocols and parameter optimization for cutting-edge diagnostic clarity. Developed by Hallym Medical Center.
            </p>
            <a href="#protocols" className="btn">View Protocols</a>
          </div>
          
          <div className="hero-technologists">
            <div className="tech-glass-panel">
              <h4 className="tech-title">MR TECHNOLOGISTS</h4>
              <div className="tech-list-wrapper">
                <ul className="tech-list scroll-credits">
                  {/* Set 1 */}
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 채수인</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김성훈</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 정재현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 조대현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김영진</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 장찬순</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 이기현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김도완</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 최대용</li>
                  {/* Set 2 for seamless loop */}
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 채수인</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김성훈</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 정재현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 조대현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김영진</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 장찬순</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 이기현</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 김도완</li>
                  <li><span className="tech-prefix">MR TECHNOLOGIST</span> 최대용</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Protocol Selector */}
      <section id="protocols" className="protocol-section">
        <div className="container">
          <h2>PROTOCOL <span style={{ color: 'var(--accent)' }}>SELECTOR</span></h2>

          {/* Global Search Bar (Above everything) */}
          <div style={{ marginBottom: '2rem', position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <input 
              type="text" 
              placeholder="🔍 영어나 한글로 부위(예: 머리, Spine) 또는 프로토콜을 검색하세요..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 20px', borderRadius: '10px', border: '2px solid rgba(223, 255, 0, 0.5)', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '1rem', outline: 'none', boxShadow: '0 4px 20px rgba(223,255,0,0.1)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            )}
          </div>

          <div className="interactive-container">
            {searchQuery ? (
              /* --- GLOBAL SEARCH RESULTS --- */
              <div className="protocol-details" style={{ width: '100%' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--accent)' }}>검색 결과 (SEARCH RESULTS)</h3>
                <ul className="protocol-list">
                  {bodyParts.map(part => {
                    const filteredProtocols = part.protocols?.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.sequences.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      part.ko.includes(searchQuery)
                    );
                    
                    return filteredProtocols?.map((protocol) => {
                      const originalIndex = part.protocols.indexOf(protocol);
                      return (
                        <li key={`${part.id}-${originalIndex}`} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => { setActivePart(part.id); setSelectedProtocolIndex(originalIndex); }}>
                          <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>[{part.name}]</span>
                            <span className="protocol-name" style={{ fontSize: '1.2rem' }}>{protocol.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span className="protocol-time" style={{ background: 'var(--accent)', color: '#000', fontWeight: 'bold', padding: '10px 15px', borderRadius: '6px', fontSize: '0.9rem' }}>VIEW &rarr;</span>
                          </div>
                        </li>
                      );
                    });
                  })}
                </ul>
                {bodyParts.every(part => part.protocols?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sequences.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) || part.name.toLowerCase().includes(searchQuery.toLowerCase()) || part.ko.includes(searchQuery)).length === 0) && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem', fontSize: '1.2rem' }}>검색 결과가 없습니다.</p>
                )}
              </div>
            ) : (
              /* --- DEFAULT TABS VIEW --- */
              <>
                <div className="tabs-container">
                  {bodyParts.map(part => (
                    <div 
                      key={part.id} 
                      className={`tab ${activePart === part.id ? 'active' : ''}`}
                      onClick={() => setActivePart(part.id)}
                    >
                      <img src={part.mriImage} alt={part.name} />
                      <span className="tab-title">{part.name}</span>
                    </div>
                  ))}
                </div>

                <div className="protocol-details">
                  {bodyParts.map(part => (
                    activePart === part.id && (
                      <React.Fragment key={part.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h3 style={{ margin: 0 }}>{part.name} PROTOCOLS</h3>
                        </div>
                        
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select a protocol below for detailed parameters.</p>
                        <ul className="protocol-list">
                          {part.protocols?.map((protocol, index) => (
                            <li key={index} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setSelectedProtocolIndex(index)}>
                              <span className="protocol-name">{protocol.name}</span>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                  className="btn-delete"
                                  onClick={(e) => deleteProtocol(e, index)}
                                  style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                                >
                                  DELETE
                                </button>
                                <span className="protocol-time" style={{ background: 'var(--accent)', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>VIEW &rarr;</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={addProtocol}
                          style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'rgba(223, 255, 0, 0.05)', border: '1px dashed var(--accent)', color: 'var(--accent)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(223, 255, 0, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(223, 255, 0, 0.05)'}
                        >
                          + ADD NEW PROTOCOL
                        </button>
                      </React.Fragment>
                    )
                  ))}
                </div>
              </>
            )}

            {/* Right: Interactive Body Map */}
            <div className="body-map-container">
              <div className="body-map-wrapper">
                {/* Needs body-scan.png in public folder */}
                <img src="/body-scan.png" alt="Human Body Map" className="body-map-img" />
                {bodyParts.map(part => (
                  <div 
                    key={part.id}
                    className={`hotspot ${activePart === part.id ? 'active' : ''}`}
                    style={{ top: part.top, left: part.left, width: part.width, height: part.height }}
                    onClick={() => setActivePart(part.id)}
                    title={part.name}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Resources */}
      <section id="resources" className="news-section">
        <div className="container">
          <h2>MR <span style={{ color: 'var(--accent)' }}>WORKSPACE</span></h2>
          <div className="grid-12">
            <div className="news-grid">
              {[
                { title: 'MR 이론', desc: '기초 물리부터 최신 시퀀스 기법까지의 학술 자료', img: '/workspace_theory.png' },
                { title: '장비 현황', desc: '필립스 3T 및 지멘스 3T 장비 스펙 및 코일 가용 상태 확인', img: '/workspace_equipment.png' },
                { title: '학생 공간', desc: '실습생 및 신규 입사자를 위한 교육 가이드 및 Q&A', img: '/workspace_student.png' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="news-card card" 
                  onClick={() => { 
                    if(item.title === 'MR 이론') { setShowTheory(true); }
                    if(item.title === '학생 공간') { setShowFlashcards(true); setIsFlipped(false); setCurrentCardIndex(0); } 
                    if(item.title === '장비 현황') { setShowEquipment(true); }
                  }} 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="news-img">
                    <img src={item.img} alt={item.title} className="trendy-hover-img" />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.4, minHeight: '40px' }}>{item.desc}</p>
                    <a href="#" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid var(--accent)', fontSize: '0.8rem', letterSpacing: '1px' }}>ENTER &rarr;</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Countdown */}
      <section id="maintenance" className="countdown-section">
        <div className="container">
          <h2>NEXT SYSTEM <span style={{ color: 'var(--accent)' }}>CALIBRATION</span></h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Scheduled downtime for coil tuning and software updates.</p>
          <div className="timer">
            <div className="timer-item">
              <span className="timer-value">12</span>
              <span className="timer-label">Days</span>
            </div>
            <div className="timer-item">
              <span className="timer-value">08</span>
              <span className="timer-label">Hours</span>
            </div>
            <div className="timer-item">
              <span className="timer-value">45</span>
              <span className="timer-label">Mins</span>
            </div>
            <div className="timer-item">
              <span className="timer-value">30</span>
              <span className="timer-label">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Mobile App Integration */}
      <section className="mobile-app-section" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container grid-12" style={{ alignItems: 'center' }}>
          <div style={{ gridColumn: '1 / 7' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              HALLYM MRI <br/><span style={{ color: 'var(--accent)' }}>ON THE GO</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
              핸드폰에서도 Hallym MRI 프로토콜을 바로 확인하세요. 전용 모바일 앱과 연동하여, 언제 어디서든 최신 파라메터 정보와 임상 가이드, 장비 현황을 손쉽게 열람할 수 있습니다.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: '#0a0a0a', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(223, 255, 0, 0.2)', width: 'fit-content' }}>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://hallym-mri-dashboard.vercel.app" 
                  alt="Mobile App QR Code" 
                  style={{ width: '100px', height: '100px', display: 'block' }} 
                />
              </div>
              <div>
                <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem', fontSize: '1.2rem', fontFamily: 'Syncopate, sans-serif' }}>SCAN TO APP</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '200px', lineHeight: 1.4 }}>
                  스마트폰 기본 카메라를 켜고 QR 코드를 스캔하여 앱을 설치 및 연동하세요.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ gridColumn: '8 / -1', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0, borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Mobile App Preview" 
              style={{ borderRadius: '30px', border: '8px solid #222', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', height: '450px', objectFit: 'cover', zIndex: 1, position: 'relative' }} 
            />
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 HALLYM MEDICAL CENTER MRI DEPT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Protocol Details Modal */}
      {selectedProtocol && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              {isEditing ? (
                <>
                  <input className="edit-input name-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Protocol Name" />
                  <input className="edit-input time-input" value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} placeholder="Estimated Time" />
                </>
              ) : (
                <>
                  <h2>{selectedProtocol.name}</h2>
                  <span className="modal-time">Estimated Time: {selectedProtocol.time}</span>
                </>
              )}
            </div>
            <div className="modal-body">
              {isEditing ? (
                <>
                  <h4>Scan Sequences (one per line)</h4>
                  <textarea className="edit-textarea" value={editForm.sequencesStr} onChange={e => setEditForm({...editForm, sequencesStr: e.target.value})} rows={6} placeholder="e.g. Survey\nT2 Axial" />
                  <h4>Important Notes & Contrast</h4>
                  <textarea className="edit-textarea" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} rows={4} placeholder="Notes..." />
                  <div className="edit-actions">
                    <button className="btn" style={{ padding: '0.5rem 1.5rem', marginRight: '1rem' }} onClick={handleSaveClick}>Save</button>
                    <button className="btn" style={{ padding: '0.5rem 1.5rem', background: '#333', color: '#fff' }} onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h4>Scan Sequences</h4>
                  <ul className="modal-sequences">
                    {selectedProtocol.sequences.map((seq, idx) => (
                      <li key={idx}>{seq}</li>
                    ))}
                  </ul>
                  
                  {selectedProtocol.notes && (
                    <>
                      <h4>Important Notes & Contrast</h4>
                      <div className="modal-notes">
                        {selectedProtocol.notes}
                      </div>
                    </>
                  )}
                  <div className="edit-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn" style={{ padding: '0.5rem 1.5rem', background: '#333', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => handleCopyProtocol(selectedProtocol)}>
                      📋 COPY
                    </button>
                    <button className="btn" style={{ padding: '0.5rem 1.5rem' }} onClick={handleEditClick}>EDIT</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Flashcards Modal */}
      {showFlashcards && (
        <div className="modal-overlay" onClick={() => setShowFlashcards(false)}>
          <div className="modal-content flashcard-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', background: 'transparent', boxShadow: 'none' }}>
            <button className="modal-close" onClick={() => setShowFlashcards(false)} style={{ top: '-40px', right: '0', background: 'rgba(0,0,0,0.5)' }}>×</button>
            
            <h2 style={{ textAlign: 'center', color: 'var(--accent)', textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginBottom: '1rem' }}>MRI STUDY FLASHCARDS</h2>
            
            {isFlashcardEditing ? (
              <div style={{ background: 'rgba(30, 30, 35, 0.95)', border: '2px solid var(--accent)', borderRadius: '15px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>플래시카드 편집</h3>
                <input 
                  type="text" 
                  className="edit-input" 
                  value={editFlashcardForm.theme} 
                  onChange={(e) => setEditFlashcardForm({...editFlashcardForm, theme: e.target.value})} 
                  placeholder="테마명 (예: MRI 물리)" 
                  style={{ marginBottom: '15px', width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                />
                <textarea 
                  className="edit-textarea" 
                  value={editFlashcardForm.q} 
                  onChange={(e) => setEditFlashcardForm({...editFlashcardForm, q: e.target.value})} 
                  placeholder="질문을 입력하세요..." 
                  rows="3" 
                  style={{ marginBottom: '15px', width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                />
                <textarea 
                  className="edit-textarea" 
                  value={editFlashcardForm.a} 
                  onChange={(e) => setEditFlashcardForm({...editFlashcardForm, a: e.target.value})} 
                  placeholder="정답을 입력하세요..." 
                  rows="5" 
                  style={{ marginBottom: '20px', width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setIsFlashcardEditing(false)} style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>취소</button>
                  <button onClick={handleSaveFlashcard} style={{ padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>저장</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flashcard-container" style={{ perspective: '1000px', width: '100%', height: '350px', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} style={{ width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                    
                    {/* Front Side */}
                    <div className="flashcard-face flashcard-front" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'rgba(30, 30, 35, 0.95)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      <span style={{ position: 'absolute', top: '20px', left: '0', width: '100%', textAlign: 'center', color: 'rgba(223, 255, 0, 0.6)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>{flashcards[currentCardIndex].theme}</span>
                      <span style={{ position: 'absolute', top: '15px', left: '20px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>Q.</span>
                      <p style={{ fontSize: '1.3rem', textAlign: 'center', lineHeight: '1.6', color: '#fff', whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{flashcards[currentCardIndex].q}</p>
                      <span style={{ position: 'absolute', bottom: '15px', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>클릭해서 정답 확인</span>
                    </div>

                    {/* Back Side */}
                    <div className="flashcard-face flashcard-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'rgba(40, 45, 55, 0.95)', border: '2px solid var(--accent)', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxShadow: '0 10px 30px rgba(223, 255, 0, 0.1)', transform: 'rotateY(180deg)' }}>
                      <span style={{ position: 'absolute', top: '15px', left: '20px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem' }}>A.</span>
                      <p style={{ fontSize: '1.3rem', textAlign: 'center', lineHeight: '1.6', color: '#fff', whiteSpace: 'pre-wrap' }}>{flashcards[currentCardIndex].a}</p>
                      <span style={{ position: 'absolute', bottom: '15px', color: 'var(--accent)', fontSize: '0.9rem', opacity: '0.7' }}>클릭해서 문제로 돌아가기</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
                  <button onClick={handleEditFlashcard} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>✏️ 현재 카드 수정</button>
                  <button onClick={handleDeleteFlashcard} style={{ padding: '6px 12px', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️ 카드 삭제</button>
                  <button onClick={handleAddFlashcard} style={{ padding: '6px 12px', background: 'rgba(223,255,0,0.1)', color: 'var(--accent)', border: '1px solid rgba(223,255,0,0.3)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>➕ 새 카드 추가</button>
                </div>

                <div className="flashcard-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px' }}>
                  <button 
                    onClick={() => { setIsFlipped(false); setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1)); }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    &larr; 이전 문제
                  </button>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {currentCardIndex + 1} / {flashcards.length}
                  </span>
                  <button 
                    onClick={() => { setIsFlipped(false); setCurrentCardIndex(prev => (prev < flashcards.length - 1 ? prev + 1 : 0)); }}
                    style={{ background: 'var(--accent)', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    다음 문제 &rarr;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Theory Modal */}
      {showTheory && (
        <div className="modal-overlay" onClick={() => setShowTheory(false)}>
          <div className="modal-content theory-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setShowTheory(false)}>×</button>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h2>MRI 핵심 이론 및 파라미터 가이드</h2>
              <span className="modal-time">물리 원리, 파라미터 설정 및 시퀀스 최적화</span>
            </div>
            <div className="modal-body" style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1rem' }}>
              
              {/* 1. MRI 파라미터 원리 정리 (Image + Flashcards) */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>1. MRI 파라미터 원리 정리</h3>
              
              <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ color: '#fff', marginTop: 0 }}>▶ SNR (Signal to Noise Ratio, 신호 대 잡음비)</h4>
                <p style={{ margin: '5px 0' }}><strong>뜻:</strong> 사진 속 "유용한 정보(신호)" / "지저분한 얼룩(잡음)"의 비율입니다.</p>
                <p style={{ margin: '5px 0' }}><strong>원리:</strong> 신호는 수소(H) 원자에서 나오는 정돈된 파동이고, 잡음은 기계/환경에서 오는 무작위 파동입니다. 보셀(Voxel)에 담긴 프로톤 수에 비례하므로, 보셀 크기를 키우면 신호가 더 모여 SNR이 상승하여 사진이 깨끗해집니다. 반대로 보셀이 작으면 신호가 흩어져 SNR이 떨어집니다.</p>
                <p style={{ margin: '5px 0', color: 'var(--text-muted)' }}>*단, 보셀을 키우면 작은 구조가 뭉개지는 부분용적효과(Partial Volume Effect)가 발생해 해상도는 떨어질 수 있습니다.</p>
              </div>

              <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ color: '#fff', marginTop: 0 }}>▶ SAR (Specific Absorption Rate)</h4>
                <p style={{ margin: '5px 0' }}><strong>뜻:</strong> 1kg의 몸이 1초에 흡수하는 RF 에너지 (W/kg).</p>
                <p style={{ margin: '5px 0' }}><strong>중요성:</strong> 전자레인지처럼 RF가 인체 내 물분자를 흔들어 열을 발생시키기 때문입니다. SAR이 높으면 환자 체온이 상승하고 화상 위험이 있습니다.</p>
                <p style={{ margin: '5px 0' }}><strong>원리 및 대처:</strong> TR을 짧게, Flip angle을 크게, TSE(다중 펄스)를 많이 쓰면 더 많은 RF 펄스가 들어가 에너지를 많이 흡수하게 됩니다. SAR 경고 시 TR을 늘리거나, Flip angle 및 ETL을 줄여서 에너지를 낮출 수 있습니다.</p>
              </div>

              <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ color: '#fff', marginTop: 0 }}>▶ Voxel (Volume element) & K-space</h4>
                <p style={{ margin: '5px 0' }}><strong>Voxel:</strong> MRI 영상의 3D 픽셀 단위입니다.</p>
                <p style={{ margin: '5px 0' }}><strong>K-space:</strong> 중앙부는 영상의 대조도(명암)를 결정하고, 주변부는 세부 윤곽선(해상도)을 결정합니다.</p>
              </div>

              {/* 2. 대조도 및 기본 물리 특성 */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>2. 대조도 및 시퀀스 기본 특성</h3>
              <ul style={{ paddingLeft: '20px', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '10px' }}><strong>TR (Repetition Time):</strong> 한 슬라이스의 수소 원자를 자극하고 다음 자극까지 기다리는 시간. 영상의 <strong>T1 대조도</strong>를 결정합니다. (TR을 짧게 하면 T1 강조 영상)</li>
                <li style={{ marginBottom: '10px' }}><strong>TE (Echo Time):</strong> RF 자극 후 신호를 듣는 시점. 영상의 <strong>T2 대조도</strong>를 결정합니다. (TE를 길게 하면 T2 강조 영상)</li>
                <li style={{ marginBottom: '10px' }}><strong>조직별 신호 특성:</strong> 지방(Fat)은 T1이 짧아 T1 강조 영상에서 밝게 보입니다. 물(Water)은 T2가 길어 T2 강조 영상에서 밝게 보입니다.</li>
                <li style={{ marginBottom: '10px' }}><strong>대역폭 (Bandwidth):</strong> 넓히면 화학적 이동(Chemical Shift) 및 금속 인공물 왜곡이 감소하지만, 잡음이 유입되어 전체 SNR은 크게 하락합니다.</li>
                <li style={{ marginBottom: '10px' }}><strong>가속 팩터 (Parallel Imaging):</strong> 가속 팩터(R)를 올리면 검사 시간은 단축되나, SNR은 가속 팩터의 루트 배(√R)만큼 무조건 감소합니다.</li>
              </ul>

              {/* 3. 제조사별 명칭 정리 (Flashcards 참고) */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>3. 제조사별 특수 시퀀스 명칭</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#ddd' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--accent)' }}>기법 명칭</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--accent)' }}>Philips</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--accent)' }}>Siemens</th>
                    <th style={{ padding: '10px', borderBottom: '2px solid var(--accent)' }}>GE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>3D 고해상도 T1 강조</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>3D TFE / FFE</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>MP-RAGE</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>3D BRAVO</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>가변 숙임각 3D T2/FLAIR</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>VISTA</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SPACE</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>CUBE</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>자화율 영상 (미세출혈)</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SWIp</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SWI</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>SWAN</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>물/지방 분리 (Dixon)</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>mDixon</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Dixon VIBE/TSE</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>IDEAL</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      )}

      {/* Equipment Modal */}
      {showEquipment && (
        <div className="modal-overlay" onClick={() => setShowEquipment(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setShowEquipment(false)}>×</button>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h2>MRI 장비 현황 및 운영 가이드</h2>
              <span className="modal-time">장비 스펙, 코일 현황 및 1.5T/3T 활용 지침</span>
            </div>
            <div className="modal-body" style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1rem' }}>
              
              {/* 1. 현재 운용 장비 현황 */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>1. 한림대성심병원 운용 장비 현황</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                {/* Philips 3T */}
                <div style={{ background: 'rgba(30,30,35,0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(223, 255, 0, 0.3)' }}>
                  <h4 style={{ color: 'var(--accent)', marginTop: 0, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🧲</span> Philips 3T
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, color: '#ddd', lineHeight: '1.8', fontSize: '0.95rem' }}>
                    <li><strong>자장 세기:</strong> 3.0 Tesla (초전도 자석)</li>
                    <li><strong>보어 사이즈:</strong> 70cm (Wide Bore, 폐쇄공포증 완화)</li>
                    <li><strong>핵심 기술:</strong> dStream 디지털 광대역 수신 기술</li>
                    <li><strong>가용 코일:</strong> dS Head/Neck, Anterior/Posterior Torso, MSK, Breast Coil</li>
                    <li style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                      <strong>주력 검사 분야:</strong><br/>
                      복부 동적 조영(eTHRIVE), 심장(Cardiac), 전립선(Prostate) 등 체간부 정밀 영상
                    </li>
                  </ul>
                </div>

                {/* Siemens 3T */}
                <div style={{ background: 'rgba(30,30,35,0.8)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(223, 255, 0, 0.3)' }}>
                  <h4 style={{ color: 'var(--accent)', marginTop: 0, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚙️</span> Siemens 3T
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, color: '#ddd', lineHeight: '1.8', fontSize: '0.95rem' }}>
                    <li><strong>자장 세기:</strong> 3.0 Tesla (초전도 자석)</li>
                    <li><strong>보어 사이즈:</strong> 70cm (Wide Bore, 환자 편의성 증대)</li>
                    <li><strong>핵심 기술:</strong> Tim 4G 기술 & 자동화 Dot 엔진</li>
                    <li><strong>가용 코일:</strong> Head/Neck 20/64, Spine 32, Body 18, TxRx Knee, Flex</li>
                    <li style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                      <strong>주력 검사 분야:</strong><br/>
                      뇌혈관 정밀(MRA/DTI), 척추(Spine), 관절(Knee/Shoulder) 등 신경계 및 근골격계
                    </li>
                  </ul>
                </div>
              </div>

              {/* 2. 자장 강도 비교 */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: '20px' }}>2. 자장 강도 비교 (1.5T vs 3T)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '10px' }}>▶ 1.5T MRI (다목적 표준 장비)</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
                    <li><strong>보급형 스캐너:</strong> 전 세계에서 가장 널리 사용되는 자장 강도. 일반 전신 촬영, 근골격, 심장, 신경 영상에 적합.</li>
                    <li><strong>장점:</strong> 광범위한 임상 적용, 저렴한 설치/유지 비용, 최신 코일/소프트웨어 호환성 우수.</li>
                  </ul>
                </div>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '10px' }}>▶ 3T MRI (고해상도 및 고속 촬영용)</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
                    <li><strong>해상도와 속도:</strong> 1.5T 대비 두 배의 자장 강도. 뇌, 심장, 관절, 혈관, 전립선 등 미세 구조를 고해상도로 빠르게 촬영.</li>
                    <li><strong>고려 사항:</strong> 높은 장비 및 유지관리 비용(25~50%↑). 빠른 획득 시간으로 다수 환자 처리(처리량 증대) 가능.</li>
                  </ul>
                </div>
              </div>

              {/* 3. 코일 종류 및 관리 */}
              <h3 style={{ color: 'var(--accent)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>3. MRI 코일(Coil) 종류와 관리 현황</h3>
              <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>
                코일은 인체에서 나오는 신호를 수신하는 <strong>안테나</strong> 역할을 하며, 적절한 코일 사용과 정기적 유지보수(수리/교체)가 균일성, 신호대잡음비(SNR), 그리고 환자 안전을 보장합니다.
              </p>
              
              <ul style={{ fontSize: '0.95rem', marginBottom: '30px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '10px' }}><strong>두부 (Head) 코일:</strong> 뇌와 경추 촬영에 사용. '버드케이지' 구조로 설계되어 환자가 외부를 볼 수 있으며 신경혈관 질환 감지에 효율적. (예: Siemens 1.5T CP Head Array, GE 8채널 Neurovascular)</li>
                <li style={{ marginBottom: '10px' }}><strong>몸통 및 척추 (Body & Spine) 코일:</strong> 벨크로로 몸에 고정하는 대형 코일로 척추, 복부, 흉부, 전신 스캔에 사용. (예: Siemens Body-18 Flex Coil, 프레임형 유방 전용 코일)</li>
                <li style={{ marginBottom: '10px' }}><strong>사지 및 다목적 코일:</strong> 손목, 무릎, 어깨 등 특정 관절 촬영용. 다목적 사용이 가능한 플렉스형 배열 코일 포함.</li>
              </ul>

              <div style={{ padding: '15px', background: 'rgba(223, 255, 0, 0.05)', border: '1px dashed var(--accent)', borderRadius: '8px', textAlign: 'center', fontSize: '0.95rem', color: '#fff', fontWeight: 'bold' }}>
                🚨 장비 점검 및 코일 관리 가이드라인 (ACR 지침 준수 요망) <br/>
                코일 교체 및 기기 업그레이드 시 반드시 각 호기 담당 방사선사에게 인수인계 바랍니다.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
