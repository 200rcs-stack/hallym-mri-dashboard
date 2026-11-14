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
  brain: './hallym/ptm405_img2_CNC_b.png',
  'c-spine': './hallym/ptm405_img2_SPC_b.png',
  chest: './hallym/ptm405_img2_CVC_b.png',
  abdomen: './hallym/ptm405_img2_DDC_b.png',
  pelvis: './hallym/ptm405_img2_BEC_b.png',
  knee: './hallym/ptm405_img2_HCC_b.png'
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
  // 2. 메인 화면 탭 & 검색 상태 (복잡한 중복 모달 대신 깔끔한 페이지 탭 전환)
  // ==========================================================================
  // 'protocols' | 'parameter' | 'clinical' | 'equipment' | 'student' | 'backend'
  const [activeMainTab, setActiveMainTab] = useState('protocols');
  const [selectedPart, setSelectedPart] = useState('brain');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickChip, setActiveQuickChip] = useState('ALL');
  const [copyToast, setCopyToast] = useState('');

  // 메인 비주얼 비디오 제어 및 위젯 접기/펼치기 상태
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isHeroWidgetVisible, setIsHeroWidgetVisible] = useState(true);

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

  // 프로토콜 상세 시트 모달 & 추가/수정 모달 & 이미지 확대 모달
  const [viewingProtocol, setViewingProtocol] = useState(null);
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
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // [탭 2: 파라메타 원리 연구소] 서브탭 & 시뮬레이터 상태
  const [paramSubTab, setParamSubTab] = useState('core10');
  const [consoleSearch, setConsoleSearch] = useState('');
  const [simVoxel, setSimVoxel] = useState(50);
  const [simBW, setSimBW] = useState(50);
  const [simETL, setSimETL] = useState(40);
  const [simTR, setSimTR] = useState(55);

  // [탭 3: 교수님 지침 & 에러 대처] 서브탭 상태
  const [clinicalCategory, setClinicalCategory] = useState('all');

  // [탭 5: 3D 학습 플래시카드] 상태
  const [cardThemeFilter, setCardThemeFilter] = useState('ALL');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [cardForm, setCardForm] = useState({ theme: '테마 3: 한림 실무 & 최신지침', q: '', a: '' });

  // [탭 6: 백엔드 관리 콘솔] 탭 상태
  const [backendTab, setBackendTab] = useState('overview');
  const [backendSearch, setBackendSearch] = useState('');

  // ==========================================================================
  // 3. 유틸리티 함수
  // ==========================================================================
  const showToast = (msg) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 2600);
  };

  const handleCopyText = (text, label = '클립보드에 복사되었습니다!') => {
    navigator.clipboard?.writeText(text);
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

  // 초보자용 빠른 필터 칩
  const quickChips = [
    { id: 'ALL', label: '전체 보기', query: '' },
    { id: 'URGENT', label: '🚨 교수님 지침 있는 검사', query: '__URGENT__' },
    { id: 'JEON', label: '전치만 교수님 3D (0.8mm)', part: 'brain', query: '전치만' },
    { id: 'MASS', label: '고성혜 교수님 Extremity Mass', part: 'knee', query: 'Extremity' },
    { id: 'SHOULDER', label: 'Shoulder 손바닥 위로', part: 'knee', query: 'Shoulder' },
    { id: 'MRCP', label: 'MRCP 에러 해결', part: 'abdomen', query: 'MRCP' },
    { id: 'ANKLE', label: 'Ankle 아킬레스 플랜', part: 'knee', query: 'Ankle' },
    { id: 'HEART', label: '심장 MRI 파라메타표', part: 'chest', query: 'Heart' }
  ];

  const handleQuickChipClick = (chip) => {
    setActiveMainTab('protocols');
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

  const openAddProtocolModal = (partKey = selectedPart) => {
    setEditingProtoMode('add');
    setProtoForm({
      part: partKey,
      id: `proto-${Date.now()}`,
      name: '',
      tag: '표준 프로토콜',
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
    showToast('✅ 프로토콜이 저장되었습니다!');
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

  // 파라메타 시뮬레이터 계산식
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
      {/* 토스트 알림 */}
      {copyToast && <div className="toast-msg">{copyToast}</div>}

      {/* ====================================================================
          1. 단일 클린 헤더 (로고 + 5대 핵심 탭 + 직통번호/공유 유틸)
         ==================================================================== */}
      <header className="clean-header">
        <div className="clean-header-inner">
          <div
            className="clean-brand"
            onClick={() => {
              setActiveMainTab('protocols');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src="./hallym/img_logo.png" alt="한림대학교성심병원 로고" className="clean-logo" />
            <span className="clean-dept-tag">3.0T MRI 임상 포털</span>
          </div>

          <nav className="clean-nav-tabs">
            <button
              type="button"
              className={`clean-nav-btn ${activeMainTab === 'protocols' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('protocols')}
            >
              📋 부위별 프로토콜
            </button>
            <button
              type="button"
              className={`clean-nav-btn ${activeMainTab === 'parameter' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('parameter')}
            >
              🎛️ 파라메타 원리
              <span className="clean-nav-badge">독립분리</span>
            </button>
            <button
              type="button"
              className={`clean-nav-btn ${activeMainTab === 'clinical' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('clinical')}
            >
              📌 교수님 지침 · 에러
              <span className="clean-nav-badge">{noticesList.length}</span>
            </button>
            <button
              type="button"
              className={`clean-nav-btn ${activeMainTab === 'equipment' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('equipment')}
            >
              🖧 외부서버 · 코드
            </button>
            <button
              type="button"
              className={`clean-nav-btn ${activeMainTab === 'student' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('student')}
            >
              🎓 3D 학습카드
            </button>
          </nav>

          <div className="clean-header-utils">
            <div className="util-tel-pill">
              ☎️ 응급처방 <strong>1576</strong> · 착신 <strong>#41/#49</strong>
            </div>
            <button
              type="button"
              className="util-icon-btn"
              onClick={() =>
                handleCopyText(
                  'https://hallym-mri-dashboard.vercel.app/',
                  '로그인 없이 바로 열리는 공개 주소가 복사되었습니다!'
                )
              }
              title="다른 컴퓨터 공유용 무로그인 주소 복사"
            >
              🔗 주소복사
            </button>
            <button
              type="button"
              className={`util-icon-btn ${activeMainTab === 'backend' ? 'active' : ''}`}
              onClick={() => setActiveMainTab('backend')}
            >
              ⚙️ DB관리
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. 정돈된 슬림 히어로 배너 (통합 검색 + 3.0T 모션그래픽 + 방사선사 11명)
         ==================================================================== */}
      <section className="clean-hero">
        <div className="clean-hero-bg">
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
          <div className="clean-hero-overlay"></div>
        </div>

        <div
          className="clean-hero-inner"
          style={{ gridTemplateColumns: isHeroWidgetVisible ? undefined : '1fr' }}
        >
          {/* 좌측: 타이틀 & 통합 검색 & 동영상 제어 */}
          <div className="hero-left-content">
            <div className="hero-eyebrow">
              <span>HALLYM UNIVERSITY SACRED HEART HOSPITAL · 3.0T MR CENTER</span>
            </div>
            <h1>
              한림대학교성심병원 <span>MRI 표준 임상 허브</span>
            </h1>
            <p>
              초보자도 한눈에 볼 수 있는 6대 부위별 표준 프로토콜과 독립 분리된 파라메타 원리 연구소
            </p>

            <div className="hero-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="검사명, 교수님(전치만·고성혜·노규철), 질환(Mass, 아킬레스), 서버(JLK, ISP) 검색..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveQuickChip('CUSTOM');
                  if (activeMainTab !== 'protocols') setActiveMainTab('protocols');
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="hero-search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveQuickChip('ALL');
                  }}
                >
                  초기화 ✕
                </button>
              )}
            </div>

            <div className="hero-video-controls">
              <button type="button" className="hero-vid-btn" onClick={toggleHeroVideo}>
                {isVideoPlaying ? '⏸ 배경영상 일시정지' : '▶ 배경영상 재생'}
              </button>
              <button
                type="button"
                className="hero-vid-btn"
                onClick={() => setIsHeroWidgetVisible(!isHeroWidgetVisible)}
              >
                {isHeroWidgetVisible ? '🎬 배경영상 넓게 보기 (우측 위젯 접기)' : '🧲 3.0T & 방사선사 위젯 펼치기'}
              </button>
            </div>
          </div>

          {/* 우측: 3.0T 라이브 모션그래픽 + 방사선사 11명 반투명 글래스 위젯 */}
          {isHeroWidgetVisible && (
            <div className="hero-right-panel">
              <div className="hero-mri-motion-box">
                <div className="motion-box-top">
                  <span>🧲 3.0T RESONANCE</span>
                  <span className="live-dot-badge">
                    <span className="pulse-pink-dot"></span> LIVE
                  </span>
                </div>

                <div className="gantry-anim-ring-wrap">
                  <div className="gantry-ring-1"></div>
                  <div className="gantry-ring-2"></div>
                  <div className="gantry-ring-3">
                    <div className="gantry-laser"></div>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--hallym-pink)', fontWeight: 900 }}>3.0T</strong>
                    <span style={{ fontSize: '0.62rem', color: 'var(--hallym-brand-navy)', fontWeight: 800 }}>SPIN ECHO</span>
                  </div>
                </div>

                <div className="hallym-rf-bars">
                  {Array.from({ length: 14 }).map((_, idx) => (
                    <div key={idx} className="hallym-rf-bar"></div>
                  ))}
                </div>
              </div>

              <div className="hero-tech-box" style={{ background: 'rgba(255,255,255,0.86)' }}>
                <div className="tech-card-header">
                  <span>👨‍⚕️ MR 방사선사</span>
                  <span
                    style={{
                      background: 'var(--hallym-pink-soft)',
                      color: 'var(--hallym-pink-dark)',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '99px',
                      fontSize: '0.72rem'
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
          )}
        </div>
      </section>

      {/* ====================================================================
          3. 메인 콘텐츠 캔버스 (선택한 상단 탭에 따라 깔끔하게 전환)
         ==================================================================== */}
      <main className="clean-main-container">
        {/* ------------------------------------------------------------------
            VIEW 1: 📋 부위별 MRI 표준 프로토콜 (기본 화면)
           ------------------------------------------------------------------ */}
        {activeMainTab === 'protocols' && (
          <>
            {/* 한 줄 요약 필독 공지 바 */}
            <div className="clean-notice-strip">
              <div className="clean-notice-left">
                <span className="clean-notice-pill">필독 핵심지침</span>
                <span>
                  피부·성형·혈종 사지 처방은 <strong>Extremity Mass(+마커)</strong> · Shoulder는{' '}
                  <strong>손바닥 위로(AX→SAG→COR)</strong> · 전치만 교수님 Brain 3D는{' '}
                  <strong>0.8mm 스캔 후 1mm Recon</strong>
                </span>
              </div>
              <button
                type="button"
                className="view-step-btn"
                onClick={() => {
                  setClinicalCategory('all');
                  setActiveMainTab('clinical');
                }}
              >
                전체 지침 14건 보기 →
              </button>
            </div>

            {/* 6대 검사부위 수평 카드 탭 (한림 공식 360도 회전 아이콘) */}
            <div className="clean-part-grid">
              {bodyPartsConfig.map((part) => {
                const count = (protocolsDB[part.id] || []).length;
                const isActive = selectedPart === part.id && !searchQuery;
                return (
                  <button
                    key={part.id}
                    type="button"
                    className={`clean-part-card ${isActive ? 'active' : ''}`}
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
                    <div className="clean-part-info">
                      <span className="clean-part-ko">{part.koLabel}</span>
                      <span className="clean-part-en">{part.label}</span>
                    </div>
                    <span className="clean-part-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* 빠른 필터 칩 & 프로토콜 등록 버튼 */}
            <div className="clean-filter-bar">
              <div className="quick-chips-row">
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
              <button
                type="button"
                className="cta-btn"
                onClick={() => openAddProtocolModal(selectedPart)}
              >
                + 새 프로토콜 추가
              </button>
            </div>

            {/* 좌측 2열 프로토콜 카드 그리드 + 우측 3D 바디 스캐너 & 직통 안내 */}
            <div className="clean-protocol-layout">
              <div className="clean-protocol-panel">
                <div className="clean-panel-header">
                  <div>
                    <div className="clean-panel-title">
                      {searchQuery
                        ? `🔍 '${searchQuery}' 검색 결과 (${displayedProtocols.length}건)`
                        : `${currentPartInfo.koLabel} 표준 프로토콜 (${displayedProtocols.length}건)`}
                    </div>
                    <p className="clean-panel-sub">
                      카드를 클릭하면 <strong>촬영 시퀀스 순서 · 초보자 플랜 팁 · PACS 전송 · 교수님 지침</strong>을 한눈에 볼 수 있습니다.
                    </p>
                  </div>
                </div>

                {displayedProtocols.length === 0 ? (
                  <div
                    style={{
                      padding: '3rem 1.5rem',
                      textAlign: 'center',
                      color: 'var(--text-sub)',
                      background: '#f8fafc',
                      borderRadius: '12px'
                    }}
                  >
                    조건에 맞는 프로토콜이 없습니다. 검색어를 초기화하거나 다른 부위를 선택해 보세요.
                  </div>
                ) : (
                  <div className="clean-protocol-grid">
                    {displayedProtocols.map((proto) => {
                      const hasUrgentUpdate = proto.updates2026 && proto.updates2026.length > 0;
                      return (
                        <div
                          key={proto.id}
                          className="clean-proto-card"
                          onClick={() => setViewingProtocol(proto)}
                        >
                          <div>
                            <div className="proto-card-top">
                              <div className="proto-card-title">{proto.name}</div>
                              <span className="proto-time-pill">⏱ {proto.time}</span>
                            </div>

                            <div className="proto-card-meta" style={{ marginTop: '0.65rem' }}>
                              <div>
                                <strong>코일/자세</strong> {proto.coilPosition}
                              </div>
                              <div>
                                <strong>조영/약물</strong> {proto.contrastInfo}
                              </div>
                            </div>
                          </div>

                          <div className="proto-card-footer">
                            <div className="proto-tags-wrap">
                              {proto._partLabel && searchQuery && (
                                <span className="proto-badge photo">{proto._partLabel}</span>
                              )}
                              <span className="proto-badge">
                                시퀀스 {(proto.sequences || []).length}단계
                              </span>
                              {hasUrgentUpdate && (
                                <span className="proto-badge urgent">
                                  필수지침 {proto.updates2026.length}건
                                </span>
                              )}
                              {proto.refImage && <span className="proto-badge photo">📷 콘솔사진</span>}
                            </div>
                            <span className="proto-open-link">상세보기 →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 우측 사이드바: 3D 인체 스캐너 + 직통번호 + 무로그인 웹 공유 QR */}
              <aside className="clean-side-column">
                <div className="body-map-container">
                  <div className="body-map-hud-label">
                    <span>3.0T BODY SCANNER</span>
                    <span>{currentPartInfo.label}</span>
                  </div>
                  <div className="body-map-wrapper">
                    <div className="body-scan-laser"></div>
                    <img src="./body-scan.png" alt="Human Body Map" className="body-scan-img" />
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

                {/* 검사실 직통 & JLK 원클릭 복사 카드 */}
                <div className="clean-side-card">
                  <h4>
                    <span>☎️ 검사실 필수 코드 · JLK</span>
                    <button
                      type="button"
                      className="view-step-btn"
                      onClick={() => setActiveMainTab('equipment')}
                    >
                      전체 서버 →
                    </button>
                  </h4>
                  <div className="side-code-list">
                    <div className="side-code-row">
                      <span>응급실 처방변경</span>
                      <strong>1576</strong>
                    </div>
                    <div className="side-code-row">
                      <span>자리 비울 때 이동착신</span>
                      <strong>#41 + 방번호</strong>
                    </div>
                    <div className="side-code-row">
                      <span>이동착신 해제</span>
                      <strong>#49</strong>
                    </div>
                    <div
                      className="side-code-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCopyText('10.65.17.93', 'JLK 서버 IP(10.65.17.93) 복사 완료!')}
                    >
                      <span>JLK 뇌졸중 서버 (클릭 복사)</span>
                      <strong style={{ color: 'var(--hallym-teal-dark)' }}>10.65.17.93 📋</strong>
                    </div>
                  </div>
                </div>

                {/* 다른 PC · 모바일 무로그인 접속 카드 */}
                <div className="clean-side-card" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--hallym-pink)' }}>
                      PUBLIC WEB ACCESS
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0.15rem 0 0.35rem' }}>
                      다른 PC · 모바일 바로 열기
                    </div>
                    <button
                      type="button"
                      className="view-step-btn"
                      style={{ width: '100%' }}
                      onClick={() =>
                        handleCopyText(
                          'https://hallym-mri-dashboard.vercel.app/',
                          '로그인 불필요 공개 주소가 복사되었습니다!'
                        )
                      }
                    >
                      📋 공개 주소 복사
                    </button>
                  </div>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://hallym-mri-dashboard.vercel.app/&bgcolor=ffffff&color=1e293b"
                    alt="QR Code"
                    style={{
                      width: '78px',
                      height: '78px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      padding: '3px',
                      flexShrink: 0
                    }}
                  />
                </div>
              </aside>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------
            VIEW 2: 🎛️ MRI 파라메타 원리 & 물리 연구소 (독립 분리 섹션)
           ------------------------------------------------------------------ */}
        {activeMainTab === 'parameter' && (
          <div className="clean-section-card">
            <div className="clean-section-head">
              <div>
                <span className="proto-badge urgent" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                  독립 분리 섹션 · PDF 43~55P 수록
                </span>
                <h2>
                  🎛️ MRI <span>파라메타 원리</span> 연구소
                </h2>
                <p>
                  프로토콜과 완전히 분리된 파라메타 물리 원리 전용 공간입니다. 슬라이더를 조절해 상관관계를 직접 체험해 보세요.
                </p>
              </div>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => setActiveMainTab('protocols')}
              >
                ← 프로토콜 목록으로
              </button>
            </div>

            {/* 실시간 파라메타 시뮬레이터 */}
            <div className="param-sim-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontSize: '0.98rem' }}>
                  ⚡ 인터랙티브 파라메타 줄다리기 시뮬레이터
                </strong>
                <button
                  type="button"
                  className="view-step-btn"
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
                    <span>🧱 Voxel 크기</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simVoxel}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={simVoxel} onChange={(e) => setSimVoxel(Number(e.target.value))} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    작게: 고해상도·SNR↓ / 크게: SNR↑·부분용적↑
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
                    <span>📻 대역폭 BW (WFS 반비례)</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simBW}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={simBW} onChange={(e) => setSimBW(Number(e.target.value))} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    좁게: SNR↑·왜곡↑ / 넓게: 금속·화학이동 왜곡↓
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
                    <span>🖨️ 터보팩터 ETL</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simETL}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={simETL} onChange={(e) => setSimETL(Number(e.target.value))} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    짧게: 선명도↑·SAR↓ / 길게: 시간단축↓·블러↑
                  </div>
                </div>

                <div className="sim-slider-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 800 }}>
                    <span>🔋 반복시간 TR</span>
                    <span style={{ color: 'var(--hallym-pink)' }}>{simTR}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={simTR} onChange={(e) => setSimTR(Number(e.target.value))} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>
                    짧게: T1 강조·SAR↑ / 길게: SNR↑·SAR 안전↓
                  </div>
                </div>
              </div>

              <div className="sim-gauges-row">
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>신호대잡음비 (SNR)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--hallym-blue)' }}>{simMetrics.snr}점</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>예상 스캔 시간</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-dark)' }}>{simMetrics.scanTime}%</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>왜곡 억제 & 해상력</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--hallym-teal-dark)' }}>{simMetrics.clarity}점</div>
                </div>
                <div className="sim-gauge-box">
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>SAR 열에너지 부담</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: simMetrics.sar > 70 ? 'var(--hallym-pink-dark)' : 'var(--text-dark)' }}>
                    {simMetrics.sar}% {simMetrics.sar > 70 ? '🔥주의' : '안전'}
                  </div>
                </div>
              </div>
            </div>

            {/* 5대 서브탭 */}
            <div className="step-tabs-bar">
              {[
                { id: 'core10', label: '① 10대 핵심 원리 & 비유' },
                { id: 'console14', label: '② 콘솔 실전 14종 가이드' },
                { id: 'recipes4', label: '③ 상황별 레시피 4선 & 공식' },
                { id: 't1t2', label: '④ T1·T2 물리 (10살 버전)' },
                { id: 'dixonVendor', label: '⑤ Dixon 4종 & 제조사 비교표' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`step-tab-btn ${paramSubTab === t.id ? 'active' : ''}`}
                  onClick={() => setParamSubTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {paramSubTab === 'core10' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1rem' }}>
                {parameterPrinciplesData.core10Params.map((item) => (
                  <div
                    key={item.num}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '1.25rem'
                    }}
                  >
                    <span className="proto-badge" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                      CORE {item.num} · {item.ko}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 800 }}>
                      {item.name}
                    </h3>
                    <div
                      style={{
                        background: 'var(--hallym-pink-soft)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--hallym-pink-dark)',
                        marginBottom: '0.65rem'
                      }}
                    >
                      {item.analogy}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                      <strong>정의:</strong> {item.definition}
                    </p>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-sub)', marginBottom: '0.65rem' }}>
                      <strong>물리 원리:</strong> {item.principle}
                    </p>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                      <div style={{ color: 'var(--hallym-teal-dark)' }}>
                        <strong>🔼 올릴 때(↑):</strong> {item.upFactors}
                      </div>
                      <div style={{ color: 'var(--hallym-pink-dark)' }}>
                        <strong>🔽 낮출 때(↓):</strong> {item.downFactors}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                            <td style={{ minWidth: '160px' }}>
                              <strong style={{ color: 'var(--text-dark)' }}>{c.name}</strong>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>{c.sub}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{c.what}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.2rem' }}>{c.principle}</div>
                            </td>
                            <td style={{ color: 'var(--hallym-teal-dark)', fontWeight: 600 }}>{c.up}</td>
                            <td style={{ color: 'var(--hallym-pink-dark)', fontWeight: 600 }}>{c.down}</td>
                            <td style={{ fontWeight: 700 }}>{c.when}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {paramSubTab === 'recipes4' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {parameterPrinciplesData.recipes4.map((rec) => (
                    <div
                      key={rec.code}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderTop: '4px solid var(--hallym-pink)',
                        borderRadius: '14px',
                        padding: '1.25rem'
                      }}
                    >
                      <div style={{ color: 'var(--hallym-pink-dark)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                        상황별 실전 레시피 {rec.code}
                      </div>
                      <h3 style={{ fontSize: '1.12rem', color: 'var(--text-dark)', marginBottom: '0.25rem', fontWeight: 800 }}>
                        {rec.title}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-sub)', marginBottom: '0.85rem' }}>{rec.subtitle}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {rec.steps.map((st, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid var(--border-subtle)',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.88rem'
                            }}
                          >
                            <strong style={{ color: 'var(--text-dark)' }}>{st.label}:</strong> {st.action}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: 'var(--text-dark)', fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 800 }}>
                  📐 반드시 기억할 3대 핵심 공식
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.9rem' }}>
                  {parameterPrinciplesData.coreFormulas.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        padding: '1.1rem',
                        borderRadius: '12px'
                      }}
                    >
                      <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.4rem', fontSize: '0.92rem' }}>
                        {f.title}
                      </strong>
                      <code
                        style={{
                          display: 'block',
                          background: '#ffffff',
                          color: 'var(--hallym-pink-dark)',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          border: '1px solid var(--border-color)',
                          marginBottom: '0.45rem'
                        }}
                      >
                        {f.formula}
                      </code>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-body)' }}>{f.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paramSubTab === 't1t2' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div
                  style={{
                    background: 'var(--hallym-pink-soft)',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    color: 'var(--hallym-pink-dark)',
                    fontSize: '0.96rem'
                  }}
                >
                  {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.ruleOfThumb}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.75rem', fontSize: '1.02rem' }}>
                      🧒 초보자도 1분 만에 이해하는 MRI 작동 5단계 (10살 버전)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {parameterPrinciplesData.t1t2Master.tenYearOldSteps.map((s) => (
                        <div key={s.step} style={{ fontSize: '0.88rem', background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                          <strong style={{ color: 'var(--hallym-pink-dark)' }}>STEP {s.step}. {s.title}:</strong> {s.desc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.75rem', fontSize: '1.02rem' }}>
                      🎻 바이올린 연주로 이해하는 공명 & T1 vs T2
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '0.85rem' }}>
                      {parameterPrinciplesData.t1t2Master.violinAnalogy.map((v, idx) => (
                        <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.65rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                          <div style={{ fontSize: '0.94rem', marginBottom: '0.15rem', color: 'var(--text-dark)' }}>{v.icon} <strong>{v.term}</strong></div>
                          <div style={{ color: 'var(--text-body)' }}>{v.meaning}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.88rem', background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-dark)' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.title}</strong>
                      <div style={{ fontWeight: 700, marginTop: '0.15rem', color: 'var(--hallym-pink-dark)' }}>• {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.winner}</div>
                      <div style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t1.why}</div>
                    </div>
                    <div style={{ fontSize: '0.88rem', background: '#ffffff', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px' }}>
                      <strong style={{ color: 'var(--text-dark)' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.title}</strong>
                      <div style={{ fontWeight: 700, marginTop: '0.15rem', color: 'var(--hallym-teal-dark)' }}>• {parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.winner}</div>
                      <div style={{ color: 'var(--text-sub)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{parameterPrinciplesData.t1t2Master.t1VsT2Comparison.t2.why}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.6rem', fontSize: '1.02rem' }}>
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

                <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.65rem', fontSize: '1.02rem' }}>
                    ✅ 실전 콘솔 체크리스트 10계명
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '0.5rem' }}>
                    {parameterPrinciplesData.t1t2Master.fieldChecklist10.map((line, idx) => (
                      <div key={idx} style={{ fontSize: '0.88rem', padding: '0.55rem 0.8rem', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {paramSubTab === 'dixonVendor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                    💧 Dixon 기법 4종 영상 (W · F · In · Out) 완벽 비교
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.9rem' }}>
                    {parameterPrinciplesData.dixonFourImages.map((dx, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid var(--border-color)',
                          padding: '1.15rem',
                          borderRadius: '12px'
                        }}
                      >
                        <div style={{ color: 'var(--hallym-pink-dark)', fontWeight: 900, fontSize: '1.02rem', marginBottom: '0.2rem' }}>
                          {dx.code}
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>{dx.title}</div>
                        <span className="proto-badge" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                          {dx.badge}
                        </span>
                        <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', marginBottom: '0.45rem' }}>{dx.desc}</p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                          <strong>임상 활용:</strong> {dx.clinical}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
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
                            <td style={{ color: 'var(--hallym-brand-navy)', fontWeight: 700 }}>{row.ge}</td>
                            <td style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------
            VIEW 3: 📌 교수님 특별지침 · 에러 해결 · 외국인 영어방송
           ------------------------------------------------------------------ */}
        {activeMainTab === 'clinical' && (
          <div className="clean-section-card">
            <div className="clean-section-head">
              <div>
                <h2>
                  📌 임상 <span>교수님 특별지침 & 에러 대처</span> 허브
                </h2>
                <p>
                  판독 교수님 특별 지침, 콘솔 에러 1·2순위 해결법, 신규 처방 코드, 외국인 환자 영어 방송(TTS)을 확인하세요.
                </p>
              </div>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => setActiveMainTab('protocols')}
              >
                ← 프로토콜 목록으로
              </button>
            </div>

            <div className="step-tabs-bar">
              {[
                { id: 'all', label: `전체 지침 (${noticesList.length})` },
                { id: 'professor', label: '👨‍⚕️ 교수님 특별지침' },
                { id: 'equipment', label: '🛠️ 장비·에러 대처 (MRCP/Philips)' },
                { id: 'order', label: '📋 처방·추가시퀀스 (Temporal/ER)' },
                { id: 'server', label: '📤 외부 서버 전송' },
                { id: 'english', label: '🔊 외국인 영어 안내방송 (TTS)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`step-tab-btn ${clinicalCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setClinicalCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {clinicalCategory === 'english' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {practicalToolsData.englishScripts.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '1.25rem'
                    }}
                  >
                    <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.8rem', fontSize: '1rem' }}>{group.step}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
                      {group.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          style={{
                            background: '#ffffff',
                            padding: '1rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                            "{item.en}"
                          </div>
                          <div style={{ color: 'var(--hallym-pink-dark)', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                            🗣️ 발음: {item.pron}
                          </div>
                          <div style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                            뜻: {item.ko}
                          </div>
                          <button type="button" className="view-step-btn" onClick={() => speakEnglish(item.en)}>
                            🔊 원어민 음성 듣기
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1rem' }}>
                {noticesList
                  .filter((n) => clinicalCategory === 'all' || n.category === clinicalCategory)
                  .map((notice) => (
                    <div
                      key={notice.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderTop: notice.priority === 'urgent' ? '3.5px solid var(--hallym-pink)' : '3.5px solid var(--hallym-brand-navy)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                        <span className={`proto-badge ${notice.priority === 'urgent' ? 'urgent' : ''}`}>
                          {notice.categoryLabel}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', fontWeight: 600 }}>{notice.target}</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', fontWeight: 800 }}>{notice.title}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', fontWeight: 600 }}>{notice.summary}</p>
                      <ul style={{ paddingLeft: '1.15rem', fontSize: '0.86rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {(notice.details || []).map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                      {notice.refImage && (
                        <div style={{ marginTop: '0.35rem' }}>
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
        )}

        {/* ------------------------------------------------------------------
            VIEW 4: 🖧 외부 AI 서버 (JLK·ISP·Tera) & 필수 단축코드
           ------------------------------------------------------------------ */}
        {activeMainTab === 'equipment' && (
          <div className="clean-section-card">
            <div className="clean-section-head">
              <div>
                <h2>
                  🖧 외부 <span>AI 분석 서버 & 필수 단축코드</span>
                </h2>
                <p>
                  JLK MEDIHUB STROKE(10.65.17.93) 접속 계정 복사, 7대 외부 서버 전송 매트릭스, 검사실 내선 단축코드입니다.
                </p>
              </div>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => setActiveMainTab('protocols')}
              >
                ← 프로토콜 목록으로
              </button>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '1.35rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.2rem',
                alignItems: 'center'
              }}
            >
              <div>
                <span className="proto-badge urgent" style={{ marginBottom: '0.45rem', display: 'inline-block' }}>
                  AI STROKE PLATFORM
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '0.6rem', fontWeight: 800 }}>
                  {practicalToolsData.jlkPlatform.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
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
                <div style={{ fontSize: '0.88rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontWeight: 600 }}>
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
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
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

            <h3 style={{ color: 'var(--text-dark)', fontSize: '1.08rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              📤 7대 외부 분석 서버 & 외장하드 전송 매트릭스
            </h3>
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th style={{ width: '230px' }}>목적지 서버 / 저장소</th>
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

            <h3 style={{ color: 'var(--text-dark)', fontSize: '1.08rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              ☎️ 검사실 필수 내선 · 착신 코드 & 신규 처방 코드
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.8rem' }}>
              {practicalToolsData.quickCodes.map((qc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    padding: '1rem',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>{qc.badge}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--hallym-pink-dark)', margin: '0.2rem 0' }}>
                    {qc.code}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>{qc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            VIEW 5: 🎓 학생 · 신규자 3D 플래시카드
           ------------------------------------------------------------------ */}
        {activeMainTab === 'student' && (
          <div className="clean-section-card">
            <div className="clean-section-head">
              <div>
                <h2>
                  🎓 학생 · 신규자 <span>3D 플래시카드</span> 트레이닝
                </h2>
                <p>카드를 클릭하면 3D로 회전하며 정답과 핵심 해설이 나타납니다.</p>
              </div>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => setActiveMainTab('protocols')}
              >
                ← 프로토콜 목록으로
              </button>
            </div>

            <div className="quick-chips-row" style={{ marginBottom: '1.2rem' }}>
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
                  <span className="proto-badge" style={{ marginBottom: '0.75rem' }}>
                    {activeFlashcard.theme} · Q {currentCardIdx + 1} / {filteredFlashcards.length}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', lineHeight: 1.5, color: 'var(--text-dark)', fontWeight: 800, whiteSpace: 'pre-line' }}>
                    {activeFlashcard.q}
                  </h3>
                  <span style={{ marginTop: '1.2rem', fontSize: '0.86rem', fontWeight: 700, color: 'var(--hallym-pink)' }}>
                    👆 카드를 클릭하면 정답이 뒤집힙니다
                  </span>
                </div>

                <div className="flashcard-face flashcard-back">
                  <span className="proto-badge urgent" style={{ marginBottom: '0.65rem' }}>
                    ANSWER · 정답 및 핵심 해설
                  </span>
                  <div
                    style={{
                      fontSize: '0.98rem',
                      lineHeight: 1.65,
                      color: 'var(--text-dark)',
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

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
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
                  maxWidth: '680px',
                  margin: '1.5rem auto 0',
                  paddingTop: '1.2rem',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                <div className="form-group">
                  <label>테마 분류</label>
                  <select value={cardForm.theme} onChange={(e) => setCardForm({ ...cardForm, theme: e.target.value })}>
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
        )}

        {/* ------------------------------------------------------------------
            VIEW 6: ⚙️ 백엔드 데이터 아키텍처 & 관리 콘솔
           ------------------------------------------------------------------ */}
        {activeMainTab === 'backend' && (
          <div className="clean-section-card">
            <div className="clean-section-head">
              <div>
                <h2>
                  ⚙️ 백엔드 <span>데이터 아키텍처 & 관리 콘솔</span>
                </h2>
                <p>
                  <code>src/backend/</code> 폴더 내 5개 모듈로 분리된 데이터베이스를 조회·수정·JSON 백업 및 초기화할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                className="cta-btn-outline"
                onClick={() => setActiveMainTab('protocols')}
              >
                ← 프로토콜 목록으로
              </button>
            </div>

            <div className="step-tabs-bar">
              {[
                { id: 'overview', label: '🗂️ 백엔드 모듈 구조 & 통계' },
                { id: 'protocols', label: `📋 전체 프로토콜 DB 관리 (${backendStats.totalProtocols})` },
                { id: 'json', label: '💾 JSON 백업 / 초기화' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`step-tab-btn ${backendTab === t.id ? 'active' : ''}`}
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
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>전체 등록 프로토콜</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-pink-dark)' }}>
                      {backendStats.totalProtocols}개
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>분리된 파라메타 원리</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-teal-dark)' }}>
                      {backendStats.totalCoreParams + backendStats.totalConsoleParams}종
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>임상 공지 & 지침</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>
                      {backendStats.totalNotices}건
                    </div>
                  </div>
                  <div className="sim-gauge-box">
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 700 }}>3D 학습 플래시카드</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hallym-purple)' }}>
                      {backendStats.totalFlashcards}장
                    </div>
                  </div>
                </div>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <div className="search-input-wrap" style={{ flex: 1 }}>
                    <span>🔍</span>
                    <input
                      type="text"
                      placeholder="프로토콜 이름 또는 부위 검색..."
                      value={backendSearch}
                      onChange={(e) => setBackendSearch(e.target.value)}
                    />
                  </div>
                  <button type="button" className="cta-btn" onClick={() => openAddProtocolModal('brain')}>
                    + 새 프로토콜 등록
                  </button>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '460px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', padding: '1.35rem', borderRadius: '14px' }}>
                  <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.45rem' }}>📥 전체 백엔드 데이터 JSON 백업</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
                    현재 프로토콜, 공지사항, 플래시카드 데이터를 JSON 파일로 다운로드합니다.
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
                    💾 JSON 백업 다운로드
                  </button>
                </div>

                <div style={{ background: 'var(--hallym-pink-soft)', border: '1px solid #fecdd3', padding: '1.35rem', borderRadius: '14px' }}>
                  <h4 style={{ color: 'var(--hallym-pink-dark)', marginBottom: '0.45rem' }}>🔄 초기 표준 데이터로 복원</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                    브라우저 저장값을 지우고 2026 최신 개정판 원본 데이터베이스 상태로 초기화합니다.
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
        )}
      </main>

      {/* ====================================================================
          MODAL A: 한눈에 들어오는 2열 시트형 프로토콜 상세 가이드 모달
         ==================================================================== */}
      {viewingProtocol && (
        <div className="modal" onClick={() => setViewingProtocol(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setViewingProtocol(null)}>
              &times;
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <span className="proto-badge">{viewingProtocol.tag || '표준 프로토콜'}</span>
              <span className="proto-time-pill">⏱ 소요시간: {viewingProtocol.time}</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', fontWeight: 800 }}>
              {viewingProtocol.name}
            </h2>

            {/* 상단 코일/포지션 & 조영제 2열 요약 */}
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

            {/* 교수님 필수 지침이 있을 경우 상단에 즉시 노출 */}
            {viewingProtocol.updates2026?.length > 0 && (
              <div
                style={{
                  background: 'var(--hallym-pink-soft)',
                  border: '1px solid #fecdd3',
                  borderLeft: '4px solid var(--hallym-pink)',
                  borderRadius: '11px',
                  padding: '0.9rem 1.1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--hallym-pink-dark)', marginBottom: '0.35rem' }}>
                  🚨 판독 교수님 · 과별 특별 필수 지침
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {viewingProtocol.updates2026.map((up, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#881337' }}>
                      • {up}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 탭 전환 없이 한눈에 보는 좌우 2단 클린 시트 */}
            <div className="detail-sheet-grid">
              {/* 좌측: 1. 촬영 시퀀스 순서 */}
              <div className="detail-sheet-box">
                <h4>1️⃣ 촬영 시퀀스 진행 순서 ({(viewingProtocol.sequences || []).length}단계)</h4>
                <div className="step-list-box">
                  {(viewingProtocol.sequences || []).map((seq, i) => (
                    <div key={i} className="step-row-card">
                      <span className="step-num-circle">{i + 1}</span>
                      <div style={{ flex: 1, fontWeight: 600 }}>{seq}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 우측: 2. 초보자 플랜 팁 + 콘솔 사진 + 3. PACS/외부서버 전송 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="detail-sheet-box">
                  <h4>2️⃣ 초보자 플랜 & 세팅 핵심 팁</h4>
                  <div className="step-list-box">
                    {(viewingProtocol.easyGuide || []).map((tip, i) => (
                      <div key={i} className="step-row-card">
                        <span
                          className="step-num-circle"
                          style={{ background: 'var(--hallym-teal)', color: '#fff' }}
                        >
                          ✓
                        </span>
                        <div style={{ flex: 1 }}>{tip}</div>
                      </div>
                    ))}
                  </div>

                  {viewingProtocol.refImage && (
                    <div style={{ marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                          📷 콘솔 플랜 참고 사진
                        </span>
                        <button
                          type="button"
                          className="view-step-btn"
                          onClick={() => setPreviewImageModal({ title: viewingProtocol.name, src: viewingProtocol.refImage })}
                        >
                          🔍 크게 보기
                        </button>
                      </div>
                      <img
                        src={viewingProtocol.refImage}
                        alt={viewingProtocol.name}
                        style={{
                          width: '100%',
                          maxHeight: '220px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: '#0f172a',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPreviewImageModal({ title: viewingProtocol.name, src: viewingProtocol.refImage })}
                      />
                    </div>
                  )}
                </div>

                <div className="detail-sheet-box">
                  <h4>3️⃣ PACS & 외부 서버 전송 규칙</h4>
                  <div className="step-list-box">
                    {(viewingProtocol.pacsRule || []).map((rule, i) => (
                      <div key={i} className="step-row-card">
                        <span
                          className="step-num-circle"
                          style={{ background: 'var(--hallym-brand-navy)', color: '#fff' }}
                        >
                          📤
                        </span>
                        <div style={{ flex: 1 }}>{rule}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 파라메타 표 (있는 경우 하단 전체 폭으로 표시) */}
            {viewingProtocol.tableData && (
              <div style={{ marginTop: '1.25rem', overflowX: 'auto' }}>
                <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.6rem', fontSize: '0.96rem', fontWeight: 800 }}>
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

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.75rem'
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
                📋 프로토콜 요약 복사
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="cta-btn" onClick={() => openEditProtocolModal(viewingProtocol)}>
                  ✏️ 수정
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
            <button type="button" className="close-btn" onClick={() => setIsEditProtocolOpen(false)}>
              &times;
            </button>
            <h2 style={{ color: 'var(--text-dark)', marginBottom: '1.1rem', fontSize: '1.35rem', fontWeight: 800 }}>
              {editingProtoMode === 'add' ? '+ 새 프로토콜 추가' : '✏️ 프로토콜 수정'}
            </h2>
            <form onSubmit={handleSaveProtocolForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label>검사 부위</label>
                  <select value={protoForm.part} onChange={(e) => setProtoForm({ ...protoForm, part: e.target.value })}>
                    {bodyPartsConfig.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.koLabel} ({b.label})
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
                  />
                </div>
                <div className="form-group">
                  <label>소요 시간</label>
                  <input
                    type="text"
                    value={protoForm.time}
                    onChange={(e) => setProtoForm({ ...protoForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
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
                <label>1️⃣ 촬영 시퀀스 순서 (줄바꿈으로 구분)</label>
                <textarea
                  rows="4"
                  value={protoForm.sequencesText}
                  onChange={(e) => setProtoForm({ ...protoForm, sequencesText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>2️⃣ 초보자 플랜 & 세팅 팁 (줄바꿈으로 구분)</label>
                <textarea
                  rows="3"
                  value={protoForm.easyGuideText}
                  onChange={(e) => setProtoForm({ ...protoForm, easyGuideText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>3️⃣ PACS & 외부 서버 전송 규칙 (줄바꿈으로 구분)</label>
                <textarea
                  rows="2"
                  value={protoForm.pacsRuleText}
                  onChange={(e) => setProtoForm({ ...protoForm, pacsRuleText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>4️⃣ 🚨 교수님·과별 특별지침 (줄바꿈으로 구분)</label>
                <textarea
                  rows="2"
                  value={protoForm.updatesText}
                  onChange={(e) => setProtoForm({ ...protoForm, updatesText: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.8rem' }}>
                <button type="button" className="cta-btn-outline" onClick={() => setIsEditProtocolOpen(false)}>
                  취소
                </button>
                <button type="submit" className="cta-btn">
                  💾 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL C: 콘솔 사진 원본 확대 뷰어
         ==================================================================== */}
      {previewImageModal && (
        <div className="modal" onClick={() => setPreviewImageModal(null)}>
          <div className="modal-content wide-modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <button type="button" className="close-btn" onClick={() => setPreviewImageModal(null)}>
              &times;
            </button>
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '1.15rem' }}>
              📷 {previewImageModal.title}
            </h3>
            <img
              src={previewImageModal.src}
              alt={previewImageModal.title}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '10px',
                background: '#0f172a'
              }}
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          4. 심플하고 깔끔한 푸터
         ==================================================================== */}
      <footer className="clean-footer">
        <div className="clean-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="./hallym/img_logo.png" alt="한림대학교성심병원" style={{ height: '24px', opacity: 0.85 }} />
            <span>
              <strong>한림대학교성심병원 영상의학과 3.0T MRI실</strong> · 임상 표준 프로토콜 &amp; 파라메타 원리 포털
            </span>
          </div>
          <div>
            응급실 처방문의 <strong>1576</strong> · 이동착신 <strong>#41+방번호</strong> (해제 <strong>#49</strong>) · JLK{' '}
            <strong>10.65.17.93</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
