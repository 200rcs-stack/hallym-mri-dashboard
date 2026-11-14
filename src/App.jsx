import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  technologistsList,
  bodyPartsConfig,
  parameterPrinciplesData,
  practicalToolsData,
  backendService
} from './backend/storageService';

// 한림대학교성심병원 공식 센터 아이콘 매핑 (360도 회전 애니메이션용)
const hallymCenterIcons = {
  brain: './hallym/ptm405_img2_CNC_b.png',     // 뇌신경센터 아이콘
  'c-spine': './hallym/ptm405_img2_SPC_b.png', // 척추센터 아이콘
  chest: './hallym/ptm405_img2_CVC_b.png',     // 심장혈관센터 아이콘
  abdomen: './hallym/ptm405_img2_DDC_b.png',   // 간소화기센터 아이콘
  pelvis: './hallym/ptm405_img2_BEC_b.png',    // 유방내분비암센터 아이콘
  knee: './hallym/ptm405_img2_HCC_b.png'       // 암/관절센터 아이콘
};

function App() {
  // ==========================================================================
  // 1. 백엔드 상태 관리 (LocalStorage 동기화 + 모듈형 DB)
  // ==========================================================================
  const [protocolsDB, setProtocolsDB] = useState(() => backendService.loadProtocols());
  const [noticesList, setNoticesList] = useState(() => backendService.loadNotices());
  const [flashcards, setFlashcards] = useState(() => backendService.loadFlashcards());

  useEffect(() => {
    backendService.saveProtocols(protocolsDB);
  }, [protocolsDB]);

  useEffect(() => {
    backendService.saveNotices(noticesList);
  }, [noticesList]);

  useEffect(() => {
    backendService.saveFlashcards(flashcards);
  }, [flashcards]);

  // ==========================================================================
  // 2. 대시보드 인터랙션 상태 (초보자 친화형)
  // ==========================================================================
  const [selectedPart, setSelectedPart] = useState('brain');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickChip, setActiveQuickChip] = useState('ALL');
  const [copyToast, setCopyToast] = useState('');

  // 메인 비주얼 비디오 재생/일시정지 상태 (한림대성심병원 홈페이지 기능 동일 구현)
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const toggleHeroVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // 프로토콜 상세 모달 (초보자용 4단계 탭)
  const [viewingProtocol, setViewingProtocol] = useState(null);
  const [protocolStepTab, setProtocolStepTab] = useState('step1'); // step1 | step2 | step3 | step4

  // 프로토콜 추가/수정 모달
  const [isEditProtocolOpen, setIsEditProtocolOpen] = useState(false);
  const [editingProtoMode, setEditingProtoMode] = useState('add');
  const [protoForm, setProtoForm] = useState({
    part: 'brain',
    id: '',
    name: '',
    tag: '표준 프로토콜',
    time: '20 Min',
    coilPosition: '',
    contrastInfo: '',
    sequencesText: '',
    easyGuideText: '',
    pacsRuleText: '',
    updatesText: '',
    refImage: ''
  });

  // 워크스페이스 4대 모달 + 백엔드 관리 모달 + 콘솔 사진 확대 모달
  const [activeWorkspaceModal, setActiveWorkspaceModal] = useState(null); // 'parameter' | 'clinical' | 'equipment' | 'student' | 'backend'
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // [모달 1: 파라메타 원리 (독립 분리 섹션)] 서브탭 & 실시간 시뮬레이터 상태
  const [paramSubTab, setParamSubTab] = useState('core10');
  const [consoleSearch, setConsoleSearch] = useState('');
  const [simVoxel, setSimVoxel] = useState(50);
  const [simBW, setSimBW] = useState(50);
  const [simETL, setSimETL] = useState(40);
  const [simTR, setSimTR] = useState(55);

  // [모달 2: 임상 공지 & 에러 해결] 서브탭 상태
  const [clinicalCategory, setClinicalCategory] = useState('all');

  // [모달 4: 3D 플래시카드] 상태
  const [cardThemeFilter, setCardThemeFilter] = useState('ALL');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [cardForm, setCardForm] = useState({ theme: '테마 3: 한림 실무 & 최신지침', q: '', a: '' });

  // [모달 5: 백엔드 관리 콘솔] 탭 상태
  const [backendTab, setBackendTab] = useState('overview');
  const [backendSearch, setBackendSearch] = useState('');

  // ==========================================================================
  // 3. 유틸리티 함수 (복사, 음성 TTS, 프로토콜 열기/저장)
  // ==========================================================================
  const showToast = (msg) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 2600);
  };

  const handleCopyText = (text, label = '클립보드에 복사되었습니다!') => {
    navigator.clipboard.writeText(text);
    showToast(`✅ ${label}`);
  };

  const speakEnglish = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 초보자용 빠른 필터 칩 목록
  const quickChips = [
    { id: 'ALL', label: '전체 보기', query: '' },
    { id: 'URGENT', label: '🚨 교수님·최신지침 있는 검사만', query: '__URGENT__' },
    { id: 'JEON', label: '#전치만교수님 3D (0.8mm)', part: 'brain', query: '전치만' },
    { id: 'MASS', label: '#고성혜교수님 Extremity Mass', part: 'knee', query: 'Extremity' },
    { id: 'SHOULDER', label: '#Shoulder 순서·손바닥위로', part: 'knee', query: 'Shoulder' },
    { id: 'MRCP', label: '#MRCP RF Power 에러해결', part: 'abdomen', query: 'MRCP' },
    { id: 'ANKLE', label: '#Ankle 아킬레스·PD FS AX', part: 'knee', query: 'Ankle' },
    { id: 'HEART', label: '#심장 MRI 파라메타 표', part: 'chest', query: 'Heart' },
    { id: 'ENTERO', label: '#소장 음수·부스코판 3회', part: 'abdomen', query: 'Enterography' }
  ];

  const handleQuickChipClick = (chip) => {
    setActiveQuickChip(chip.id);
    if (chip.part) {
      setSelectedPart(chip.part);
    }
    if (chip.query === '__URGENT__') {
      setSearchQuery('');
    } else {
      setSearchQuery(chip.query);
    }
  };

  // 현재 선택된 부위 또는 전체 검색 결과 필터링
  const displayedProtocols = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const results = [];
      Object.entries(protocolsDB).forEach(([partKey, list]) => {
        const partObj = bodyPartsConfig.find((b) => b.id === partKey);
        list.forEach((proto) => {
          const hay = [
            proto.name,
            proto.tag,
            proto.coilPosition,
            proto.contrastInfo,
            ...(proto.sequences || []),
            ...(proto.easyGuide || []),
            ...(proto.pacsRule || []),
            ...(proto.updates2026 || [])
          ]
            .join(' ')
            .toLowerCase();
          if (hay.includes(q)) {
            results.push({ ...proto, _partKey: partKey, _partLabel: partObj?.koLabel || partKey.toUpperCase() });
          }
        });
      });
      return results;
    }

    const currentList = protocolsDB[selectedPart] || [];
    if (activeQuickChip === 'URGENT') {
      return currentList
        .filter((p) => p.updates2026 && p.updates2026.length > 0)
        .map((p) => ({ ...p, _partKey: selectedPart }));
    }
    return currentList.map((p) => ({ ...p, _partKey: selectedPart }));
  }, [protocolsDB, selectedPart, searchQuery, activeQuickChip]);

  const openProtocolDetail = (proto, defaultStep = 'step1') => {
    setViewingProtocol(proto);
    setProtocolStepTab(defaultStep);
  };

  const openAddProtocolModal = (partKey = selectedPart) => {
    setEditingProtoMode('add');
    setProtoForm({
      part: partKey,
      id: `proto-${Date.now()}`,
      name: '',
      tag: '신규 프로토콜',
      time: '20 Min',
      coilPosition: '전용 코일 · 환자 자세 확인',
      contrastInfo: '처방 확인',
      sequencesText: '',
      easyGuideText: '',
      pacsRuleText: '',
      updatesText: '',
      refImage: ''
    });
    setIsEditProtocolOpen(true);
  };

  const openEditProtocolModal = (proto) => {
    const partKey = proto._partKey || selectedPart;
    setEditingProtoMode('edit');
    setProtoForm({
      part: partKey,
      id: proto.id,
      name: proto.name || '',
      tag: proto.tag || '표준',
      time: proto.time || '20 Min',
      coilPosition: proto.coilPosition || '',
      contrastInfo: proto.contrastInfo || '',
      sequencesText: (proto.sequences || []).join('\n'),
      easyGuideText: (proto.easyGuide || []).join('\n'),
      pacsRuleText: (proto.pacsRule || []).join('\n'),
      updatesText: (proto.updates2026 || []).join('\n'),
      refImage: proto.refImage || ''
    });
    setIsEditProtocolOpen(true);
  };

  const handleSaveProtocolForm = (e) => {
    e.preventDefault();
    if (!protoForm.name.trim()) return;

    const toLines = (txt) =>
      txt
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

    const newProtoObj = {
      id: protoForm.id || `proto-${Date.now()}`,
      name: protoForm.name.trim(),
      tag: protoForm.tag.trim() || '표준',
      time: protoForm.time.trim() || '20 Min',
      coilPosition: protoForm.coilPosition.trim() || '전용 코일',
      contrastInfo: protoForm.contrastInfo.trim() || '처방 확인',
      sequences: toLines(protoForm.sequencesText),
      easyGuide: toLines(protoForm.easyGuideText),
      pacsRule: toLines(protoForm.pacsRuleText),
      updates2026: toLines(protoForm.updatesText),
      refImage: protoForm.refImage || undefined,
      tableData: viewingProtocol?.tableData || undefined
    };

    newProtoObj.notes = [
      `[시퀀스] ${newProtoObj.sequences.join(' → ')}`,
      ...newProtoObj.easyGuide,
      ...newProtoObj.pacsRule,
      ...newProtoObj.updates2026
    ].join('\n• ');

    setProtocolsDB((prev) => {
      const targetPart = protoForm.part;
      const list = [...(prev[targetPart] || [])];
      const existingIdx = list.findIndex((item) => item.id === newProtoObj.id);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...newProtoObj };
      } else {
        list.push(newProtoObj);
      }
      return { ...prev, [targetPart]: list };
    });

    setViewingProtocol({ ...newProtoObj, _partKey: protoForm.part });
    setIsEditProtocolOpen(false);
    showToast('✅ 프로토콜이 백엔드 DB에 저장되었습니다!');
  };

  const handleDeleteProtocol = (partKey, protoId, protoName) => {
    if (!window.confirm(`정말로 '${protoName}' 프로토콜을 삭제하시겠습니까?`)) return;
    setProtocolsDB((prev) => ({
      ...prev,
      [partKey]: (prev[partKey] || []).filter((p) => p.id !== protoId)
    }));
    if (viewingProtocol?.id === protoId) {
      setViewingProtocol(null);
    }
    showToast('🗑️ 프로토콜이 삭제되었습니다.');
  };

  // ==========================================================================
  // 4. 파라메타 시뮬레이터 계산식
  // ==========================================================================
  const simMetrics = useMemo(() => {
    const snr = Math.min(100, Math.max(10, Math.round(simVoxel * 0.65 + (100 - simBW) * 0.35 + simTR * 0.15)));
    const scanTime = Math.min(100, Math.max(10, Math.round(simTR * 0.45 + (100 - simVoxel) * 0.45 + (100 - simETL) * 0.4)));
    const clarity = Math.min(100, Math.max(10, Math.round(simBW * 0.5 + (100 - simVoxel) * 0.45 - simETL * 0.15 + 15)));
    const sar = Math.min(100, Math.max(10, Math.round((100 - simTR) * 0.55 + simETL * 0.45)));
    return { snr, scanTime, clarity, sar };
  }, [simVoxel, simBW, simETL, simTR]);

  const filteredFlashcards = useMemo(() => {
    if (cardThemeFilter === 'ALL') return flashcards;
    return flashcards.filter((c) => c.theme === cardThemeFilter);
  }, [flashcards, cardThemeFilter]);

  const activeFlashcard = filteredFlashcards[currentCardIdx] || filteredFlashcards[0] || {
    theme: '카드 없음',
    q: '등록된 플래시카드가 없습니다.',
    a: '새 카드를 추가해주세요.'
  };

  const backendStats = useMemo(
    () => backendService.getBackendStats(protocolsDB, noticesList, flashcards),
    [protocolsDB, noticesList, flashcards]
  );

  const currentPartInfo = bodyPartsConfig.find((b) => b.id === selectedPart) || bodyPartsConfig[0];

  return (
    <div className="app-wrapper">
      {/* 복사 완료 토스트 알림 */}
      {copyToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            background: '#f75077',
            color: '#fff',
            padding: '0.9rem 1.5rem',
            borderRadius: '30px',
            fontWeight: 800,
            fontSize: '0.96rem',
            zIndex: 9999,
            boxShadow: '0 12px 30px rgba(247, 80, 119, 0.4)'
          }}
        >
          {copyToast}
        </div>
      )}

      {/* ====================================================================
          1. 한림대학교성심병원 상단 민트 공지 배너 (.new_header_banner 스타일)
         ==================================================================== */}
      <div className="hallym-top-mint-banner">
        <div className="hallym-top-mint-inner">
          <div className="mint-banner-left">
            <span className="mint-pill">초보자 필독 지침</span>
            <span>
              피부·성형·혈종 사지 처방은 <strong>Extremity Mass(+마커)</strong> · Shoulder는{' '}
              <strong>손바닥 위로(AX→SAG→COR)</strong> · 전치만 교수님 Brain 3D는{' '}
              <strong>0.8mm 스캔 후 1mm Recon</strong>
            </span>
          </div>
          <div className="mint-banner-right">
            <button
              type="button"
              onClick={() => setActiveWorkspaceModal('clinical')}
              style={{
                background: '#ffffff',
                color: '#01a29a',
                border: '1px solid #01a29a',
                padding: '0.28rem 0.85rem',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              최신 지침 14건 전체보기 +
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. 한림대학교성심병원 공식 2단 헤더 (.top + .gnb)
         ==================================================================== */}
      <header className="hallym-header">
        <div className="hallym-header-top">
          <div className="hallym-header-top-inner">
            <div className="hallym-brand-box" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="./hallym/img_logo.png"
                alt="한림대학교성심병원 공식 로고"
                className="hallym-official-logo"
              />
              <span className="hallym-dept-badge">영상의학과 · 3.0T MRI실</span>
            </div>

            <div className="hallym-tgnb">
              <button
                type="button"
                className="tgnb-link"
                style={{ background: '#fff0f3', color: '#e64361', borderColor: '#ffc2d1', fontWeight: 800 }}
                onClick={() => {
                  const publicUrl = 'https://hallym-mri-dashboard.vercel.app/';
                  navigator.clipboard?.writeText(publicUrl);
                  alert(`✅ 로그인 없이 어느 컴퓨터에서나 바로 열리는 공개 주소가 복사되었습니다!\n\n👉 ${publicUrl}\n(보조 주소: https://200rcs-stack.github.io/hallym-mri-dashboard/)`);
                }}
              >
                🔗 다른 PC 공유주소 복사 (로그인 불필요)
              </button>
              <button
                type="button"
                className="tgnb-link"
                onClick={() => setActiveWorkspaceModal('equipment')}
              >
                🌐 JLK 뇌졸중서버 (10.65.17.93)
              </button>
              <button
                type="button"
                className="tgnb-link"
                onClick={() => {
                  setClinicalCategory('english');
                  setActiveWorkspaceModal('clinical');
                }}
              >
                🔊 외국인 영어안내 방송
              </button>
              <button
                type="button"
                className="tgnb-link"
                onClick={() => setActiveWorkspaceModal('backend')}
              >
                ⚙️ 백엔드 DB 관리
              </button>
              <div className="tgnb-tel-box">
                ☎️ 응급실 처방변경 <span>1576</span> · 착신 <span>#41 / #49</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="hallym-gnb">
          <div className="hallym-gnb-inner">
            <ul className="gnb-menu-list">
              <li>
                <a href="#protocols" className="gnb-menu-item">
                  📋 부위별 MRI 프로토콜
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="gnb-menu-item highlight-pink"
                  onClick={() => setActiveWorkspaceModal('parameter')}
                >
                  🎛️ 파라메타 원리 연구소 (독립분리)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="gnb-menu-item"
                  onClick={() => {
                    setClinicalCategory('all');
                    setActiveWorkspaceModal('clinical');
                  }}
                >
                  👨‍⚕️ 교수님 특별지침 · 에러해결
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="gnb-menu-item"
                  onClick={() => setActiveWorkspaceModal('equipment')}
                >
                  📤 외부서버 전송 (ISP·JLK·Tera)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="gnb-menu-item highlight-teal"
                  onClick={() => setActiveWorkspaceModal('student')}
                >
                  🎓 학생 · 신규자 3D 플래시카드
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="gnb-menu-item"
                  onClick={() => setActiveWorkspaceModal('backend')}
                >
                  🗂️ 백엔드 데이터 콘솔
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* ====================================================================
            3. 첫 화면: 한림 메인 비주얼 동영상 + 실시간 3.0T 모션그래픽 + 방사선사 11명 + 4대 플로팅 화이트 박스 (.mbbox)
           ==================================================================== */}
        <section className="hallym-hero-section">
          <div className="visual-roll-banner">
            <div className="visual-bg-media">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                loop
                poster="./hallym/visual_1920_04.jpg"
              >
                <source src="https://hallym.hallym.or.kr/img/visual_05.mp4" type="video/mp4" />
              </video>
              <div className="visual-warm-overlay"></div>
            </div>

            <div className="visual-inner-grid">
              {/* 좌측: 한림대학교성심병원 공식 슬로건 & 동영상 제어 */}
              <div className="visual-slogan-box">
                <div className="visual-slogan-badge">
                  <span>HALLYM UNIVERSITY SACRED HEART HOSPITAL</span>
                </div>
                <h1>
                  성심에 <span>AI와 정밀영상</span>을 더한
                  <br />
                  한림대학교성심병원 MRI실
                </h1>
                <p>
                  Start your healthy and happy life with us.
                  <br />
                  초보자도 보기 편한 <strong>4단계 표준 프로토콜 가이드</strong>와 독립 분리된{' '}
                  <strong>MRI 파라메타 원리 연구소</strong>를 한눈에 만나보세요.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={toggleHeroVideo}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.5)',
                      color: '#fff',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {isVideoPlaying ? '⏸ 배경영상 일시정지' : '▶ 배경영상 재생'}
                  </button>
                </div>
              </div>

              {/* 중앙: 첫 화면에 바로 보이는 라이브 3.0T MRI 스핀-에코 모션그래픽 위젯 */}
              <div className="hallym-mri-live-widget">
                <div className="live-widget-head">
                  <span>🧲 3.0T MRI RESONANCE</span>
                  <span className="live-status-pill">
                    <span className="pulse-pink-dot"></span> RF PULSE LIVE
                  </span>
                </div>

                <div className="gantry-anim-ring-wrap">
                  <div className="gantry-ring-1"></div>
                  <div className="gantry-ring-2"></div>
                  <div className="gantry-ring-3">
                    <div className="gantry-laser"></div>
                    <strong style={{ fontSize: '1.25rem', color: '#f75077', fontWeight: 900 }}>3.0T</strong>
                    <span style={{ fontSize: '0.72rem', color: '#363e69', fontWeight: 800 }}>SPIN ECHO</span>
                  </div>
                </div>

                <div className="hallym-rf-bars">
                  {Array.from({ length: 14 }).map((_, idx) => (
                    <div key={idx} className="hallym-rf-bar"></div>
                  ))}
                </div>
              </div>

              {/* 우측: MR TECHNOLOGISTS 11명 자동 스크롤 화이트/글래스 카드 */}
              <div className="hallym-tech-card">
                <div className="tech-card-header">
                  <span>👨‍⚕️ MR TECHNOLOGISTS</span>
                  <span
                    style={{
                      background: '#fff0f3',
                      color: '#e64361',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.78rem'
                    }}
                  >
                    {technologistsList.length}명
                  </span>
                </div>
                <div className="tech-scroll-window">
                  <div className="tech-scroll-track">
                    <div className="tech-names-group">
                      {technologistsList.map((name, idx) => (
                        <p key={`t1-${idx}`}>{name}</p>
                      ))}
                    </div>
                    <div className="tech-names-group" aria-hidden="true">
                      {technologistsList.map((name, idx) => (
                        <p key={`t2-${idx}`}>{name}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 한림대성심병원 공식 첫 화면 4대 플로팅 화이트 박스 (.mbbox -> .mb01 ~ .mb04) */}
          <div className="hallym-mbbox-wrap">
            <div className="hallym-mbb-grid">
              {/* 박스 1: 부위별 프로토콜 (main_icon_01.svg) */}
              <div className="hallym-mb-card">
                <div>
                  <div className="hallym-mb-title">MRI 프로토콜</div>
                  <div className="hallym-mb-sub">6대 부위별 표준 시퀀스 · PACS</div>
                </div>
                <img src="./hallym/main_icon_01.svg" alt="프로토콜 아이콘" className="hallym-mb-icon" />
                <div className="hallym-mbbt-group">
                  <a href="#protocols" className="hallym-pill-btn">
                    프로토콜 보기
                  </a>
                  <button
                    type="button"
                    className="hallym-pill-btn"
                    onClick={() => openAddProtocolModal(selectedPart)}
                  >
                    + 신규 등록
                  </button>
                </div>
              </div>

              {/* 박스 2: 파라메타 원리 연구소 (main_icon_02.svg) */}
              <div className="hallym-mb-card">
                <div>
                  <div className="hallym-mb-title">파라메타 원리</div>
                  <div className="hallym-mb-sub">독립 분리 · T1/T2 · 시뮬레이터</div>
                </div>
                <img src="./hallym/main_icon_02.svg" alt="파라메타 아이콘" className="hallym-mb-icon" />
                <div className="hallym-mbbt-group">
                  <button
                    type="button"
                    className="hallym-pill-btn outline-pink"
                    onClick={() => setActiveWorkspaceModal('parameter')}
                  >
                    🎛️ 파라메타 연구소 열기
                  </button>
                </div>
              </div>

              {/* 박스 3: 교수님 특별지침 & 에러 대처 (main_icon_03.svg) */}
              <div className="hallym-mb-card">
                <div>
                  <div className="hallym-mb-title">교수님 특별지침</div>
                  <div className="hallym-mb-sub">최신 개정 공지 · 에러 1·2순위</div>
                </div>
                <img src="./hallym/main_icon_03.svg" alt="특별지침 아이콘" className="hallym-mb-icon" />
                <div className="hallym-mbbt-group">
                  <button
                    type="button"
                    className="hallym-pill-btn outline-pink"
                    onClick={() => {
                      setClinicalCategory('all');
                      setActiveWorkspaceModal('clinical');
                    }}
                  >
                    🔔 필독 지침 14건 검색
                  </button>
                </div>
              </div>

              {/* 박스 4: 외부 AI 서버 & 3D 플래시카드 (main_icon_04.svg) */}
              <div className="hallym-mb-card">
                <div>
                  <div className="hallym-mb-title">서버 · 3D 학습</div>
                  <div className="hallym-mb-sub">JLK · ISP · 신규자 교육카드</div>
                </div>
                <img src="./hallym/main_icon_04.svg" alt="서버 학습 아이콘" className="hallym-mb-icon" />
                <div className="hallym-mbbt-group">
                  <button
                    type="button"
                    className="hallym-pill-btn"
                    onClick={() => setActiveWorkspaceModal('equipment')}
                  >
                    서버 매트릭스
                  </button>
                  <button
                    type="button"
                    className="hallym-pill-btn"
                    onClick={() => setActiveWorkspaceModal('student')}
                  >
                    3D 플래시카드
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. 한림대성심병원 센터 아이콘 바 (.main_health_center 360도 회전 애니메이션)
           ==================================================================== */}
        <section className="hallym-center-strip">
          <div className="hallym-center-box">
            <div className="center-strip-left">
              <h3>검사부위 / 센터</h3>
              <a href="#protocols" className="center-more-badge">
                전체 프로토콜 +
              </a>
            </div>

            <div className="center-icons-list">
              {bodyPartsConfig.map((part) => (
                <a
                  key={part.id}
                  href="#protocols"
                  className={`center-icon-item ${selectedPart === part.id && !searchQuery ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPart(part.id);
                    setSearchQuery('');
                    setActiveQuickChip('ALL');
                  }}
                >
                  <img
                    src={hallymCenterIcons[part.id] || './hallym/ptm405_img2_CNC_b.png'}
                    alt={part.koLabel}
                  />
                  <span>{part.koLabel}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. 부위별 인터랙티브 프로토콜 셀렉터 (한림 수직 탭 + 화이트 카드 + 3D 인체 스캐너)
           ==================================================================== */}
        <section id="protocols" className="protocol-selector">
          <div className="section-header-row">
            <div>
              <h2>
                부위별 <span>MRI 표준 프로토콜</span> 가이드
              </h2>
              <p>
                좌측 부위 탭이나 우측 3D 인체 스캔 맵을 선택하세요. 프로토콜을 클릭하면 초보자용 4단계 창이 열립니다.
              </p>
            </div>
            <button
              type="button"
              className="cta-btn"
              onClick={() => openAddProtocolModal(selectedPart)}
            >
              + 새 프로토콜 추가
            </button>
          </div>

          {/* 초보자용 통합 검색 & 해시태그 필터 바 */}
          <div className="protocol-search-bar">
            <div className="search-input-wrap">
              <span style={{ fontSize: '1.15rem' }}>🔍</span>
              <input
                type="text"
                placeholder="검사명, 교수님 성함(전치만, 고성혜, 노규철), 질환(Mass, LTT, 아킬레스), 서버(JLK, ISP) 입력..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveQuickChip('CUSTOM');
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveQuickChip('ALL');
                  }}
                  style={{
                    background: '#e2e6f0',
                    border: 'none',
                    color: '#333',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  검색 초기화 ✕
                </button>
              )}
            </div>

            <div className="quick-chips-row">
              <span className="chip-label">⚡ 초보자 원클릭 필터:</span>
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={`quick-chip ${activeQuickChip === chip.id ? 'active' : ''}`}
                  onClick={() => handleQuickChipClick(chip)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column 대시보드 */}
          <div className="interactive-container">
            {/* 좌측: 한림대성심병원 수직 탭 (우측 7px 핑크 보더) */}
            <div className="tabs-container">
              {bodyPartsConfig.map((part) => {
                const count = (protocolsDB[part.id] || []).length;
                return (
                  <button
                    key={part.id}
                    type="button"
                    className={`tab-btn ${selectedPart === part.id && !searchQuery ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPart(part.id);
                      setSearchQuery('');
                      setActiveQuickChip('ALL');
                    }}
                  >
                    <img src={part.img} alt={part.label} />
                    <div className="tab-title">
                      <span>{part.label}</span>
                      <span className="tab-sub-ko">{part.koLabel}</span>
                    </div>
                    <span className="tab-count-badge">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* 중앙: 밝고 선명한 프로토콜 카드 리스트 */}
            <div className="protocol-details">
              <div className="part-header-box">
                <div>
                  <h3 className="part-title">
                    {searchQuery
                      ? `🔍 '${searchQuery}' 검색 결과 (${displayedProtocols.length}건)`
                      : `${currentPartInfo.koLabel} 프로토콜 (${displayedProtocols.length}건)`}
                  </h3>
                  <p className="part-subtitle-help">
                    💡 카드를 클릭하면 <strong>① 촬영 순서 → ② 초보자 플랜 팁 → ③ PACS/서버 전송 → ④ 교수님 지침</strong>을 단계별로 확인합니다.
                  </p>
                </div>
              </div>

              <div className="protocol-list">
                {displayedProtocols.length === 0 ? (
                  <div
                    style={{
                      padding: '3rem 1.5rem',
                      textAlign: 'center',
                      color: '#666',
                      background: '#f8f9fc',
                      borderRadius: '14px'
                    }}
                  >
                    검색 조건에 맞는 프로토콜이 없습니다. 검색어를 초기화하거나 다른 부위를 선택해보세요.
                  </div>
                ) : (
                  displayedProtocols.map((proto) => {
                    const hasUrgentUpdate = proto.updates2026 && proto.updates2026.length > 0;
                    return (
                      <div
                        key={proto.id}
                        className="protocol-item"
                        onClick={() => openProtocolDetail(proto, 'step1')}
                      >
                        <div className="proto-item-left">
                          <div className="proto-name-row">
                            {proto._partLabel && searchQuery && (
                              <span
                                className="proto-badge"
                                style={{ background: '#e6f9f8', color: '#01a29a', borderColor: '#b7e3dd' }}
                              >
                                {proto._partLabel}
                              </span>
                            )}
                            <span className="protocol-name">{proto.name}</span>
                            {proto.tag && <span className="proto-badge">{proto.tag}</span>}
                            {hasUrgentUpdate && (
                              <span className="proto-badge urgent">
                                NEW 지침 {proto.updates2026.length}건
                              </span>
                            )}
                            {proto.refImage && (
                              <span
                                className="proto-badge"
                                style={{
                                  background: '#e6f9f8',
                                  color: '#01a29a',
                                  borderColor: '#98e2dc'
                                }}
                              >
                                📷 콘솔사진
                              </span>
                            )}
                          </div>
                          <div className="proto-quick-meta">
                            <span>🧲 {proto.coilPosition}</span>
                            <span>💉 {proto.contrastInfo}</span>
                          </div>
                        </div>

                        <div className="proto-item-right">
                          <span className="protocol-time">⏱️ {proto.time}</span>
                          <span className="view-step-btn">상세보기 →</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 우측: 3D 인체 스캔 맵 + 레이저 스캐닝 모션그래픽 */}
            <div className="body-map-container">
              <div className="body-map-hud-label">3.0T BODY SCANNER</div>
              <div className="body-map-wrapper">
                <div className="body-scan-laser"></div>
                <img src="/body-scan.png" alt="Human Body Map" className="body-scan-img" />
                {bodyPartsConfig.map((part) => (
                  <div
                    key={part.id}
                    className={`hotspot ${selectedPart === part.id ? 'active' : ''}`}
                    style={{ top: part.hotspot.top, left: part.hotspot.left }}
                    onClick={() => {
                      setSelectedPart(part.id);
                      setSearchQuery('');
                      setActiveQuickChip('ALL');
                    }}
                    title={part.koLabel}
                  >
                    <span className="hotspot-tooltip">{part.koLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            6. MR WORKSPACE (한림 홈페이지 카드 호버 디자인 .tab_box01)
           ==================================================================== */}
        <section id="workspace" className="news-section">
          <div className="section-header-row">
            <div>
              <h2>
                한림 MRI <span>스마트 워크스페이스</span>
              </h2>
              <p>
                독립 분리된 파라메타 원리 연구소, 교수님 특별지침, 외부 AI 서버 매트릭스, 학생·신규자 3D 교육 공간입니다.
              </p>
            </div>
          </div>

          <div className="news-grid">
            {/* 카드 1: 파라메타 원리 (독립 분리 섹션) */}
            <article className="news-card" onClick={() => setActiveWorkspaceModal('parameter')}>
              <div className="card-img-wrapper">
                <img src="/workspace_theory.png" alt="MRI Parameter Principles Lab" />
                <span className="tag">독립 분리 섹션</span>
              </div>
              <div className="card-content">
                <h3>🎛️ 파라메타 원리 연구소</h3>
                <p>
                  SNR·SAR·Voxel·BW·ETL 10대 핵심 원리와 비유, 콘솔 14종 가이드, 상황별 레시피 4선, T1·T2 10살 버전을 쉽게 학습하세요.
                </p>
                <div className="read-more">
                  <span>파라메타 연구소 열기</span>
                  <span>→</span>
                </div>
              </div>
            </article>

            {/* 카드 2: 최신 공지 & 에러 해결 */}
            <article className="news-card" onClick={() => setActiveWorkspaceModal('clinical')}>
              <div className="card-img-wrapper">
                <img src="/workspace_clinical.png" alt="Clinical Notices & Troubleshooting" />
                <span className="tag purple-tag">필독 지침 14건</span>
              </div>
              <div className="card-content">
                <h3>🔔 교수님 지침 & 에러 해결</h3>
                <p>
                  고성혜·전치만·노규철 교수님 특별지침, MRCP Burst RF Power 에러 1·2순위 해결법, 외국인 영어 음성 안내를 제공합니다.
                </p>
                <div className="read-more">
                  <span>임상 공지 허브 열기</span>
                  <span>→</span>
                </div>
              </div>
            </article>

            {/* 카드 3: 장비 · AI 서버 현황 */}
            <article className="news-card" onClick={() => setActiveWorkspaceModal('equipment')}>
              <div className="card-img-wrapper">
                <img src="/workspace_equipment.png" alt="Equipment & Server Status" />
                <span className="tag teal-tag">3.0T & AI 서버</span>
              </div>
              <div className="card-content">
                <h3>🧲 외부 서버 (JLK · ISP · Tera)</h3>
                <p>
                  JLK MEDIHUB(10.65.17.93) 접속 계정 원클릭 복사, 7대 외부 서버 전송 매트릭스 및 내선 단축코드(#41/#49, 1576) 안내입니다.
                </p>
                <div className="read-more">
                  <span>서버 & 장비 가이드 열기</span>
                  <span>→</span>
                </div>
              </div>
            </article>

            {/* 카드 4: 학생 & 신규자 3D 플래시카드 */}
            <article className="news-card" onClick={() => setActiveWorkspaceModal('student')}>
              <div className="card-img-wrapper">
                <img src="/workspace_student.png" alt="Student 3D Flashcards" />
                <span className="tag">교육 · {flashcards.length}문항</span>
              </div>
              <div className="card-content">
                <h3>🎓 학생 · 신규자 3D 플래시카드</h3>
                <p>
                  신규 방사선사와 실습 학생을 위한 3D 회전 암기 카드입니다. 파라메타 원리, 제조사별 명칭, 한림 실무 지침을 퀴즈로 마스터하세요.
                </p>
                <div className="read-more">
                  <span>3D 플래시카드 시작하기</span>
                  <span>→</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ====================================================================
            7. 한림대성심병원 하단 3단 정보 섹션 (.main_map 스타일: #686e8a + #dfe4ff + 모바일 QR)
           ==================================================================== */}
        <section className="hallym-bottom-grid-section">
          <div className="hallym-bottom-grid">
            {/* 좌측: #686e8a 슬레이트 박스 */}
            <div className="hallym-status-slate-box">
              <div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  HALLYM 3.0T MR CENTER STATUS
                </span>
                <h3 style={{ marginTop: '0.7rem' }}>검사실 가동 현황 및 백엔드 관리</h3>
                <p style={{ color: '#e2e8f0', fontSize: '0.94rem', marginTop: '0.4rem' }}>
                  Philips Ingenia Elition X 3.0T · Siemens MAGNETOM Skyra 3.0T 정상 가동 중 (Helium 98.4%)
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                <button
                  type="button"
                  className="cta-btn"
                  onClick={() => setActiveWorkspaceModal('backend')}
                >
                  ⚙️ 백엔드 데이터 관리 콘솔 열기
                </button>
              </div>
            </div>

            {/* 중앙: #dfe4ff 한림 라벤더 전화번호 안내 박스 */}
            <div className="hallym-tel-lavender-box">
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#5c78e5' }}>
                검사실 직통 · 처방변경 · 당직 착신
              </span>
              <b>☎️ 응급실 처방변경 1576</b>
              <div style={{ fontSize: '0.96rem', lineHeight: 1.7, fontWeight: 700 }}>
                • 자리 비울 때 이동착신: <strong style={{ color: '#e64361' }}>#41 + 방번호</strong>
                <br />• 이동착신 해제 코드: <strong style={{ color: '#e64361' }}>#49</strong>
                <br />• Temporal 신규 코드: <strong>HI501A8R / HI501A9R</strong>
              </div>
            </div>

            {/* 우측: 화이트 모바일/타PC 무로그인 접속 박스 */}
            <div className="hallym-qr-white-box">
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f75077' }}>PUBLIC WEB &amp; MOBILE ACCESS</span>
                <h4 style={{ fontSize: '1.22rem', fontWeight: 800, margin: '0.25rem 0' }}>
                  다른 PC · 모바일 바로 접속 (로그인 불필요)
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.45rem' }}>
                  별도 로그인 없이 인터넷 주소창에 입력하거나 QR을 스캔하면 즉시 열립니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const url = 'https://hallym-mri-dashboard.vercel.app/';
                    navigator.clipboard?.writeText(url);
                    alert(`✅ 공개 웹 주소가 복사되었습니다!\n카톡이나 메신저에 붙여넣어 다른 컴퓨터에서 바로 여세요:\n\n${url}`);
                  }}
                  style={{
                    background: '#f0f4ff',
                    color: '#363e69',
                    border: '1px solid #cbd5ff',
                    borderRadius: '8px',
                    padding: '0.35rem 0.7rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  📋 hallym-mri-dashboard.vercel.app 복사
                </button>
              </div>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://hallym-mri-dashboard.vercel.app/&bgcolor=ffffff&color=363e69"
                alt="Hallym MRI Mobile QR Code"
                style={{
                  width: '108px',
                  height: '108px',
                  borderRadius: '12px',
                  border: '2px solid #dfe4ff',
                  padding: '4px',
                  flexShrink: 0
                }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          MODAL A: 초보자 친화형 4단계 프로토콜 상세 가이드 모달 (밝고 선명한 한림 화이트 테마)
         ==================================================================== */}
      {viewingProtocol && (
        <div className="modal" onClick={() => setViewingProtocol(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setViewingProtocol(null)}>
              &times;
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span className="proto-badge">{viewingProtocol.tag || '표준 프로토콜'}</span>
              <span className="protocol-time">⏱️ 소요시간: {viewingProtocol.time}</span>
              {viewingProtocol.updates2026?.length > 0 && (
                <span className="proto-badge urgent">
                  🚨 필수 숙지 지침 {viewingProtocol.updates2026.length}건
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.65rem', color: 'var(--hallym-navy)', marginBottom: '1rem', fontWeight: 800 }}>
              {viewingProtocol.name}
            </h2>

            <div className="beginner-summary-strip">
              <div className="summary-cell">
                <label>🧲 코일 & 환자 포지션 (Position)</label>
                <strong>{viewingProtocol.coilPosition || '부위별 전용 코일'}</strong>
              </div>
              <div className="summary-cell">
                <label>💉 조영제 & 전처치 약물 (Contrast / Drug)</label>
                <strong>{viewingProtocol.contrastInfo || '처방 확인'}</strong>
              </div>
            </div>

            <div className="step-tabs-bar">
              <button
                type="button"
                className={`step-tab-btn ${protocolStepTab === 'step1' ? 'active' : ''}`}
                onClick={() => setProtocolStepTab('step1')}
              >
                1️⃣ 촬영 시퀀스 순서 ({(viewingProtocol.sequences || []).length})
              </button>
              <button
                type="button"
                className={`step-tab-btn ${protocolStepTab === 'step2' ? 'active' : ''}`}
                onClick={() => setProtocolStepTab('step2')}
              >
                2️⃣ 초보자 플랜 & 세팅 팁 ({(viewingProtocol.easyGuide || []).length})
              </button>
              <button
                type="button"
                className={`step-tab-btn ${protocolStepTab === 'step3' ? 'active' : ''}`}
                onClick={() => setProtocolStepTab('step3')}
              >
                3️⃣ PACS & 외부서버 전송 ({(viewingProtocol.pacsRule || []).length})
              </button>
              <button
                type="button"
                className={`step-tab-btn ${protocolStepTab === 'step4' ? 'active' : ''}`}
                onClick={() => setProtocolStepTab('step4')}
              >
                4️⃣ 🚨 교수님 특별지침 {viewingProtocol.tableData ? '& 표' : `(${(viewingProtocol.updates2026 || []).length})`}
              </button>
            </div>

            {/* STEP 1 */}
            {protocolStepTab === 'step1' && (
              <div className="step-list-box">
                <div style={{ fontSize: '0.92rem', color: 'var(--text-sub)', marginBottom: '0.2rem' }}>
                  📋 콘솔에서 위에서부터 순서대로 진행하는 스캔 시퀀스 체크리스트입니다.
                </div>
                {(viewingProtocol.sequences || []).map((seq, i) => (
                  <div key={i} className="step-row-card">
                    <span className="step-num-circle">{i + 1}</span>
                    <div style={{ flex: 1, fontWeight: 700 }}>{seq}</div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2 */}
            {protocolStepTab === 'step2' && (
              <div className="step-list-box">
                <div style={{ fontSize: '0.92rem', color: 'var(--text-sub)', marginBottom: '0.2rem' }}>
                  💡 초보자가 실수하기 쉬운 스캔 범위(FOV), 각도(Angle), 호흡 및 타이밍 핵심 팁입니다.
                </div>
                {(viewingProtocol.easyGuide || []).map((tip, i) => (
                  <div
                    key={i}
                    className="step-row-card"
                    style={{ borderLeft: '4px solid var(--hallym-teal)' }}
                  >
                    <span
                      className="step-num-circle"
                      style={{ background: 'var(--hallym-teal)', color: '#fff' }}
                    >
                      ✓
                    </span>
                    <div style={{ flex: 1 }}>{tip}</div>
                  </div>
                ))}

                {viewingProtocol.refImage && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1.2rem',
                      background: '#f8f9fc',
                      borderRadius: '14px',
                      border: '1.5px solid #cfd6e6'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                      <strong style={{ color: 'var(--hallym-navy)' }}>📷 실제 콘솔 화면 & 플랜 참고 사진</strong>
                      <button
                        type="button"
                        className="view-step-btn"
                        onClick={() => setPreviewImageModal({ title: viewingProtocol.name, src: viewingProtocol.refImage })}
                      >
                        🔍 크게 확대보기
                      </button>
                    </div>
                    <img
                      src={viewingProtocol.refImage}
                      alt={viewingProtocol.name}
                      style={{
                        width: '100%',
                        maxHeight: '330px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        background: '#182036',
                        cursor: 'pointer'
                      }}
                      onClick={() => setPreviewImageModal({ title: viewingProtocol.name, src: viewingProtocol.refImage })}
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {protocolStepTab === 'step3' && (
              <div className="step-list-box">
                <div style={{ fontSize: '0.92rem', color: 'var(--text-sub)', marginBottom: '0.2rem' }}>
                  📤 스캔 완료 후 PACS 베리파이 순서 및 외부 워크스테이션(ISP, JLK, Dynapex, TeraRecon 등) 전송 규칙입니다.
                </div>
                {(viewingProtocol.pacsRule || []).map((rule, i) => (
                  <div
                    key={i}
                    className="step-row-card"
                    style={{ borderLeft: '4px solid var(--hallym-navy)' }}
                  >
                    <span
                      className="step-num-circle"
                      style={{ background: 'var(--hallym-navy)', color: '#fff' }}
                    >
                      📤
                    </span>
                    <div style={{ flex: 1 }}>{rule}</div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4 */}
            {protocolStepTab === 'step4' && (
              <div className="step-list-box">
                {viewingProtocol.updates2026 && viewingProtocol.updates2026.length > 0 ? (
                  viewingProtocol.updates2026.map((up, i) => (
                    <div
                      key={i}
                      className="step-row-card"
                      style={{
                        background: '#fff5f7',
                        border: '1px solid #f8b4c4',
                        borderLeft: '5px solid var(--hallym-pink)'
                      }}
                    >
                      <span className="step-num-circle">!</span>
                      <div style={{ flex: 1, fontWeight: 700, color: '#9f1239' }}>{up}</div>
                    </div>
                  ))
                ) : (
                  <div className="step-row-card" style={{ color: 'var(--text-muted)' }}>
                    등록된 별도 긴급 개정 지침이 없습니다. 표준 시퀀스와 PACS 전송 규칙을 준수하세요.
                  </div>
                )}

                {viewingProtocol.tableData && (
                  <div style={{ marginTop: '1.2rem', overflowX: 'auto' }}>
                    <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.7rem', fontSize: '1.1rem' }}>
                      📊 {viewingProtocol.tableData.title}
                    </h4>
                    <table className="clean-table">
                      <thead>
                        <tr>
                          {viewingProtocol.tableData.headers.map((h, idx) => (
                            <th key={idx}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {viewingProtocol.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ fontWeight: cIdx === 0 ? 800 : 500 }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.8rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid #e5e9f2',
                flexWrap: 'wrap',
                gap: '0.8rem'
              }}
            >
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() =>
                  handleCopyText(
                    `[${viewingProtocol.name}]\n• 코일/자세: ${viewingProtocol.coilPosition}\n• 조영제: ${viewingProtocol.contrastInfo}\n• 시퀀스: ${(viewingProtocol.sequences || []).join(' -> ')}\n• 핵심팁: ${(viewingProtocol.easyGuide || []).join(' / ')}\n• PACS: ${(viewingProtocol.pacsRule || []).join(' / ')}`,
                    `'${viewingProtocol.name}' 요약이 복사되었습니다!`
                  )
                }
              >
                📋 프로토콜 전체 복사
              </button>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="cta-btn"
                  onClick={() => openEditProtocolModal(viewingProtocol)}
                >
                  ✏️ 내용 수정하기
                </button>
                <button
                  type="button"
                  className="cta-btn-outline"
                  onClick={() =>
                    handleDeleteProtocol(
                      viewingProtocol._partKey || selectedPart,
                      viewingProtocol.id,
                      viewingProtocol.name
                    )
                  }
                >
                  🗑️ 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL B: 프로토콜 추가 / 수정 모달
         ==================================================================== */}
      {isEditProtocolOpen && (
        <div className="modal" onClick={() => setIsEditProtocolOpen(false)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setIsEditProtocolOpen(false)}>
              &times;
            </span>
            <h2 style={{ color: 'var(--hallym-navy)', marginBottom: '1.2rem' }}>
              {editingProtoMode === 'add' ? '+ 새 프로토콜 추가' : '✏️ 프로토콜 수정'}
            </h2>
            <form onSubmit={handleSaveProtocolForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label>검사 부위</label>
                  <select
                    value={protoForm.part}
                    onChange={(e) => setProtoForm({ ...protoForm, part: e.target.value })}
                  >
                    {bodyPartsConfig.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label} ({b.koLabel})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>프로토콜 명칭</label>
                  <input
                    type="text"
                    required
                    value={protoForm.name}
                    onChange={(e) => setProtoForm({ ...protoForm, name: e.target.value })}
                    placeholder="예: Brain Tumor + CE"
                  />
                </div>
                <div className="form-group">
                  <label>분류 태그</label>
                  <input
                    type="text"
                    value={protoForm.tag}
                    onChange={(e) => setProtoForm({ ...protoForm, tag: e.target.value })}
                    placeholder="예: 최신개정·필수"
                  />
                </div>
                <div className="form-group">
                  <label>소요 시간</label>
                  <input
                    type="text"
                    value={protoForm.time}
                    onChange={(e) => setProtoForm({ ...protoForm, time: e.target.value })}
                    placeholder="예: 25 Min"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label>🧲 코일 & 환자 포지션</label>
                  <input
                    type="text"
                    value={protoForm.coilPosition}
                    onChange={(e) => setProtoForm({ ...protoForm, coilPosition: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>💉 조영제 & 전처치 약물</label>
                  <input
                    type="text"
                    value={protoForm.contrastInfo}
                    onChange={(e) => setProtoForm({ ...protoForm, contrastInfo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>1️⃣ 촬영 시퀀스 순서 (한 줄에 하나씩 입력)</label>
                <textarea
                  rows="4"
                  value={protoForm.sequencesText}
                  onChange={(e) => setProtoForm({ ...protoForm, sequencesText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>2️⃣ 초보자 플랜 & 세팅 팁 (한 줄에 하나씩 입력)</label>
                <textarea
                  rows="3"
                  value={protoForm.easyGuideText}
                  onChange={(e) => setProtoForm({ ...protoForm, easyGuideText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>3️⃣ PACS & 외부 서버 전송 규칙 (한 줄에 하나씩 입력)</label>
                <textarea
                  rows="2"
                  value={protoForm.pacsRuleText}
                  onChange={(e) => setProtoForm({ ...protoForm, pacsRuleText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>4️⃣ 🚨 교수님·과별 특별지침 (한 줄에 하나씩 입력)</label>
                <textarea
                  rows="2"
                  value={protoForm.updatesText}
                  onChange={(e) => setProtoForm({ ...protoForm, updatesText: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="cta-btn-outline"
                  onClick={() => setIsEditProtocolOpen(false)}
                >
                  취소
                </button>
                <button type="submit" className="cta-btn">
                  💾 백엔드 DB에 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 1: 🎛️ MRI 파라메타 원리 & 물리 연구소 (독립 분리 섹션)
         ==================================================================== */}
      {activeWorkspaceModal === 'parameter' && (
        <div className="modal" onClick={() => setActiveWorkspaceModal(null)}>
          <div className="modal-content xl-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setActiveWorkspaceModal(null)}>
              &times;
            </span>

            <div style={{ marginBottom: '1.2rem' }}>
              <span className="proto-badge urgent" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                독립 분리 섹션 · PDF 43~55P 완벽 수록
              </span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--hallym-navy)', fontWeight: 800 }}>
                🎛️ MRI <span style={{ color: 'var(--hallym-pink)' }}>파라메타 원리</span> & 콘트라스트 연구소
              </h2>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.96rem' }}>
                프로토콜과 완전히 분리된 파라메타 물리 원리 전용 공간입니다. 위쪽 슬라이더를 움직여 파라메타 간의 상관관계를 직접 체험해보세요!
              </p>
            </div>

            {/* 실시간 파라메타 시뮬레이터 */}
            <div className="param-sim-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--hallym-navy)', fontSize: '1.05rem' }}>
                  ⚡ 인터랙티브 파라메타 줄다리기 시뮬레이터 (슬라이더를 조절해보세요!)
                </strong>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => {
                    setSimVoxel(50);
                    setSimBW(50);
                    setSimETL(40);
                    setSimTR(55);
                  }}
                >
                  🔄 기본값 초기화
                </button>
              </div>

              <div className="sim-sliders-grid">
                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span>🧱 Voxel 크기 (해상도 반비례)</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simVoxel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simVoxel}
                    onChange={(e) => setSimVoxel(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    작게(좌): 고해상도·SNR↓ / 크게(우): SNR↑·부분용적↑
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span>📻 대역폭 BW (WFS 반비례)</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simBW}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simBW}
                    onChange={(e) => setSimBW(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    좁게(좌): SNR↑·왜곡↑ / 넓게(우): 금속·화학이동 왜곡↓·SNR↓
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span>🖨️ 터보팩터 ETL (Echo Train)</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simETL}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simETL}
                    onChange={(e) => setSimETL(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    짧게(좌): 선명도↑·SAR↓ / 길게(우): 시간 단축↓·블러↑·SAR↑
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span>🔋 반복시간 TR (T1 회복)</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simTR}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simTR}
                    onChange={(e) => setSimTR(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    짧게(좌): T1 강조·SAR↑ / 길게(우): SNR↑·SAR 안전↓·시간↑
                  </div>
                </div>
              </div>

              <div className="sim-gauges-row">
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 700 }}>신호대잡음비 (SNR)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-blue)' }}>{simMetrics.snr}점</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 700 }}>예상 스캔 시간</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-navy)' }}>{simMetrics.scanTime}%</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 700 }}>왜곡 억제 & 해상력</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-teal-dark)' }}>{simMetrics.clarity}점</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', fontWeight: 700 }}>SAR 열에너지 부담</div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: simMetrics.sar > 70 ? 'var(--hallym-pink-dark)' : '#444'
                    }}
                  >
                    {simMetrics.sar}% {simMetrics.sar > 70 ? '🔥주의' : '안전'}
                  </div>
                </div>
              </div>
            </div>

            {/* 5대 서브탭 */}
            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              {[
                { id: 'core10', label: '① 10대 핵심 원리 & 비유' },
                { id: 'console14', label: '② 콘솔 실전 14종 쉬운 가이드' },
                { id: 'recipes4', label: '③ 상황별 레시피 4선 & 공식' },
                { id: 't1t2', label: '④ T1·T2 물리 (10살 버전 & 4칸표)' },
                { id: 'dixonVendor', label: '⑤ Dixon 4종 & 제조사 시퀀스 비교표' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`step-tab-btn ${paramSubTab === t.id ? 'active' : ''}`}
                  style={{ flex: '1 1 auto', minWidth: '180px' }}
                  onClick={() => setParamSubTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 탭 1: 10대 핵심 파라메타 */}
            {paramSubTab === 'core10' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.1rem' }}>
                {parameterPrinciplesData.core10Params.map((item) => (
                  <div
                    key={item.num}
                    style={{
                      background: '#f9fafc',
                      border: '1.5px solid #e1e6f0',
                      borderRadius: '16px',
                      padding: '1.35rem'
                    }}
                  >
                    <span className="proto-badge" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                      CORE {item.num} · {item.ko}
                    </span>
                    <h3 style={{ fontSize: '1.18rem', color: 'var(--hallym-navy)', marginBottom: '0.5rem', fontWeight: 800 }}>
                      {item.name}
                    </h3>
                    <div
                      style={{
                        background: '#fff0f3',
                        border: '1px solid #f9c6d2',
                        padding: '0.65rem 0.95rem',
                        borderRadius: '10px',
                        fontSize: '0.94rem',
                        fontWeight: 800,
                        color: 'var(--hallym-pink-dark)',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {item.analogy}
                    </div>
                    <p style={{ fontSize: '0.94rem', color: '#222', marginBottom: '0.45rem' }}>
                      <strong>정의:</strong> {item.definition}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.75rem' }}>
                      <strong>물리 원리:</strong> {item.principle}
                    </p>
                    <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid #e1e6f0', paddingTop: '0.65rem' }}>
                      <div style={{ color: '#01807a' }}>
                        <strong>🔼 올릴 때(↑):</strong> {item.upFactors}
                      </div>
                      <div style={{ color: '#c81e45' }}>
                        <strong>🔽 낮출 때(↓):</strong> {item.downFactors}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 탭 2: 콘솔 실전 14종 */}
            {paramSubTab === 'console14' && (
              <div>
                <div className="search-input-wrap" style={{ marginBottom: '1rem' }}>
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="콘솔 파라메타 검색 (예: Matrix, WFS, Packages, Scan percentage, SAR, B1+rms, PNS)..."
                    value={consoleSearch}
                    onChange={(e) => setConsoleSearch(e.target.value)}
                  />
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>콘솔 항목</th>
                        <th>무엇을 뜻하나?</th>
                        <th>올리면(↑) / 켜면</th>
                        <th>낮추면(↓) / 끄면</th>
                        <th>실전 언제 쓰나?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameterPrinciplesData.console14Params
                        .filter((c) =>
                          [c.name, c.sub, c.what, c.when].join(' ').toLowerCase().includes(consoleSearch.toLowerCase())
                        )
                        .map((c) => (
                          <tr key={c.id}>
                            <td style={{ minWidth: '165px' }}>
                              <strong style={{ color: 'var(--hallym-navy)' }}>{c.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: '#666' }}>{c.sub}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{c.what}</div>
                              <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.2rem' }}>{c.principle}</div>
                            </td>
                            <td style={{ color: '#01807a', fontWeight: 600 }}>{c.up}</td>
                            <td style={{ color: '#c81e45', fontWeight: 600 }}>{c.down}</td>
                            <td style={{ fontWeight: 700 }}>{c.when}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 탭 3: 상황별 레시피 4선 */}
            {paramSubTab === 'recipes4' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.1rem', marginBottom: '1.5rem' }}>
                  {parameterPrinciplesData.recipes4.map((rec) => (
                    <div
                      key={rec.code}
                      style={{
                        background: '#f9fafc',
                        border: '1.5px solid #d5dceb',
                        borderTop: `5px solid var(--hallym-pink)`,
                        borderRadius: '16px',
                        padding: '1.35rem'
                      }}
                    >
                      <div style={{ color: 'var(--hallym-pink-dark)', fontWeight: 900, fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                        상황별 실전 레시피 {rec.code}
                      </div>
                      <h3 style={{ fontSize: '1.22rem', color: 'var(--hallym-navy)', marginBottom: '0.25rem', fontWeight: 800 }}>
                        {rec.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: '0.9rem' }}>
                        {rec.subtitle}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                        {rec.steps.map((st, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #e2e6f0',
                              padding: '0.7rem 0.95rem',
                              borderRadius: '10px',
                              fontSize: '0.94rem'
                            }}
                          >
                            <strong style={{ color: 'var(--hallym-navy)' }}>{st.label}:</strong> {st.action}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: 'var(--hallym-navy)', fontSize: '1.2rem', marginBottom: '0.8rem', fontWeight: 800 }}>
                  📐 반드시 기억할 3대 핵심 공식
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {parameterPrinciplesData.coreFormulas.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#fff5f7',
                        border: '1px solid #f8b4c4',
                        padding: '1.15rem',
                        borderRadius: '14px'
                      }}
                    >
                      <strong style={{ color: 'var(--hallym-navy)', display: 'block', marginBottom: '0.45rem' }}>
                        {f.title}
                      </strong>
                      <code
                        style={{
                          display: 'block',
                          background: '#ffffff',
                          color: 'var(--hallym-pink-dark)',
                          padding: '0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          border: '1px solid #f8b4c4',
                          marginBottom: '0.5rem'
                        }}
                      >
                        {f.formula}
                      </code>
                      <div style={{ fontSize: '0.88rem', color: '#333' }}>{f.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 탭 4: T1·T2 물리 원리 */}
            {paramSubTab === 't1t2' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div
                  style={{
                    background: '#fff0f3',
                    border: '1.5px solid var(--hallym-pink)',
                    padding: '1rem 1.3rem',
                    borderRadius: '14px',
                    fontWeight: 800,
                    color: 'var(--hallym-pink-dark)',
                    fontSize: '1.04rem'
                  }}
                >
                  {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.ruleOfThumb}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ background: '#f9fafc', padding: '1.35rem', borderRadius: '16px', border: '1px solid #e1e6f0' }}>
                    <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                      🧒 초보자도 1분 만에 이해하는 MRI 작동 5단계 (10살 버전)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {parameterPrinciplesData.t1t2Master.tenYearOldSteps.map((s) => (
                        <div key={s.step} style={{ fontSize: '0.94rem', background: '#ffffff', border: '1px solid #e2e6f0', padding: '0.7rem 0.95rem', borderRadius: '10px' }}>
                          <strong style={{ color: 'var(--hallym-pink-dark)' }}>STEP {s.step}. {s.title}:</strong> {s.desc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f9fafc', padding: '1.35rem', borderRadius: '16px', border: '1px solid #e1e6f0' }}>
                    <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>
                      🎻 바이올린 연주로 이해하는 공명 & T1 vs T2
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                      {parameterPrinciplesData.t1t2Master.violinAnalogy.map((v, idx) => (
                        <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e6f0', padding: '0.75rem', borderRadius: '10px', fontSize: '0.9rem' }}>
                          <div style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: 'var(--hallym-navy)' }}>{v.icon} <strong>{v.term}</strong></div>
                          <div style={{ color: '#444' }}>{v.meaning}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.92rem', background: '#eef1ff', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.55rem' }}>
                      <strong style={{ color: 'var(--hallym-navy)' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.title}</strong>
                      <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>• {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.winner}</div>
                      <div style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.25rem' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.why}</div>
                    </div>
                    <div style={{ fontSize: '0.92rem', background: '#e6f9f8', padding: '0.85rem', borderRadius: '10px' }}>
                      <strong style={{ color: 'var(--hallym-teal-dark)' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.title}</strong>
                      <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>• {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.winner}</div>
                      <div style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.25rem' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.why}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.6rem', fontSize: '1.1rem' }}>
                    📊 대조도(Contrast) 결정 4칸 요약표
                  </h4>
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>목표 영상</th>
                        <th>TR (T1 손잡이)</th>
                        <th>TE (T2 손잡이)</th>
                        <th>추가 스위치 & 임상 활용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameterPrinciplesData.t1t2Master.fourCellTable.map((row, idx) => (
                        <tr key={idx}>
                          <td><strong style={{ color: 'var(--hallym-pink-dark)' }}>{row.target}</strong></td>
                          <td style={{ fontWeight: 700 }}>{row.tr}</td>
                          <td style={{ fontWeight: 700 }}>{row.te}</td>
                          <td>{row.switch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: '#f9fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e1e6f0' }}>
                  <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.7rem', fontSize: '1.1rem' }}>
                    ✅ 실전 콘솔 체크리스트 10계명
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '0.55rem' }}>
                    {parameterPrinciplesData.t1t2Master.fieldChecklist10.map((line, idx) => (
                      <div key={idx} style={{ fontSize: '0.92rem', padding: '0.6rem 0.85rem', background: '#ffffff', border: '1px solid #e2e6f0', borderRadius: '8px', fontWeight: 600 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 탭 5: Dixon 4종 & 제조사 시퀀스 비교표 */}
            {paramSubTab === 'dixonVendor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                <div>
                  <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.8rem', fontSize: '1.12rem' }}>
                    💧 Dixon 기법 4종 영상 (W · F · In · Out) 완벽 비교
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {parameterPrinciplesData.dixonFourImages.map((dx, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#f9fafc',
                          border: '1.5px solid #d5dceb',
                          padding: '1.25rem',
                          borderRadius: '14px'
                        }}
                      >
                        <div style={{ color: 'var(--hallym-pink-dark)', fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                          {dx.code}
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--hallym-navy)', marginBottom: '0.45rem' }}>{dx.title}</div>
                        <span className="proto-badge" style={{ display: 'inline-block', marginBottom: '0.6rem' }}>
                          {dx.badge}
                        </span>
                        <p style={{ fontSize: '0.9rem', color: '#333', marginBottom: '0.5rem' }}>{dx.desc}</p>
                        <p style={{ fontSize: '0.85rem', color: '#555' }}>
                          <strong>임상 활용:</strong> {dx.clinical}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.8rem', fontSize: '1.12rem' }}>
                    🏥 제조사별 (Siemens vs Philips vs GE) 시퀀스 명칭 일람표
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="clean-table">
                      <thead>
                        <tr>
                          <th>시퀀스 분류</th>
                          <th>Siemens (Skyra)</th>
                          <th>Philips (Elition / Achieva)</th>
                          <th>GE</th>
                          <th>특징 및 주 용도</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameterPrinciplesData.vendorSequenceTable.map((row, idx) => (
                          <tr key={idx}>
                            <td><strong>{row.category}</strong></td>
                            <td style={{ color: 'var(--hallym-teal-dark)', fontWeight: 800 }}>{row.siemens}</td>
                            <td style={{ color: 'var(--hallym-pink-dark)', fontWeight: 800 }}>{row.philips}</td>
                            <td style={{ color: 'var(--hallym-navy)', fontWeight: 700 }}>{row.ge}</td>
                            <td style={{ fontSize: '0.88rem', color: '#555' }}>{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: 🔔 최신 임상 공지 & 에러 해결 · 외국인 영어 스크립트
         ==================================================================== */}
      {activeWorkspaceModal === 'clinical' && (
        <div className="modal" onClick={() => setActiveWorkspaceModal(null)}>
          <div className="modal-content xl-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setActiveWorkspaceModal(null)}>
              &times;
            </span>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--hallym-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
              🔔 최신 <span style={{ color: 'var(--hallym-pink)' }}>임상 공지 & 에러 해결</span> 허브
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1.2rem', fontSize: '0.96rem' }}>
              판독 교수님 특별 지침, 콘솔 에러 해결 프로토콜, 신규 처방 코드, 외국인 환자 영어 안내방송(TTS)을 확인하세요.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              {[
                { id: 'all', label: `전체 공지 (${noticesList.length})` },
                { id: 'professor', label: '👨‍⚕️ 교수님 특별지침' },
                { id: 'equipment', label: '🛠️ 장비·에러 대처 (MRCP/Philips)' },
                { id: 'order', label: '📋 처방·추가시퀀스 (Temporal/ER)' },
                { id: 'server', label: '📤 외부 서버 전송' },
                { id: 'english', label: '🔊 외국인 환자 영어 안내 (TTS)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`step-tab-btn ${clinicalCategory === cat.id ? 'active' : ''}`}
                  style={{ flex: '1 1 auto' }}
                  onClick={() => setClinicalCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {clinicalCategory === 'english' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {practicalToolsData.englishScripts.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    style={{
                      background: '#f9fafc',
                      border: '1px solid #e1e6f0',
                      borderRadius: '16px',
                      padding: '1.35rem'
                    }}
                  >
                    <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.9rem', fontSize: '1.1rem' }}>{group.step}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.9rem' }}>
                      {group.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          style={{
                            background: '#ffffff',
                            padding: '1.1rem',
                            borderRadius: '12px',
                            border: '1px solid #d5dceb'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--hallym-navy)', marginBottom: '0.35rem' }}>
                            "{item.en}"
                          </div>
                          <div style={{ color: 'var(--hallym-pink-dark)', fontSize: '0.94rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                            🗣️ 발음: {item.pron}
                          </div>
                          <div style={{ color: '#555', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                            뜻: {item.ko}
                          </div>
                          <button
                            type="button"
                            className="view-step-btn"
                            onClick={() => speakEnglish(item.en)}
                          >
                            🔊 원어민 음성 듣기
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.1rem' }}>
                {noticesList
                  .filter((n) => clinicalCategory === 'all' || n.category === clinicalCategory)
                  .map((notice) => (
                    <div
                      key={notice.id}
                      style={{
                        background: '#ffffff',
                        border: notice.priority === 'urgent' ? '1.5px solid #f8b4c4' : '1.5px solid #e1e6f0',
                        borderTop: notice.priority === 'urgent' ? '4px solid var(--hallym-pink)' : '4px solid var(--hallym-navy)',
                        borderRadius: '16px',
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span className={`proto-badge ${notice.priority === 'urgent' ? 'urgent' : ''}`}>
                          {notice.categoryLabel}
                        </span>
                        <span style={{ fontSize: '0.84rem', color: '#666', fontWeight: 600 }}>{notice.target}</span>
                      </div>
                      <h3 style={{ fontSize: '1.12rem', color: 'var(--hallym-navy)', fontWeight: 800 }}>
                        {notice.title}
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: '#222', fontWeight: 600 }}>{notice.summary}</p>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#444', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {(notice.details || []).map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                      {notice.refImage && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <button
                            type="button"
                            className="view-step-btn"
                            onClick={() => setPreviewImageModal({ title: notice.title, src: notice.refImage })}
                          >
                            📷 콘솔/공지 원본 사진 보기
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: 🧲 장비 제원 · AI 서버 (JLK 10.65.17.93) · 단축코드
         ==================================================================== */}
      {activeWorkspaceModal === 'equipment' && (
        <div className="modal" onClick={() => setActiveWorkspaceModal(null)}>
          <div className="modal-content xl-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setActiveWorkspaceModal(null)}>
              &times;
            </span>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--hallym-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
              🧲 3.0T <span style={{ color: 'var(--hallym-pink)' }}>장비 · 외부 AI 서버</span> & 단축코드
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1.4rem', fontSize: '0.96rem' }}>
              JLK MEDIHUB STROKE 접속 정보, 7대 외부 서버 전송 매트릭스, 응급실/착신전환 필수 코드입니다.
            </p>

            <div
              style={{
                background: 'linear-gradient(135deg, #f4f7ff 0%, #fff5f7 100%)',
                border: '1.5px solid #d5dceb',
                borderRadius: '18px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.2rem',
                alignItems: 'center'
              }}
            >
              <div>
                <span className="proto-badge urgent" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  AI STROKE PLATFORM
                </span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--hallym-navy)', marginBottom: '0.6rem', fontWeight: 800 }}>
                  {practicalToolsData.jlkPlatform.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  <button
                    type="button"
                    className="view-step-btn"
                    onClick={() => handleCopyText(practicalToolsData.jlkPlatform.ipRaw, 'IP 주소(10.65.17.93) 복사 완료!')}
                  >
                    🌐 IP: {practicalToolsData.jlkPlatform.ipRaw} (복사)
                  </button>
                  <button
                    type="button"
                    className="view-step-btn"
                    onClick={() => handleCopyText(practicalToolsData.jlkPlatform.userId, 'ID(user0001) 복사 완료!')}
                  >
                    👤 ID: {practicalToolsData.jlkPlatform.userId} (복사)
                  </button>
                  <button
                    type="button"
                    className="view-step-btn"
                    onClick={() => handleCopyText(practicalToolsData.jlkPlatform.password, 'PW(jlk123123) 복사 완료!')}
                  >
                    🔑 PW: {practicalToolsData.jlkPlatform.password} (복사)
                  </button>
                </div>
                <div style={{ fontSize: '0.92rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 600 }}>
                  {practicalToolsData.jlkPlatform.steps.map((st, idx) => (
                    <div key={idx}>{st}</div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <img
                  src={practicalToolsData.jlkPlatform.refImage}
                  alt="JLK Medihub Guide"
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    border: '1px solid #cfd6e6',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    setPreviewImageModal({
                      title: practicalToolsData.jlkPlatform.name,
                      src: practicalToolsData.jlkPlatform.refImage
                    })
                  }
                />
              </div>
            </div>

            <h3 style={{ color: 'var(--hallym-navy)', fontSize: '1.18rem', marginBottom: '0.8rem', fontWeight: 800 }}>
              📤 7대 외부 분석 서버 & 외장하드 전송 매트릭스
            </h3>
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th style={{ width: '240px' }}>목적지 서버 / 저장소</th>
                    <th>필수 전송 대상 검사 및 시퀀스</th>
                  </tr>
                </thead>
                <tbody>
                  {practicalToolsData.serverRoutingSummary.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: 'var(--hallym-pink-dark)' }}>{row.server}</strong>
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ color: 'var(--hallym-navy)', fontSize: '1.18rem', marginBottom: '0.8rem', fontWeight: 800 }}>
              ☎️ 검사실 필수 내선 · 착신 코드 & 신규 처방 코드
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {practicalToolsData.quickCodes.map((qc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f9fafc',
                    border: '1.5px solid #e1e6f0',
                    padding: '1.05rem',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#666', fontWeight: 700 }}>{qc.badge}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--hallym-pink-dark)', margin: '0.25rem 0' }}>
                    {qc.code}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#333' }}>{qc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: 🎓 학생 & 신규자 공간 (3D 인터랙티브 플래시카드)
         ==================================================================== */}
      {activeWorkspaceModal === 'student' && (
        <div className="modal" onClick={() => setActiveWorkspaceModal(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setActiveWorkspaceModal(null)}>
              &times;
            </span>

            <h2 style={{ fontSize: '1.75rem', color: 'var(--hallym-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
              🎓 학생 · 신규자 <span style={{ color: 'var(--hallym-pink)' }}>3D 플래시카드</span> 트레이닝
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1.2rem', fontSize: '0.96rem' }}>
              카드를 클릭하면 3D로 회전하며 정답과 해설이 나타납니다.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
              {[
                { id: 'ALL', label: `전체 (${flashcards.length})` },
                { id: '테마 1: 파라메타 원리', label: '테마 1: 파라메타 원리' },
                { id: '테마 2: 제조사별 시퀀스 명칭', label: '테마 2: 제조사별 명칭' },
                { id: '테마 3: 한림 실무 & 최신지침', label: '테마 3: 한림 실무 & 최신지침' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`quick-chip ${cardThemeFilter === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setCardThemeFilter(t.id);
                    setCurrentCardIdx(0);
                    setIsCardFlipped(false);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flashcard-container" onClick={() => setIsCardFlipped(!isCardFlipped)}>
              <div className={`flashcard ${isCardFlipped ? 'is-flipped' : ''}`}>
                <div className="flashcard-face flashcard-front">
                  <span className="proto-badge" style={{ marginBottom: '0.8rem' }}>
                    {activeFlashcard.theme} · Q {currentCardIdx + 1} / {filteredFlashcards.length}
                  </span>
                  <h3 style={{ fontSize: '1.28rem', lineHeight: 1.5, color: 'var(--hallym-navy)', fontWeight: 800, whiteSpace: 'pre-line' }}>
                    {activeFlashcard.q}
                  </h3>
                  <span style={{ marginTop: '1.4rem', fontSize: '0.9rem', fontWeight: 800, color: 'var(--hallym-pink)' }}>
                    👆 카드를 클릭하면 정답이 뒤집힙니다
                  </span>
                </div>

                <div className="flashcard-face flashcard-back">
                  <span className="proto-badge urgent" style={{ marginBottom: '0.7rem' }}>
                    ANSWER · 정답 및 핵심 해설
                  </span>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: 1.65,
                      color: '#222',
                      fontWeight: 600,
                      whiteSpace: 'pre-line',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {activeFlashcard.a}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIdx((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
                }}
              >
                ← 이전 문제
              </button>

              <button
                type="button"
                className="view-step-btn"
                onClick={() => setIsCardFormOpen(!isCardFormOpen)}
              >
                {isCardFormOpen ? '입력창 닫기' : '+ 새 학습 카드 추가'}
              </button>

              <button
                type="button"
                className="cta-btn"
                onClick={() => {
                  setIsCardFlipped(false);
                  setCurrentCardIdx((prev) => (prev + 1) % filteredFlashcards.length);
                }}
              >
                다음 문제 →
              </button>
            </div>

            {isCardFormOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cardForm.q.trim() || !cardForm.a.trim()) return;
                  setFlashcards((prev) => [...prev, { ...cardForm }]);
                  setCardForm({ ...cardForm, q: '', a: '' });
                  setIsCardFormOpen(false);
                  showToast('✅ 새 학습 플래시카드가 추가되었습니다!');
                }}
                style={{
                  marginTop: '1.4rem',
                  paddingTop: '1.2rem',
                  borderTop: '1px solid #e1e6f0'
                }}
              >
                <div className="form-group">
                  <label>테마 분류</label>
                  <select
                    value={cardForm.theme}
                    onChange={(e) => setCardForm({ ...cardForm, theme: e.target.value })}
                  >
                    <option value="테마 1: 파라메타 원리">테마 1: 파라메타 원리</option>
                    <option value="테마 2: 제조사별 시퀀스 명칭">테마 2: 제조사별 시퀀스 명칭</option>
                    <option value="테마 3: 한림 실무 & 최신지침">테마 3: 한림 실무 & 최신지침</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>질문 (Question)</label>
                  <input
                    type="text"
                    required
                    value={cardForm.q}
                    onChange={(e) => setCardForm({ ...cardForm, q: e.target.value })}
                    placeholder="질문을 입력하세요"
                  />
                </div>
                <div className="form-group">
                  <label>정답 및 해설 (Answer)</label>
                  <textarea
                    rows="3"
                    required
                    value={cardForm.a}
                    onChange={(e) => setCardForm({ ...cardForm, a: e.target.value })}
                    placeholder="정답을 입력하세요"
                  />
                </div>
                <button type="submit" className="cta-btn">
                  💾 카드 저장
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: ⚙️ 백엔드 데이터 아키텍처 & 통합 관리 콘솔
         ==================================================================== */}
      {activeWorkspaceModal === 'backend' && (
        <div className="modal" onClick={() => setActiveWorkspaceModal(null)}>
          <div className="modal-content xl-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setActiveWorkspaceModal(null)}>
              &times;
            </span>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--hallym-navy)', marginBottom: '0.4rem', fontWeight: 800 }}>
              ⚙️ 백엔드 <span style={{ color: 'var(--hallym-pink)' }}>데이터 아키텍처 & 관리 콘솔</span>
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
              백엔드 데이터가 <code>src/backend/</code> 폴더 내 5개 모듈로 깔끔하게 분리되어 있으며, 웹 화면에서도 즉시 조회·수정·JSON 백업 및 초기화가 가능합니다.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              {[
                { id: 'overview', label: '🗂️ 백엔드 모듈 구조 & 통계' },
                { id: 'protocols', label: `📋 전체 프로토콜 DB 관리 (${backendStats.totalProtocols})` },
                { id: 'json', label: '💾 JSON 백업 / 복원 / 초기화' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`step-tab-btn ${backendTab === t.id ? 'active' : ''}`}
                  style={{ flex: '1 1 auto' }}
                  onClick={() => setBackendTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {backendTab === 'overview' && (
              <div>
                <div className="sim-gauges-row" style={{ marginBottom: '1.4rem' }}>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.82rem', color: '#666', fontWeight: 700 }}>전체 등록 프로토콜</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--hallym-pink-dark)' }}>
                      {backendStats.totalProtocols}개
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.82rem', color: '#666', fontWeight: 700 }}>분리된 파라메타 원리</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--hallym-teal-dark)' }}>
                      {backendStats.totalCoreParams + backendStats.totalConsoleParams}종
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.82rem', color: '#666', fontWeight: 700 }}>임상 공지 & 지침</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--hallym-navy)' }}>
                      {backendStats.totalNotices}건
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.82rem', color: '#666', fontWeight: 700 }}>3D 학습 플래시카드</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--hallym-purple)' }}>
                      {backendStats.totalFlashcards}장
                    </div>
                  </div>
                </div>

                <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.7rem', fontSize: '1.1rem' }}>
                  📁 모듈화된 백엔드 파일 구조 (src/backend/)
                </h4>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>백엔드 모듈 파일</th>
                      <th>역할 및 수록 데이터</th>
                      <th>데이터 규모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backendStats.modules.map((m, idx) => (
                      <tr key={idx}>
                        <td>
                          <code style={{ color: 'var(--hallym-pink-dark)', fontWeight: 800 }}>{m.file}</code>
                        </td>
                        <td style={{ fontWeight: 600 }}>{m.role}</td>
                        <td>
                          <span className="proto-badge">{m.count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {backendTab === 'protocols' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div className="search-input-wrap" style={{ flex: 1 }}>
                    <span>🔍</span>
                    <input
                      type="text"
                      placeholder="프로토콜 이름 또는 부위 검색..."
                      value={backendSearch}
                      onChange={(e) => setBackendSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="cta-btn"
                    onClick={() => openAddProtocolModal('brain')}
                  >
                    + 새 프로토콜 등록
                  </button>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>부위</th>
                        <th>프로토콜명</th>
                        <th>태그</th>
                        <th>소요시간</th>
                        <th>시퀀스 수</th>
                        <th>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(protocolsDB).flatMap(([partKey, list]) =>
                        list
                          .filter((p) =>
                            [partKey, p.name, p.tag].join(' ').toLowerCase().includes(backendSearch.toLowerCase())
                          )
                          .map((p) => (
                            <tr key={p.id}>
                              <td>
                                <strong style={{ color: 'var(--hallym-teal-dark)', textTransform: 'uppercase' }}>
                                  {partKey}
                                </strong>
                              </td>
                              <td>
                                <strong>{p.name}</strong>
                              </td>
                              <td>{p.tag}</td>
                              <td>{p.time}</td>
                              <td>{(p.sequences || []).length}개</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <button
                                    type="button"
                                    className="view-step-btn"
                                    onClick={() => openEditProtocolModal({ ...p, _partKey: partKey })}
                                  >
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    className="quick-chip"
                                    onClick={() => handleDeleteProtocol(partKey, p.id, p.name)}
                                  >
                                    삭제
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {backendTab === 'json' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div
                  style={{
                    background: '#f9fafc',
                    border: '1px solid #d5dceb',
                    padding: '1.4rem',
                    borderRadius: '16px'
                  }}
                >
                  <h4 style={{ color: 'var(--hallym-navy)', marginBottom: '0.5rem' }}>
                    📥 전체 백엔드 데이터 JSON 파일로 내보내기 (Backup)
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#555', marginBottom: '1rem' }}>
                    현재 수정/추가된 모든 프로토콜, 공지사항, 플래시카드 데이터를 JSON 파일로 다운로드하여 안전하게 보관합니다.
                  </p>
                  <button
                    type="button"
                    className="cta-btn"
                    onClick={() => {
                      const dataStr = JSON.stringify(
                        { protocolsDB, noticesList, flashcards, exportedAt: new Date().toISOString() },
                        null,
                        2
                      );
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `hallym-mri-backend-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('💾 백엔드 JSON 백업 파일이 다운로드되었습니다!');
                    }}
                  >
                    💾 JSON 백업 파일 다운로드
                  </button>
                </div>

                <div
                  style={{
                    background: '#fff5f7',
                    border: '1px solid #f8b4c4',
                    padding: '1.4rem',
                    borderRadius: '16px'
                  }}
                >
                  <h4 style={{ color: 'var(--hallym-pink-dark)', marginBottom: '0.5rem' }}>
                    🔄 초기 표준 데이터로 전체 복원 (Factory Reset)
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#555', marginBottom: '1rem' }}>
                    브라우저 LocalStorage에 저장된 변경사항을 지우고, 2026 최신 개정판 원본 데이터베이스(src/backend/*) 상태로 초기화합니다.
                  </p>
                  <button
                    type="button"
                    className="cta-btn-outline"
                    onClick={() => {
                      if (!window.confirm('모든 데이터를 초기 표준 상태로 복원하시겠습니까?')) return;
                      const defaults = backendService.resetAllToDefault();
                      setProtocolsDB(defaults.protocols);
                      setNoticesList(defaults.notices);
                      setFlashcards(defaults.flashcards);
                      showToast('🔄 초기 표준 데이터베이스로 복원되었습니다!');
                    }}
                  >
                    🔄 표준 데이터로 초기화
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 6: 📷 콘솔 화면 / 플랜 참고 사진 원본 확대 뷰어
         ==================================================================== */}
      {previewImageModal && (
        <div className="modal" onClick={() => setPreviewImageModal(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <span className="close-btn" onClick={() => setPreviewImageModal(null)}>
              &times;
            </span>
            <h3 style={{ color: 'var(--hallym-navy)', marginBottom: '1rem', fontWeight: 800 }}>
              📷 {previewImageModal.title}
            </h3>
            <img
              src={previewImageModal.src}
              alt={previewImageModal.title}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '2px solid #dfe4ff',
                background: '#182036'
              }}
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          FOOTER (한림대학교성심병원 공식 푸터 스타일)
         ==================================================================== */}
      <footer>
        <div className="footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src="./hallym/img_logo.png"
              alt="한림대학교성심병원"
              style={{ height: '32px', filter: 'brightness(1.8)' }}
            />
            <span>| 영상의학과 MRI실 통합 프로토콜 & 파라메타 연구소</span>
          </div>
          <p>&copy; 2026 Hallym University Sacred Heart Hospital MRI Room. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
