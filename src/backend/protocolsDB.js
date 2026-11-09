/**
 * [백엔드 모듈 1] 부위별 MRI 표준 프로토콜 데이터베이스 (protocolsDB.js)
 * - 구조: brain, c-spine, chest, abdomen, pelvis, knee (6대 부위)
 * - 초보자 친화적 4단 구성:
 *   1) sequences: 스캔 시퀀스 순서
 *   2) easyGuide: 초보자도 바로 따라 하는 플랜 & 세팅 포인트
 *   3) pacsRule: PACS 및 외부 서버(ISP, JLK, Dynapex, Tera, BECAD) 전송 순서
 *   4) updates2026: 교수님/진료과별 최신 필수 지침
 */

export const technologistsList = [
  '채수인', '김성훈', '정재현', '조대현', '김영진', '장찬순', '이기현', '김도완', '최대용', '홍준기', '남도현'
];

export const bodyPartsConfig = [
  {
    id: 'brain',
    label: 'BRAIN / HEAD',
    name: 'BRAIN / HEAD',
    koLabel: '뇌 · 두경부',
    ko: '뇌 · 두경부',
    title: 'BRAIN & NEURO PROTOCOLS',
    searchKeywords: '머리 뇌 브레인 안와 내이도 뇌하수체 혈관 확산 관류 측두하악관절 부비동 brain mra dti perfusion sella orbit temporal pns tmj vessel wall',
    top: '11%', left: '50%', width: '18%', height: '11%',
    hotspot: { top: '11%', left: '50%' },
    img: '/mri_brain.png',
    mriImage: '/mri_brain.png'
  },
  {
    id: 'c-spine',
    label: 'SPINE / NECK',
    name: 'SPINE / NECK',
    koLabel: '척추 · 경부',
    ko: '척추 · 경부',
    title: 'SPINE & NECK PROTOCOLS',
    searchKeywords: '척추 목 허리 등 경추 흉추 요추 스파인 넥 금속 마킹 spine neck c-spine t-spine l-spine dti omar semac',
    top: '21%', left: '50%', width: '12%', height: '6%',
    hotspot: { top: '21%', left: '50%' },
    img: '/mri_spine.png',
    mriImage: '/mri_spine.png'
  },
  {
    id: 'chest',
    label: 'CHEST / HEART',
    name: 'CHEST / HEART',
    koLabel: '심장 · 유방 · 신경총',
    ko: '심장 · 유방 · 신경총',
    title: 'CHEST · HEART · BREAST PROTOCOLS',
    searchKeywords: '가슴 흉부 유방 심장 브레스트 하트 카디악 상완신경총 chest breast heart cardiac brachial plexus',
    top: '31%', left: '50%', width: '34%', height: '16%',
    hotspot: { top: '31%', left: '50%' },
    img: '/mri_chest.png',
    mriImage: '/mri_chest.png'
  },
  {
    id: 'abdomen',
    label: 'ABDOMEN',
    name: 'ABDOMEN',
    koLabel: '복부 · 간 · 담췌 · 소장',
    ko: '복부 · 간 · 담췌 · 소장',
    title: 'ABDOMEN · LIVER · MRCP PROTOCOLS',
    searchKeywords: '복부 배 간 담낭 췌장 담도 신장 부신 소장 프리모비스트 엔테로 레디프리 부스코판 liver abdomen mrcp pancreas kidney adrenal enterography',
    top: '42%', left: '50%', width: '32%', height: '14%',
    hotspot: { top: '42%', left: '50%' },
    img: '/mri_abdomen.png',
    mriImage: '/mri_abdomen.png'
  },
  {
    id: 'pelvis',
    label: 'PELVIS',
    name: 'PELVIS',
    koLabel: '골반 · 전립선 · 직장',
    ko: '골반 · 전립선 · 직장',
    title: 'PELVIS · PROSTATE · RECTAL PROTOCOLS',
    searchKeywords: '골반 전립선 직장 자궁 난소 고관절 대퇴골두 펠비스 프로스테이트 렉탈 pelvis prostate rectal hip',
    top: '52%', left: '50%', width: '28%', height: '10%',
    hotspot: { top: '52%', left: '50%' },
    img: '/mri_pelvis.png',
    mriImage: '/mri_pelvis.png'
  },
  {
    id: 'knee',
    label: 'EXTREMITY / MSK',
    name: 'EXTREMITY / MSK',
    koLabel: '사지 · 관절 (무릎·어깨·발목)',
    ko: '사지 · 관절 (무릎·어깨·발목)',
    title: 'EXTREMITY & MSK PROTOCOLS',
    searchKeywords: '무릎 어깨 발목 발 손목 팔꿈치 아킬레스건 종괴 사지 관절 봉와직염 knee shoulder ankle foot wrist elbow extremity mass cellulitis',
    top: '72%', left: '54%', width: '50%', height: '37%',
    hotspot: { top: '72%', left: '54%' },
    img: '/mri_knee.png',
    mriImage: '/mri_knee.png'
  }
];

export const initialProtocolsDB = {
  // ==========================================================================
  // 1. BRAIN / HEAD (뇌 · 두경부)
  // ==========================================================================
  brain: [
    {
      id: 'brain-basic',
      name: 'Brain 기본 통합 (Brain + MRA + Diffusion + Perfusion + CE)',
      tag: '핵심 기본',
      time: '20~30 Min',
      sequences: [
        'Survey (Scout)',
        'T2 Axial',
        'T1 Axial',
        'T2 FLAIR Axial',
        'SWI / SWIp (출혈, 철분침착 평가)',
        'T1 Sagittal',
        'T2 Coronal',
        '[처방 조합 시] Diffusion / MRA (3D TOF) / Perfusion / T1 SE CE (종양·BB 필수)'
      ],
      easyGuide: [
        'Brain 8대 처방 조합: ① Brain ② Brain+CE ③ Brain+MRA ④ Brain+MRA+CE ⑤ Brain+Diffusion ⑥ Brain+Diffusion+CE ⑦ Brain+MRA+Diffusion ⑧ Brain+MRA+Diffusion+CE',
        'Dynamic 조영제 주입 타이밍: Scan 1 → Scan 2 → Scan 1 → Scan 2 → [Scan 5 뜰 때] 조영제 투여!',
        'Infection(감염) 의심 시: MRA 추가 촬영',
        'MRA + Diffusion 처방인데 소견에 FLAIR 추가 나면: +FLAIR 추가 촬영',
        '3D Enhance만 MPR 재구성 영상을 만들고, Non-enhance(Brain + 3D T1 Ax 등)에서는 안 만든다.'
      ],
      pacsRule: [
        '[Perfusion PACS 전송] 1200장 작업 후 2, 3, 4, 5, 6번만 PACS로 넘기고, 소스는 ISP · JLKPMI · Dynapacs로 넘긴다.',
        '[ISP - Perfusion 작업] FFE EPI PWI(1200장) → Neuro Perfusion → 5개 센스 파란색으로 구멍 없이 작업(2,3번째는 안 건드려도 됨) → Generator',
        '[ISP - BRAIN TOF 작업] Volume → BRAIN TOF → MIP → vol,lend → mra2 → batch → 왼쪽 24장 → clear bath → 위로 24장 (Carotid는 왼쪽으로 24장만)',
        '[TOF MIP 만드는 법] MRA: SPIN 3번째→Radial range→MIP2 / ROLL 1번째→Radial range→MIP1 | NECK: SPIN 3번째→Radial range→MIP2 (필터링)',
        '[Skyra Diffusion 전송] SCOUR SAG, ADC, MAG, PHA, SWI, B0, B1000 → JLK로도 전송! (단, thin section 소견 시 Ax 3mm stem 부위 B1000만 만들어 "3mm B-1000"으로 PACS만 넘기고 JLK는 제외)'
      ],
      updates2026: [
        '🚨 [NS Perfusion 지침] 신경외과(NS)에서 처방 나는 Perfusion 검사는 무조건 ASL을 추가 검사하고 영상 전체를 ISP로 전송해주세요.',
        '🚨 [응급실(ER) Diffusion → MRA 추가] 검사 중 추가는 기존처럼 처방변경 진행 / 응급실 복귀 후 추가는 Diffusion을 50% 처방으로 변경 후 매칭 MRA 처방을 다시 받아 나눠서 매칭 (응급실 처방변경: ☎️ 1576)'
      ],
      notes: 'Brain + CE + MRA + Diffusion + Perfusion 표준 프로토콜 및 ISP/JLK 후처리 가이드'
    },
    {
      id: 'brain-3d-professors',
      name: 'Brain 3D & 교수님별 CE (전치만·홍용길·송준호) & NeuroQuant',
      tag: '최신개정·필수',
      time: '20~25 Min',
      sequences: [
        '[기본 Brain 3D] 촬영 후 MPR 재구성 (Coronal 1mm / Sagittal 1mm)',
        '[전치만 교수님 3D T2, 3D T1 CE] 0.8mm 스캔 → SAG, COR, AX 모두 1mm로 Recon',
        '[홍용길 교수님 / Brain + CE (Meta2)] BB (Black Blood) + SPACE',
        '[송준호 교수님 / Brain + CE] Philips: eTHRIVE (T1 SE CE 삭제) / Skyra: T1 VIBE FS AX CE (Cor→Sag 1mm, Sag→Cor 1mm)',
        '[Brain + MRA + Diffusion + 3D T1 Sagittal] NeuroQuant 진입 (Enhance 제외)',
        '[Brain + MRA + Diffusion + 3D T1 Axial] Neurodegenerative Dz (신경퇴행성 질환) 진입'
      ],
      easyGuide: [
        '전치만 교수님 3D: 3개 방향 모두 Recon 해야 하므로 SAG 영상을 충분히 넓게 스캔할 것 (타이트하면 Recon 시 잘림 주의!)',
        '홍용길 교수님 (NS): MO, MP, BE 환자의 전이암(특히 NSCLC 비소세포폐암)은 무조건 Meta2 (BB + SPACE) 처방으로 진행',
        '송준호 교수님 (NS): 일반 Brain + CE 시 eTHRIVE(필립스) / T1 VIBE FS AX CE(Skyra) 적용. 소견에 ORBIT FAT SUPPRESSION 있으면 T1 FS AX CE로 검사',
        'NeuroQuant: 소견에 있으면 NeuroQuant 프로토콜 안의 Nigrosome View 추가 촬영'
      ],
      pacsRule: [
        '[전치만 교수님 3D] 0.8mm 소스 영상을 Dynapex로 넘기고, PACS Verify 순서는 반드시 [SAG → COR → AX] 순서로 맞출 것!',
        '[Brain 3D CE 전송] Brain 3D CE 영상(BB, eTHRIVE, VIBE)은 Dynapex로 전송',
        '[NeuroQuant 전송] 소스는 NeuroQuant로 따로 전송 (Skyra: T1 MPRAGE SAG)'
      ],
      updates2026: [
        '🆕 [2026.09 전치만 교수님 3D 개정] 0.8mm 스캔 후 SAG/COR/AX 1mm Recon 방식으로 새로 저장됨. Dynapex 전송 + Verify 순서(SAG-COR-AX) 필수!'
      ],
      notes: '교수님별 지정 Brain 3D / CE 시퀀스 및 Dynapex 전송 규칙'
    },
    {
      id: 'brain-aortic-hearing',
      name: 'Brain + Aortic + Diffusion + CE (Hearing Loss / Vista View)',
      tag: '청력저하·특수',
      time: '30 Min',
      sequences: [
        'AAM Scout / Vessel Scout COR / Vessel Scout SAG',
        'T1 Ax / Diffusion / T2 Ax / T2 FLAIR Ax / T2 COR / SWI / Head TOF / T1 SAG',
        'T2 SPC 3D Ax (소견에 Vista view 추가 시 — Temporal 프로토콜에 있음)',
        'Angio 3D PRE',
        'Contrast (Gadolinium 15 mL)',
        'Cerebolus – CON (Angio 3D PRE 따라가기)',
        'Angio 3D POST → Spin image 만들기 (angio_3d post_SUB로)',
        'T1 VIBE FS Ax CE / T2 FLAIR Ax CE'
      ],
      easyGuide: [
        '증상: Hearing loss(청력 소실) 및 소견에 Vista view 추가 시 시행 (조영제 Gadolinium 15 mL)',
        'Vista View: 필립스는 3D T2 Vista 추가, Skyra에서는 T2 SPC 3D AX 추가',
        'Angio 3D POST 획득 후 Subtraction(angio_3d post_SUB)으로 Spin image 생성'
      ],
      pacsRule: [
        '전 시퀀스 및 Angio 3D POST Subtraction Spin 이미지 PACS 전송'
      ],
      updates2026: [],
      notes: '청각 소실 환자용 Brain + Aortic 혈관 조영 프로토콜'
    },
    {
      id: 'sella-protocol',
      name: 'Sella + CE (뇌하수체 Dynamic)',
      tag: '두경부·Dynamic',
      time: '15~20 Min',
      sequences: [
        'AC-PC 라인 맞추기 (Center는 Sella, 앞·뒤통수 다 나오게)',
        '[소아 환자 필수] 조영제 넣기 전에 T2 Full Axial 선행 촬영!',
        '조영 시작과 동시에 Auto Injection (Dynamic Trigger) 적용',
        'Dynamic 스캔 (Oversampling 설정: Phase 15 / AP 0)'
      ],
      easyGuide: [
        '★ Dynamic 대원칙: 모든 Dynamic 촬영은 Slice 개수를 건드리지 말고 무조건 Thickness(두께)로만 범위를 조정한다!',
        'Over Suppression 방지: Oversampling 적용 (Phase → 15, AP → 0)',
        '소아 안전 원칙: 소아는 조영제 주입 전 T2 Full Axial을 반드시 먼저 찍는다.'
      ],
      pacsRule: [
        '기본 시퀀스 및 Dynamic 시리즈 전송'
      ],
      updates2026: [],
      notes: 'AC-PC 라인 정렬, 센터 Sella, Dynamic은 무조건 두께(Thickness)로 조정'
    },
    {
      id: 'orbit-temporal-pns-tmj',
      name: 'Orbit / Temporal (IAC) / PNS / TM Joint (측두하악관절)',
      tag: '신규처방·두경부',
      time: '15~25 Min',
      sequences: [
        '[ORBIT + CE] COR: 양쪽 Orbit 여유롭게 포함 ~ Sella까지',
        '[TEMPORAL (+ CE)] Full은 Brain plane과 동일. Mass/Lesion 있으면 Diffusion 추가, Vista view 소견 시 3D T2 Vista(Skyra: T2 SPC 3D Ax) 추가',
        '[Temporal 신규처방 HI501A8R / HI501A9R] 기존 Temporal + 3D T1 AX 필수 추가 스캔!',
        '[PNS + CE] Scout → T2 COR → T1 COR → T2 DIXON AX → T1 AX → DWI → T1 SPIR COR/AX/SAG CE',
        '[TM Joint] 센터 인중 → Closed mouth(Sag+Cor 모두) → Open mouth(마지막에 Sag만 촬영)'
      ],
      easyGuide: [
        'Orbit 안내: "눈알 움직이지 말고, 눈 감고 깜박이지 마세요" 안내 필수! (NU에서 Orbit 추가 처방 시: Achieva는 T1 FS Ax CE / Skyra는 HEAD NEW에 T1 TSE AX DFS GD 추가. EYE 처방 시 기존 COR 지우고 head(head new X)→orbit→T2 DFS로 대체)',
        'TM Joint 안내: 센터는 인중, 검사 중 "침 삼키지 마세요" 안내 필수! Sagittal은 오른쪽부터 시작하며 라인 번호를 잘 봐야 함.'
      ],
      pacsRule: [
        '각 부위별 표준 시퀀스 전송 (신규 코드 HI501A8R / HI501A9R 처방 시 3D T1 AX 포함 필수)'
      ],
      updates2026: [
        '🆕 [2026.10 Temporal 신규 처방 2종] HI501A8R (MRI IAC segment + 3D T1 Ax) / HI501A9R (MRI Temporal/IAC + CE + 3D T1 Ax) 처방 시 꼭 3D T1 AX를 추가 검사해주세요!'
      ],
      refImage: '/refs/temporal_new_orders.jpg',
      notes: '안와, 내이도(신규 3D T1 코드), 부비동, 턱관절 통합 프로토콜'
    },
    {
      id: 'brain-dti-fmri',
      name: 'Brain DTI (확산텐서) & Brain Functional (fMRI)',
      tag: '기능·외장하드',
      time: '20~25 Min',
      sequences: [
        '① Scout (64 channel head coil)',
        '② 3D T1 Ax (AC-PC line 기준 정렬)',
        '③ 32 DIR b-1000',
        '↳ ④ 32 b-0',
        '↳ ⑤ 32 b-1000',
        '↳ ⑥ ADC',
        '[RM DTI 소견 시] T2 AX 추가 스캔',
        '[Brain Functional (fMRI)] ep2d_로 시작하는 영상 총 4개 + 3D 영상'
      ],
      easyGuide: [
        '외장하드 DICOM 내보내기(Export) 방법: 윈도우 버튼 → This PC → 외장하드 DTI 폴더 → 새로만들기(이름/아이디) → 1) 3D 폴더 2) DTI 폴더 생성',
        '3D 영상 내보내기: [F4] → 3D T1 AX → 디스크파일 → 브라우저 → Desktop → 외장하드 → 3D 폴더',
        'DTI 영상 내보내기: [F4] → 2Reg_32 DTI_b-1000 → 디스크파일 → 브라우저 → Desktop → 외장하드 → DTI 폴더'
      ],
      pacsRule: [
        '[PACS 전송] ①②③④⑤⑥ 모두 PACS로 넘기기',
        '[NS DTI] 신경외과(NS) DTI 검사는 ISP로 꼭 넘겨주세요!',
        '[RM DTI] 재활의학과(RM) DTI 검사 시 T2 AX 추가 소견 있으면 추가 검사 후 외장하드에 같이 넣어주세요!',
        '[Brain Functional] ep2d_로 시작하는 영상 총 4개 + 3D 영상을 "Brain ex"로 넘겨주세요!'
      ],
      updates2026: [
        '🚨 [DTI / fMRI 전송 체크] NS DTI → ISP 필수 전송 / RM DTI(T2 AX 소견) → 외장하드 동시 저장 / fMRI(ep2d_ 4개 + 3D) → Brain ex 전송'
      ],
      notes: '64채널 코일 사용, PACS 1~6번 전송 및 ISP/외장하드/Brain ex 전송 규칙'
    },
    {
      id: 'brain-special-tle-parkinson-vessel',
      name: '특수 뇌 (Seizure/TLE · Nigrosome · HFS · Vessel Wall)',
      tag: '질환별 특화',
      time: '20~30 Min',
      sequences: [
        '[Seizure / Epilepsy / TLE] T2 TSE Coronal 지우고 → T2 OBL Coronal + FLAIR OBL Coronal 추가',
        '[Nigrosome View (파킨슨병)] Sag, Cor 먼저 스캔 후 PC ~ Pons 끝 라인 기준 Oblique Coronal Sagittal 플랜',
        '[HFS (편측안면신경)] HFS 전용 프로토콜 사용 (+ 소견 나면 NS TOF Vertex 추가)',
        '[Vessel Wall 처방] Brain Tumor Research (KES) 폴더 하위 프로토콜로 검사'
      ],
      easyGuide: [
        'TLE (뇌전증): Slice plane을 Hippocampus(해마)의 long axis에 수직이 되게 세팅! Voxel에서 Cor에서 Sag로 바뀌지 않게 주의.',
        'Nigrosome View: 정상은 Swallow-tail(제비꼬리) 모양 관찰 가능 (파킨슨병 초기 진단).',
        'Angio 처방 구분: (Brain 3D Angio)=MRA만 / (Brain + 3D Angio)=BRAIN+MRA / (Brain MRA + NECK MRA)=TOF만(3D X)'
      ],
      pacsRule: [
        '각 질환별 특화 시퀀스 전송'
      ],
      updates2026: [
        '🆕 [2026.10 Vessel Wall 처방] Vessel wall 처방이 나면 콘솔의 Brain Tumor Research (KES) 프로토콜로 검사해주세요.'
      ],
      refImage: '/refs/vessel_wall_protocol.jpg',
      notes: '뇌전증(해마 수직), 파킨슨(Swallow-tail), 안면경련, 혈관벽 MRI'
    }
  ],

  // ==========================================================================
  // 2. SPINE / NECK (척추 · 경부)
  // ==========================================================================
  'c-spine': [
    {
      id: 'spine-ctl-3d-ce',
      name: 'L-Spine & C-T-L Spine (+ 3D + CE) & 금속(O-MAR / SEMAC)',
      tag: '척추 표준·개정',
      time: '25~35 Min',
      sequences: [
        'Scout (C-T-L): ① C-T-L Scout ② C-T-L Scout ③ C-T-L Scout → MobiView',
        'L-T2 SPACE COR (처방이 3D일 때만 검사 → Femur head 포함 필수 & SAG MPR 작업)',
        'L-T2 DIXON SAG (부족하면 장수 늘려 T10 중간 ~ S1 포함되게)',
        'L-T1 SAG',
        'L-T2 AX',
        'L-T1 AX (TR값 1000 안 넘기게! 줄이려면 Base resolution 다운)',
        'C-T T2 DIXON SAG',
        'CONTRAST (HAND inject 2~3분 후 스캔 — Contrast는 W만 넘긴다)',
        '[Metal 부위 추가] C, T, L Spine 검사 시 Metal 부위만 T2 AX 추가 검사 (O-MAR 프로토콜 저장됨)'
      ],
      easyGuide: [
        'T-SPINE 범위: C6 절반부터 ~ L1까지 포함',
        'C0 포함 소견 시: AX 3개 복사(T2mFFE AX, AX T2, AX T1), 붙여넣기 후 C0 따로 C-SPINE 따로 지오네임 다르게 표기 (지멘스는 C-SPINE 프로토콜 안에 C1~C0 3개 추가)',
        '금속(Metal) 프로토콜: 필립스 O-MAR는 SAG T1 빼고 O-MAR 2개 추가 + AX 메탈 위주 / 지멘스 SEMAC은 SEMAC SAG, STIR SEMAC SAG 추가',
        '필립스 신호 죽어서 나올 때: SHIM → PB volume으로 변경, TR 1000 안 넘기게 설정',
        '지멘스 T2 SCOUT: Overlap 60 이상 되게 설정, 세츄레이션 밴드는 2개',
        '수동 Composing 방법: Application → Patient → Save as all (매뉴얼 → Normalize)'
      ],
      pacsRule: [
        '[L-Spine PACS 전송] T2 SPACE COR(3D) + MPR SAG → T2 DIXON SAG 4개(Opp/In/Fat/Water) → T1 SAG → T2 AX → T1 AX → C-T T2 DIXON SAG Composing 4개(Opp/In/Fat/Water) → (Diffusion 있으면 ADC, b0/500/800) ※ W, F 바뀌는지 항상 확인!',
        '[C-T-L Contrast 전송] 조영(CONTRAST) 영상은 W(Water)만 넘긴다.'
      ],
      updates2026: [
        '🚨 [고성혜 교수님 전달 — C-Spine 검사 시 T-L T2 Scout 마킹] C-Spine 검사 시 T-L T2 Scout 이미지에 마킹을 해주세요! T1이 보이는 경우는 T1에 마킹하고, 키가 커서 T1 이후로 스캔한 경우 첫 번째 이미지에 마킹합니다. 마킹은 "T2 Scout W" 하나에만 넣어주세요!',
        '🚨 [Metal 부위 추가 검사] C, T, L spine 검사 시 Metal 부위만 T2 AX를 추가로 검사해주세요 (O-MAR 프로토콜에 저장 완료).'
      ],
      notes: 'Femur head 포함(3D), T-L Scout W 마킹 규칙, O-MAR/SEMAC 금속 프로토콜'
    },
    {
      id: 'neck-ce-ps',
      name: 'Neck + CE & 성형외과(PS) Neck Non-CE 프로토콜',
      tag: '경부·과별지침',
      time: '20 Min',
      sequences: [
        '[Neck + CE] MASS 위주로 검사 (소견, 전영상 참고)',
        'CE는 eTHRIVE만 해주고 3D 만들어준다 (조영제는 HAND INJECT)',
        '[PS(성형외과) 처방 NECK NON-CE] Neck 쪽만 T2 DIXON AX + T1 AX 추가 검사!'
      ],
      easyGuide: [
        'Mass 의심 시 적용하며, CE는 손 주사기(Hand inject)로 주입 후 eTHRIVE만 촬영하여 3D 재구성을 필수 생성한다.',
        '환자 체위 안내: 허리 위 검사 → Head First / 허리 아래 검사 → Feet First'
      ],
      pacsRule: [
        '기본 시퀀스 + eTHRIVE 3D 재구성 전송 (PS Non-CE 처방 시 T2 Dixon Ax, T1 Ax 포함)'
      ],
      updates2026: [
        '🚨 [PS 성형외과 Neck Non-CE] PS에서 내는 처방 NECK NON-CE 검사 시 Neck 쪽만 T2 AX(T2 Dixon으로 검사), T1 AX를 추가로 검사해주세요!'
      ],
      notes: 'Mass 위주 검사, CE는 Hand Inject & eTHRIVE 3D, PS 처방 시 T2 Dixon Ax/T1 Ax 추가'
    },
    {
      id: 'spine-dti',
      name: 'MRI (DTI) - SPINE (경추 확산텐서)',
      tag: '특수',
      time: '15~20 Min',
      sequences: [
        'AAH SCOUT (BRAIN 처럼)',
        'C3 BODY ~ C7 BODY 범위 설정 (밑에 프로토콜은 다 따라가기)',
        'SAG = BRAIN 같이 (brain ep2d → full cover)',
        'with MT / without MT'
      ],
      easyGuide: [
        'C3 Body부터 C7 Body까지 포함하여 플랜하며 아래 시퀀스는 모두 따라가기로 진행한다.'
      ],
      pacsRule: [
        '[PACS 넘길 때] Scout → Space SAG → with MT → without MT'
      ],
      updates2026: [],
      notes: 'C3~C7 Body 포함, Scout / Space SAG / with MT / without MT 전송'
    }
  ],

  // ==========================================================================
  // 3. CHEST / HEART / BREAST (심장 · 유방 · 상완신경총)
  // ==========================================================================
  chest: [
    {
      id: 'heart-cardiac',
      name: '심장 MRI (Cardiac) 표준 프로토콜 및 상세 파라미터 표',
      tag: '심장·파라미터표',
      time: '45~50 Min',
      sequences: [
        'localizer (table line 맞춰주기) → localizer@isocenter (physio → captured cycle 클릭)',
        'DefineLongaxis (FOV 500, Thick 8, Slice 1 — marker 위치 확인)',
        'DefineSAX (shortaxis all: FOV 250~280, Thick 6, Gap 4mm(67%), Slice 12~13 — Body Coil 꺼지는지 반드시 확인!)',
        'T2 FS SAX (FOV 250, Thick 6, Gap 67%, Slice 10)',
        'T1Map_pre / T2Map_FLASH (FOV 300, Thick 6, Gap 200%, Slice 3)',
        'DynamicRest (FOV 250, Thick 8, Gap 200%, Slice 3 — 테스트 스캔 후 아티팩트 확인, 조영제 설명 후 스타트)',
        'CINE_4ch (조영제 주입 직후 검사!) / CINE_2ch / 3ch / CINE_SAX',
        'TI-Scout 15M (조영 후 15분 대기 필수! physio → captured cycle / not set 클릭)',
        'DE_4ch ( 기본 TI, 3장 고정) → DE_2ch (기존 TI+20, 3장 고정) → DE_SAX (기존 TI+40, 12장)',
        'T1Map_post (FOV 300, Thick 6, Gap 200%, Slice 3 — T1Map_pre 센터 추종)'
      ],
      easyGuide: [
        '1. 키, 몸무게 정확히 입력 필수: 결과 리포트에 직접 영향을 미치므로 반드시 정확한 수치 기입!',
        '2. 조영제: gado15 권장, 주입속도 3 mL/sec 설정',
        '3. SAR Limit 관리: FA(Flip Angle) 변경 시 10 내외일 때만 변경하며, 20~30 변경 시 대조도가 변하므로 RF mode로 변경 필요',
        '4. 체격 큰 환자: FOV 280까지 유연하게 확대, 아티팩트 방지를 위해 Oversampling 70% 적극 활용 (Body Coil 꺼짐 필수 확인)',
        '5. DE(지연조영) Slice 고정: DE_4ch 및 DE_2ch는 Slice를 3장으로 고정하며 임의로 늘리지 않도록 주의!'
      ],
      pacsRule: [
        'DE_4ch 등 지연조영 시 MAG + PSIR 모두 전송, 전 시리즈 PACS 전송'
      ],
      tableData: [
        { seq: 'localizer', fov: '-', thick: '-', gap: '-', slices: '-', note: 'table line 맞춰주기' },
        { seq: 'localizer@isocenter', fov: '-', thick: '-', gap: '-', slices: '-', note: 'physio -> captured cycle 클릭' },
        { seq: 'DefineLongaxis', fov: '500', thick: '8', gap: '-', slices: '1', note: 'marker 위치 확인' },
        { seq: 'DefineSAX (shortaxis all)', fov: '250 (큰체격 280)', thick: '6', gap: '4mm (67%)', slices: '12~13', note: 'oversampling 70% 적용. Body Coil 꺼지는지 반드시 확인!' },
        { seq: '(shortaxis subset)', fov: '-', thick: '8', gap: '200%', slices: '3', note: '-' },
        { seq: 'T2 FS SAX', fov: '250', thick: '6', gap: '67%', slices: '10', note: '-' },
        { seq: 'T1Map_pre', fov: '300', thick: '6', gap: '200%', slices: '3', note: 'DefineSAX 영상 띄우고 copy image position 적용 (LV 제일 넓은 곳)' },
        { seq: 'T2Map_FLASH', fov: '300', thick: '6', gap: '200%', slices: '3', note: '-' },
        { seq: 'DynamicRest', fov: '250', thick: '8', gap: '200%', slices: '3', note: '테스트 스캔 후 아티팩트 확인. 조영제 주입 설명 후 스타트' },
        { seq: 'CINE_4ch', fov: '250', thick: '-', gap: '-', slices: '1', note: '조영제 주입 직후 검사. oversampling 70%. 아티팩트 시 trufi delta freq 변경' },
        { seq: 'CINE_2ch / 3ch', fov: '250', thick: '6', gap: '-', slices: '1', note: 'Left two chamber / LVOT' },
        { seq: 'CINE_SAX', fov: '250', thick: '6', gap: '67%', slices: '12', note: 'concatenations 변경 확인 (숨 참는 시간 관련)' },
        { seq: 'TI-Scout 15M', fov: '-', thick: '-', gap: '-', slices: '-', note: 'captured cycle 클릭 (physio -> captured cycle / not set). 15분 대기 필수' },
        { seq: 'DE_4ch', fov: '250', thick: '6', gap: '-', slices: '3 (고정)', note: 'CINE_4ch 센터 추종. TI값 입력 필수. MAG+PSIR 넘김. slice 3장 고정' },
        { seq: 'DE_2ch', fov: '250', thick: '6', gap: '-', slices: '3 (고정)', note: 'CINE_2ch 센터 추종. 기존 TI값 + 20 적용. slice 3장 고정' },
        { seq: 'DE_SAX', fov: '250', thick: '6', gap: '67%', slices: '12', note: '기존 TI값 + 40 적용. concatenations 확인' },
        { seq: 'T1Map_post', fov: '300', thick: '6', gap: '200%', slices: '3', note: 'T1Map_pre 센터 추종' }
      ],
      updates2026: [],
      notes: '키/몸무게 필수 입력, gado15(3ml/s), 15분 대기 후 TI-Scout, DE TI값(+20/+40) 규칙'
    },
    {
      id: 'breast-mri',
      name: 'Breast MRI + CE + DWI (유방 Dynamic & BECAD)',
      tag: '유방·BECAD',
      time: '30 Min',
      sequences: [
        'Localizer (BH)',
        'T2 AX (Dixon In / W)',
        'T2 SAG LT / T2 SAG RT',
        'DWI (b0, b900) - AX 따라가기 (처방 있을 때만 검사)',
        'Contrast (Gado 2 mL/sec Auto injector — 1/7 끝나면 바로 조영제 주입!)',
        'T1 SPAIR Ax 7Dynamic',
        'T1 DFS AXIALLY'
      ],
      easyGuide: [
        '조영 시작 타이밍: 방송 - 1분 10초 정도 Pre scan 완료 후 바로 조영제 주입 (즉, 1/7 끝나면 바로 조영제 주입!)',
        'DYN (NAME: 1Dyn - 6Dyn) 만들기: 1Dyn 소스 / 6Dyn 소스 → Evaluation → Dynamic Analysis → Subtraction → Exchange → Description에 1Dyn ~ 6Dyn',
        'MIP Volume 만들기: 1st Dynamic Subtraction 기반 — Roll) 1번 이미지: BREAST 3 / Spin) 3번 이미지: BREAST 4 (※ 1번방 필립스 장비는 1st Dynamic 소스로 만든다)'
      ],
      pacsRule: [
        '[Breast PACS 전송] Scout → T2 DIXON AX-IN → T2 DIXON AX-W → T2 SAG LT-W → T2 SAG RT-W → DWI(ADC 포함) → DYN Pre → 1Dyn 소스 + 1Dyn Sub(1dyn-pre) + MIP 3개 → 2Dyn 소스 + 6Dyn Sub(2dyn-pre) → 6Dyn 소스 + 6Dyn Sub(6dyn-pre) → 1Dyn~6Dyn → B0, B900 → DYN(AXIALLY)_W → Spin → Roll',
        '[Breast BECAD 전송] Dyn 소스: PRE / 1 / 2 / 3 / 4 / 5 / 6 | dwi 소스: DWI b0-900_tracew'
      ],
      updates2026: [],
      notes: '1/7 끝나면 조영제 주입, 1~6Dyn Subtraction 및 MIP(Roll/Spin), BECAD 전송'
    },
    {
      id: 'brachial-plexus',
      name: 'Extremity Upper : CE (Brachial Plexus Injury, 상완신경총)',
      tag: '신경총·3번방',
      time: '25~30 Min',
      sequences: [
        'SAG 3D T2 → Volume에서 COR, AX 재구성',
        '3D STIR COR (위에 영상 나오면)',
        'T1 TSE COR (Angle 조정, spine center 처럼 맞추기)',
        'DIXON T2 AX (Angle 조정, C0 포함, COR 영상 보고 신경 나가는 것까지 포함)',
        'DIXON T2 RT / LT (Angle X, spine 쪽에서 신경 나가는 것까지 포함)',
        'DIXON T1 AX (조영제 Gado Hand inject 후 timer 3~5분 후 start scan)',
        'DIXON T1 COR',
        '3D STIR COR'
      ],
      easyGuide: [
        '소견: Brachial plexus injury R/O, HIVD post-traumatic (R) — Spine 프로토콜에 있으며 3번 방에서 시행!',
        '조영제 라인 주의: 조영 주입 부위는 반드시 검사 부위 반대쪽 팔 사용 (= Breast도 동일)'
      ],
      pacsRule: [
        'SAG 3D T2 (원본 + COR/AX 재구성) 및 전 시퀀스 전송'
      ],
      updates2026: [],
      notes: '3번방 Spine 프로토콜 내 위치, 반대쪽 팔 조영제 Hand inject 후 3~5분 뒤 스캔'
    }
  ],

  // ==========================================================================
  // 4. ABDOMEN (복부 · 간 · 담췌관 · 신장 · 소장)
  // ==========================================================================
  abdomen: [
    {
      id: 'liver-primovist',
      name: 'Liver MRI (Primovist + CE)',
      tag: '간·ISP/Tera필수',
      time: '30~35 Min',
      sequences: [
        'SCOUT (손 내리고 검사)',
        '1) T2 HASTE COR / 2) T2 HASTE AX',
        '   T1 VIBE OPP In AX / T1 VIBE E-DIXON AX',
        '5) T1 VIBE Q-DIXON AX - AX 따라가기 (S6 정도에 찍어라)',
        '6) HISTO (무조건 AX 영상이 나와야 한다!)',
        '   (※ MRCP 있는 경우 MRCP ROLL PROTOCOL 추가)',
        '3) T1 VIBE FS AX PRE - AX 따라가기 (prepare injector)',
        '4) Care Bolus - LEFT VENTRICLE에 찍고 AXIAL 이미지 잘 보기 (Primovist + Saline 1 mL/sec)',
        '   T1 VIBE FS AX Arterial / Portal Venous / COR 50s / AX 3 Min Delay / AX 10 Min Delay',
        '7) T2 FAST BLADE FS AX - AX 따라가기 (LIVER DOME에 잘 찍기)',
        '   DWI b50 / b400 / b800 & AX_TSE FS',
        '   T1 VIBE FS AX 20 Min Delay / T1 VIBE FS COR 20 Min Delay'
      ],
      easyGuide: [
        '조영제: Primovist + Saline, 주입속도 1 mL/sec (손 내리고 검사)',
        'Q-DIXON은 간 S6 레벨 정도에 촬영하며, HISTO는 무조건 Axial 영상이 나와야 함',
        '10분 지연과 20분 지연 영상 사이에 T2 FAST BLADE FS AX(Liver Dome 포함), DWI, AX_TSE FS를 찍는다.'
      ],
      pacsRule: [
        '[LIVER PACS 전송] Scout → T2 COR → T2 AX → T1 VIBE...bh → T1 q-DIXON FF → T1 VIBE PRE → T1 AX ARTERY REG → T1 AX ARTERY SUB → T1 AX Venous → T1 COR 50S → T1 3M delay → T1 5M delay → T2 FAST BLADE FS AX → T2 long TE BH → T1 AX 20M delay → T1 COR 20M delay → DWI b50, 400, 800 + ADC → REPORT(HISTO, Q-DIXON)',
        '🚨 [외부 서버 필수] Liver 검사 영상은 ISP, TeraRecon으로 전체 꼭 넘겨주세요!!'
      ],
      updates2026: [
        '🚨 [이기현 선생님 공지] *Liver 검사 영상 ISP, TeraRecon으로 전체 꼭 넘겨주세요!! (테라 추가 완료)'
      ],
      notes: 'Primovist 1mL/s, 20분 지연 영상 포함, ISP & TeraRecon 전체 필수 전송'
    },
    {
      id: 'abdomen-ce-mrcp',
      name: 'Abdomen + CE + MRCP (복부·담도 조영)',
      tag: '복부 표준',
      time: '30 Min',
      sequences: [
        'SCOUT (손 내리고 검사)',
        'T2 HASTE COR / T2 HASTE AX',
        'T1 VIBE OPP In AX / T2 LONG TE AX / T1 VIBE E-DIXON AX',
        'T1 VIBE Q-DIXON AX - AX 따라가기 (S6 정도에 찍어라)',
        'HISTO (무조건 AX 영상이 나와야 한다)',
        '(MRCP 있는 경우 MRCP ROLL PROTOCOL 추가)',
        '3D MRCP-PACS ZOOMIT_SAT',
        'T1 VIBE FS AX PRE - AX 따라가기 (prepare injector)',
        'Care Bolus - LEFT VENTRICLE에 찍고 AXIAL 이미지 잘 보기 (Gado + Saline 2 mL/sec)',
        'T1 VIBE FS AX Arterial / Portal Venous / COR 50s / AX 3 Min Delay / AX 10 Min Delay',
        'MRCP RADIAL-ROLL',
        'DWI b50 / b400(100) / b800'
      ],
      easyGuide: [
        '조영제: Gadolinium + Saline, 주입속도 2 mL/sec (Primovist 1 mL/sec와 구분!)',
        '3D MRCP ZOOMIT_SAT 및 MRCP RADIAL-ROLL 포함'
      ],
      pacsRule: [
        '[ABDOMEN PACS 전송] Scout → T2 COR → T2 AX → T1 VIBE AX..bh → T2 LONG HASTE bh → T1 q-DIXON FF → 3D MRCP_SAT → T1 VIBE PRE → T1 AX ARTERY REG → T1 AX ARTERY SUB → T1 AX Venous → T1 COR 50S → T1 3M delay 첫번째 → T1 5M delay 첫번째 → MRCP_ROLL → DWI b0, 100, 800 + ADC → REPORT(HISTO, Q-DIXON)'
      ],
      updates2026: [],
      notes: 'Gado 2mL/s, 3D MRCP_SAT 및 MRCP_ROLL, HISTO/Q-DIXON 리포트 전송'
    },
    {
      id: 'pancreas-mrcp-only',
      name: 'Pancreas MRI & MRCP Only (+ RF Power 에러 해결법)',
      tag: '담췌관·에러대처',
      time: '15~20 Min',
      sequences: [
        '[Pancreas 시퀀스] Survey → Coronal → Axial → Axial Heavily (T2 heavy) → Dixon → DWI (※ Angle 들어가는 검사는 X)',
        '[MRCP Only] 끝에 프로토콜 3개 지우고 시작, Resp: 호흡(Respiratory trigger) 모드 사용',
        'COR: Heart 포함되게 설정',
        'Axial: Slim box 윗 라인은 횡경막 정도에(air 없는 게 좋음) → 간–담낭–췌관 전체 포함',
        'OBL: COR Accept 후 이미지 보고 Liver 안 잘리게, GB, Pancreas tail(췌미부)까지 포함',
        '3D GRASE: 최대한 Angle 안 주는 게 좋음 → 한꺼번에 wide angle 확보 (GB, pancreas tail 모두 포함)'
      ],
      easyGuide: [
        '호흡 조절 팁: 호흡 컨트롤이 어려운 환자이면 Thickness(두께)를 조정하여 스캔 시간을 맞춘다.',
        'Air Artifact 방지: Axial Slim box를 횡경막 근처 공기가 없는 곳에 맞춰 아티팩트 최소화.'
      ],
      pacsRule: [
        'Survey, COR, AX, Heavily T2, OBL, 3D GRASE 및 MIP 전송'
      ],
      updates2026: [
        '⚡ [MRCP Burst RF Power 에러 해결법] 1순위(시간 변동 없음): System → B1 Shim mode → TrueForm에서 "Volume-selective"로 변경 우선! / 2순위(시간 변동 있음): Sequence → Gradient mode → "Normal"로 변경 (안 될 시 "Whisper"로 변경)'
      ],
      notes: 'Angle 금지, 호흡 트리거 사용, Burst RF Power 에러 시 Volume-selective 변경'
    },
    {
      id: 'kidney-adrenal',
      name: 'Kidney & Adrenal MRI + CE (신장·부신)',
      tag: '신장·부신',
      time: '20~25 Min',
      sequences: [
        'Scout / T2 COR (손 내리고 검사)',
        'AX BH (3mm) - 아래 시퀀스 따라가기',
        'T1 VIBE _bh_AX - 범위가 좁아서 먼저 PLAN!',
        'T2 HASTE AX / T2 long TE AX',
        'SAG RT or LT (좌/우 선택) - 마킹 넣기(예: T2 HASTE RT SAG) [Aorta에서 Renal artery 나오는 거 다 포함되게!]',
        'T1 DIXON COR PRE - 첫번째 T2 COR 따라가기',
        'CONTRAST (Gado 2 mL/sec) & CARE BOLUS - 첫번째 T2 COR 따라가기 (DESCENDING AORTA 범위)',
        'T1 VIBE DIXON COR IMME W / 1min W / 3min W / 5min W',
        'DWI (b0, b400, b800)'
      ],
      easyGuide: [
        'T1 VIBE_bh_AX는 범위가 좁으므로 먼저 Plan을 잡아준다.',
        'SAG 촬영 시 좌/우 마킹 필수 기입, Aorta에서 Renal artery 나오는 부위가 모두 포함되도록 설정.'
      ],
      pacsRule: [
        '[Kidney PACS 전송] Scout → T2 COR → AX BH 3mm → T1 VIBE → T2 HASTE → T2 long → SAG Rt or Lt → T1 DIXON PRE W → T1 IMME W → T1 COR 3min W → T1 COR 5min W → T1 VIBE AX → ADC → DWI (b0, b400, b800)'
      ],
      updates2026: [],
      notes: 'Gado 2mL/s, 손 내리고 검사, Renal artery 분지 포함, 좌/우 마킹 필수'
    },
    {
      id: 'enterography',
      name: 'Enterography (소장 MRI) 프로토콜 및 음수·부스코판 지침',
      tag: '소장·전처치필수',
      time: '30~35 Min',
      sequences: [
        'Scout → Bowel check (stomach 살짝 걸치고 bladder 포함되게, angle 주고)',
        '💉 [1차 주사: 검사 시작 직전] Buscopan 0.5 amp',
        'T2 haste COR p3 mbh / T2 haste COR fs mbh',
        'truefisp COR bh → COR 따라가기 (위·아래 넓게, anal fistula 있으면 엉덩이까지)',
        'T2 haste fs tra mbh → Align pull down (꼬리쪽까지)',
        '💉 [2차 주사: DWI 스캔 전] Buscopan 0.5 amp',
        'ep2d diffusion COR b0, b800 (R-L) → COR 따라가기',
        '💉 [3차 주사: CE 조영 스캔 전] Buscopan 0.5 amp',
        'T1 vibe dixon COR bh pre → COR 따라가기 (prepare injector)',
        'Care bolus → COR 따라가기, 대퇴동맥 분지될 때 수동 start! (Gado 2 mL/sec)',
        'T1 VIBE dixon fs COR arterial / COR veno',
        'T1 VIBE fs Ax upper – Liver / Ax lower'
      ],
      easyGuide: [
        '1. 음수 프로토콜: 물 1리터에 레디프리(2포) 희석 → 검사 1시간 전부터 1시간 동안 지속 복용 → 다 마신 후 물 한 잔 추가 복용 → 복용 완료 15분 후 검사 시작!',
        '2. 부스코판(알피트) 총 1.5 amp 3회 분할 투여: ① 검사 시작 직전(0.5) → ② DWI 스캔 전(0.5) → ③ CE 스캔 전(0.5)',
        '3. Care bolus: 대퇴동맥(Femoral artery)이 분지될 때 수동 Start!'
      ],
      pacsRule: [
        '[Enterography PACS 넘기기] scout → Bowel check → T2 COR → T2 COR fs → T2 COR composition → T2 fs tra axial composition – DF → diffusion ADC – composition (소스가 밑에 나옴, 영상 b0, b800 만들어 넘김) → T1 dixon COR pre w → T1 dixon COR arterial w → T1 dixon COR veno w → T1 VIBE fs Ax upper – Liver → T1 VIBE fs Ax lower',
        '📌 [Combined 전송 원칙] PACS 전송 시 COR(관상면)과 AX(횡단면)은 개별 영상이 아닌 합친 영상(Combined/Composition)으로 구성하여 보낸다!'
      ],
      updates2026: [],
      notes: '레디프리 1L 음수(완료 15분 후 시작), 부스코판 0.5×3회 분할 투여, COR/AX Combined 전송'
    }
  ],

  // ==========================================================================
  // 5. PELVIS (골반 · 전립선 · 직장 · 고관절)
  // ==========================================================================
  pelvis: [
    {
      id: 'female-pelvis',
      name: 'Pelvis + CE (Female Pelvis, 여성 골반)',
      tag: '여성골반·Dynamic',
      time: '25~30 Min',
      sequences: [
        'Scout (Sagittal 상한 L5 정도까지, Axial은 pubic symphysis 포함)',
        'Kidney Scout (huge mass 이하로 지워주고 Couple 풀어서 따로 플랜)',
        'SAG / Axial 2 set / COR (Sag acception 후 같은 높낮이로 Cor 진행)',
        '14번 T1 3D AX → kidney plane',
        'DWI AX - AX 따라가기 (Dixon axial도 그대로 따라가야 함)',
        'T1 3D enhance PRE → SAG 따라가기',
        '조영제 Gado (Auto inject) → Immediately / 1min / 3min / 5min Dynamic',
        'T1 3D VIBE FS AX CE (KIDNEY) → SAG 따라가기',
        'T1 SAG CE / T1 AX CE / T1 3D VIBE AX CE'
      ],
      easyGuide: [
        '진경제(알피트) 사용, Ovary(난소) 안 잘리게 주의! 소견에 Vulva 있으면 생식기 다 포함되게 설정.',
        'Body coil 사용 시 pubic bone 포함, Axial로 pelvic cavity 전체 포함. Kidney scan 전 호흡 및 방송 안내.',
        '1min ~ 5min Subtraction: (DYN_W로) Evaluation → Dynamic Analysis → Subtraction → Exchange → Description (1min ~ 5min)'
      ],
      pacsRule: [
        '[Pelvis PACS 전송] Scout → Kidney Scout → SAG → Axial 2 set → COR → T1 AX FS → ADC → PRE W → Immediately W → 1min W, 1min W SUB → 3min W, 3min W SUB → 5min W, 5min W SUB → T1 SAG CE → T1 AX CE → T1 3D VIBE AX CE (Kidney, eTHRIVE, Survey 다 넘긴다)'
      ],
      updates2026: [],
      notes: '진경제(알피트) 사용, Kidney Scout 별도 플랜, 1~5분 Dynamic Subtraction 전송'
    },
    {
      id: 'prostate-mri',
      name: 'Prostate MRI + CE (전립선 정밀)',
      tag: '전립선·Center추종',
      time: '30 Min',
      sequences: [
        'Scout (Test 지우고 pause 밑으로 지우고 시작)',
        'T2 SAG / T2 COR / T2 AX (→ Center 따라가기)',
        'T1 AX / T1 AX UP',
        'Diffusion (b0, b50, b400, b800) → Center 따라가기',
        'T1 3D VIBE DIXON AX → Center 따라가기 (Pre scan 14초 2/12 하기 전 조영제 주입)',
        'T1 AX CE'
      ],
      easyGuide: [
        'SAR 경고창 뜨면: Flip Angle 클릭하여 조절',
        'Center 따라가기: T2 Axial, Diffusion, ENHANCE는 모두 Center 따라가기 적용!',
        'Diffusion FOV 조정: Diffusion은 FOV가 좁아 Position을 P(앞), L(뒤)로 조정하고, Reference line은 1번만 허용(Axial 중심선 정확히 맞추기)'
      ],
      pacsRule: [
        '[Prostate PACS 전송] Scout → T2 SAG → T2 COR → T2 AX → T1 AX → T1 AX UP → Diffusion (b0, b50, b400, b800) → T1 3D VIBE DIXON AX → T1 AX CE'
      ],
      updates2026: [],
      notes: 'Diffusion/Enhance Center 추종, Reference line 1번만 허용, Pre scan 14초(2/12 전) 주입'
    },
    {
      id: 'rectal-mri',
      name: 'Rectal MRI + CE (직장 정밀)',
      tag: '직장·DCE타이밍',
      time: '25~30 Min',
      sequences: [
        'Scout → T2 SAG → T2 COR → T2 AX',
        'T2 AX HR (Angle 자동으로 들어감)',
        'T2 FLAIR FS AX (Angle 자동으로 들어감)',
        'APC → AX 따라가기',
        'T1 VIBE FS PRE-W → AX 따라가기',
        'DCE (Dynamic Contrast Enhancement — Skyra 3/45, Achieva 5/45에 조영제 주입!)',
        'T1 VIBE FS POST-W',
        'DWI (b0, b100, b800)'
      ],
      easyGuide: [
        '조영제: Gadolinium 15 mL, 주입속도 2 mL/sec (Auto injector)',
        '장비별 조영제 주입 시작 타이밍: Skyra는 [3/45], Achieva는 [5/45]에 조영제 주입!',
        'DCE 범위 조정: Dynamic 시퀀스이므로 시간 보고 THICKNESS(두께)만 늘려야 한다.'
      ],
      pacsRule: [
        '[Rectal PACS 전송] Scout → T2 SAG → T2 COR → T2 AX → T2 AX HR → T2 FLAIR FS AX → APC → T1 VIBE FS PRE-W → DCE → T1 VIBE FS POST-W → DWI (b0, b100, b800)'
      ],
      updates2026: [],
      notes: 'Gado 15mL(2mL/s), 주입 타이밍(Skyra 3/45, Achieva 5/45), DCE는 두께로만 조정'
    },
    {
      id: 'hip-mri',
      name: 'MRI (Hip, 고관절)',
      tag: '고관절',
      time: '20 Min',
      sequences: [
        'Scout',
        'DIXON COR 4장 (opp, in, F, W) — Femur head 포함 필수!',
        'T1 COR',
        'T2 DIXON AX 4장 (opp, in, F, W)',
        'T2 AX / T1 AX',
        'SAG DIXON 4장 (opp, in, F, W)'
      ],
      easyGuide: [
        'COR 이미지 잘 보기 → Femur head(대퇴골두)가 무조건 포함되어야 함!'
      ],
      pacsRule: [
        '[MRI (Hip) PACS 전송] Scout → DIXON 4장 → T2 DIXON AX 4장 → T2 AX → T1 AX → SAG DIXON 4장'
      ],
      updates2026: [],
      notes: 'COR에서 Femur head 포함 필수, DIXON 4장 세트 전송'
    }
  ],

  // ==========================================================================
  // 6. EXTREMITY / MSK (사지 · 관절)
  // ==========================================================================
  knee: [
    {
      id: 'extremity-basic-mass',
      name: 'Extremity MRI 표준 (기본 + Mass 처방)',
      tag: '최신개정·필수',
      time: '20~25 Min',
      sequences: [
        '두번째 Scout',
        'T2 DIXON COR (opp, in, F, W) — ※ 기존 T2 COR은 모든 Extremity에서 삭제!',
        'T1 COR',
        'T2 DIXON AX (opp, in, F, W)',
        'T2 AX / T1 AX',
        'T2 DIXON SAG (opp, in, F, W)',
        '[Mass 처방 시 추가] DWI (b = 50, 400, 800 권장)',
        '[Cellulitis(봉와직염) 환자] DWI 검사 필수 추가!',
        '[CE 처방 시] CE: COR / AX / SAG'
      ],
      easyGuide: [
        '핵심 구성(Key Point): 기본 Cor 2(T2 Dixon + T1 Cor) / Ax 3 / Sag 1 (T2 Dixon Coronal의 In-phase가 T2 Coronal과 유사하므로 T2 COR은 삭제)',
        'Mass 처방 시: 경우에 따라 Body coil 사용 가능, DWI(b=50, 400, 800) 추가, 작은 병변은 최소 3 plane 영상 확보',
        'Lower leg는 한쪽만 검사하되 관절(Joint)은 무조건 포함하고 병변 가까운 쪽까지 Coverage 확보'
      ],
      pacsRule: [
        '[Extremity PACS 넘길 때] 두번째 Scout → T2 DIXON COR(opp, in, F, W) → T1 COR → T2 DIXON AX(opp, in, F, W) → T2 AX → T1 AX → T2 DIXON SAG(opp, in, F, W) → CE: COR / AX / SAG'
      ],
      updates2026: [
        '🚨 [고성혜 교수님 지침 1 — 피부과·성형외과·혈액종양내과 처방] 관절 루틴(knee, foot, hand)으로 검사하지 말고 반드시 "Extremity Mass"로 처방 받아 Mass 위주로 검사하고 Marker도 꼭 붙여주세요!',
        '🚨 [고성혜 교수님 지침 2 — Marker 마킹 규칙] Extremity mass 검사 시 MARKER를 NON-CE에서는 "W 이미지"에 마킹하고, CE 영상에는 "모두" 마킹해주세요!',
        '🚨 [고성혜 교수님 지침 3 — Achieva/Elition 부위 설정] 아치바, 엘리션에서 Extremity 검사 시 ExamCard Properties 표시 부분에서 "Extremity"로 꼭 변경해주세요! (미변경 시 PACS에 HIP으로 잘못 표기됨)',
        '🚨 [Cellulitis 환자] 봉와직염(Cellulitis) 환자는 DWI 검사를 꼭 추가해주세요!'
      ],
      refImage: '/refs/achieva_extremity_setting.jpg',
      notes: 'T2 COR 삭제(T2 Dixon+T1 Cor 2개), 피부/성형/혈종은 무조건 Extremity Mass & 마커 부착'
    },
    {
      id: 'shoulder-mri',
      name: 'Shoulder MRI (손바닥 위로! & AX→SAG→COR 순서 변경)',
      tag: '순서변경·중요',
      time: '20 Min',
      sequences: [
        'Survey Lt or Rt 선택 (본원 F/U 처방은: SHOULDER OS CO AX)',
        '1순위 스캔: AX (PD SPIR AX / [Post-op 시 T2 TSE AX 추가])',
        '2순위 스캔: SAG (PD SPIR SAG / [Post-op 시 T2 TSE SAG 추가])',
        '3순위 스캔: COR (PD SPIR COR / [Post-op 시 T2 TSE COR 추가] / T1 TSE COR)',
        '[노규철 교수님 Post-op LTT OP 소견 시] FOV와 Slice 늘려서 SCAPULA 다 포함 (12번방 프로토콜 저장됨)'
      ],
      easyGuide: [
        '★ 환자 손바닥 자세: 반드시 손바닥이 위로 향한 상태(외회전)에서 검사해야 Tendon이 펴져서 제대로 평가 가능! (손바닥이 아래로 향하면 꺾여서 나옴)',
        '호흡 유도: 복식 호흡 유도, 크게 쉬지 않게 안내',
        'Plane & Coverage: Coronal은 AC joint 포함, Axial은 전체 Scapula 포함. OBL Coronal은 극상근 line 따라 세팅하되 Sagittal 이미지에서도 Angle을 맞춰야 함(고성혜 교수님 요청). Sag는 자동 90도 세팅하되 근육 포함.',
        'PACS 표기 팁: Sagittal에서 F3 누르면 → Lt로 바뀜 / Rt Sagittal에서 Sagittal Flip horizontal 아이콘을 이용하여 LA로 바꿔준다.'
      ],
      pacsRule: [
        '🚨 [스캔 및 PACS 순서 변경] 이제부터 Shoulder 검사는 [AX 다음에 SAG을 검사하고 COR 검사]하는 순서로 하며, PACS 순서도 동일하게 맞춥니다!',
        '🚨 [3D 리컨 지침] Shoulder 3D AX 리컨은 하지 않습니다 (X).'
      ],
      updates2026: [
        '🚨 [채수인 선생님 공지] ① 손바닥이 위로 향한 상태에서 검사 필수! ② 검사 및 PACS 순서는 AX → SAG → COR 통일!',
        '🚨 [고성혜 교수님 요청] Cor 검사 시 Axial뿐만 아니라 Sag 이미지에서도 Angle이 필요합니다!',
        '🚨 [노규철 교수님 LTT OP] Post-op shoulder 중 소견에 LTT OP 들어있으면 FOV와 Slice 개수를 늘려 Scapula를 다 포함해 검사 (12번방 저장됨). Shoulder pre-op 입원 후 검사는 새벽으로 잡지 말아주세요.'
      ],
      refImage: '/refs/shoulder_cor_angle.jpg',
      notes: '손바닥 위로(외회전) 필수, AX→SAG→COR 순서, Sagittal에서도 Angle 적용, LTT OP 시 견갑골 포함'
    },
    {
      id: 'knee-mri',
      name: 'Knee MRI (성인 / 19세 미만 / Mass 추가)',
      tag: '슬관절 표준',
      time: '20 Min',
      sequences: [
        'Survey (Lt / Rt 선택 — 19세 미만은 반대쪽 Survey + 3D PD FS VISTA 추가)',
        '3D PD FS VISTA → Slim box 늘려서 맞춤 (영상 나오면 COR / AX / OBL 만들어준다)',
        'T2 TSE SAG → 먼저 plan',
        'T1 TSE SAG',
        'T2 TSE FS AX',
        'T2 TSE OBL → ACL(전방십자인대) 평행되게',
        'PD TSE COR → Medial & Lateral meniscus(반월판연골) 평행되게',
        '[Mass 또는 Meta 보이면 추가] DIFFUSION (b50_400_800) + GRE (T2W_GRE) 추가 검사!'
      ],
      easyGuide: [
        '해부학 커버리지: 비골두(Fibular head)와 내·외측 측부인대가 절대 안 잘리게 PLAN!',
        'COR PLAN: 삼각형으로 보이는 반월판연골(Meniscus)에 평행되게 맞추고 내외측 측부인대도 잘 보이게 설정',
        'Contrast(CE) 처방 시: 조영제 Dotarem 사용, AX CE / COR CE / SAG CE 모두 시행'
      ],
      pacsRule: [
        'Survey, 3D PD FS VISTA (원본 + COR/AX/OBL 재구성), SAG/AX/OBL/COR 전송 (Mass 시 DWI + GRE 포함)'
      ],
      updates2026: [
        '🚨 [최대용 선생님 공지] Knee 처방에 mass 있을 시 DWI랑 GRE(T2W_GRE)를 추가로 검사해주세요!'
      ],
      refImage: '/refs/knee_mass_examcard.jpg',
      notes: '비골두·측부인대 포함, ACL/Meniscus 평행 플랜, Mass 시 DWI + GRE 추가'
    },
    {
      id: 'ankle-foot-mri',
      name: 'Ankle & Foot (+ CE) 프로토콜 (아킬레스건 · 골절/인대)',
      tag: '최신개정·필수',
      time: '20~25 Min',
      sequences: [
        'Scout (Study description에 Rt or Lt 반드시 기입!)',
        'T1 SAG / T1 FS SAG (발가락은 2개 이상 포함, 세팅값은 건드리지 말 것)',
        'T2 FS AX / T1 AX / T2 AX (Oversampling 치고 안 들어오게 잘 보고 Saturation band 확인)',
        '[Skyra 장비에서 Ankle 검사 시 필수] PD FS AX 추가 검사!',
        'T2 COR / T1 COR / FS COR (Slice thickness 2mm까지 줄여도 무방)',
        '[Mass 있으면 추가] T2_mD2D_COR + Diffusion 추가 촬영!',
        '[CE 처방 시 (주입 3분 후 스캔)] T1 SAG CE → T1 AX CE → T1 COR CE (Phase 방향: R→L 뒷꿈치 쪽, Oversampling 조절)'
      ],
      easyGuide: [
        'Lisfranc joint injury 소견 잘 보기, Foot T1 COR CE는 Phase 방향을 R→L(뒷꿈치 쪽)로 설정',
        '★ 아킬레스건 SAG 플랜(고성혜 교수님 요청): AX까지 잘 맞춰서 아킬레스건이 끝까지 쭉 한 장에 나오도록 플랜!',
        '★ Ankle 장비 배정: 골절(fracture), 인대(ligament) 봐야 하는 환자는 Philips 장비에서 검사하고, 부득이하게 Skyra에서 검사할 경우 PD FS AX를 추가로 검사!'
      ],
      pacsRule: [
        'Rt/Lt 기입 확인 후 전 시퀀스 전송 (감염 제외한 Ankle fracture/pain은 3D 이미지에서 하나 더 recon 진행 — OS 요청사항)'
      ],
      updates2026: [
        '🚨 [Ankle 4대 필수 지침] ① Fracture/Ligament는 Philips 우선 배정 ② Skyra에서 Ankle 검사 시 무조건 "PD FS AX" 추가! ③ 아킬레스건 SAG는 한 장에 끝까지 나오게 AX 맞춰 플랜(고성혜 교수님) ④ 감염 제외 Ankle 골절/통증은 3D에서 하나 더 Recon(OS 요청)'
      ],
      refImage: '/refs/ankle_achilles_plan.jpg',
      notes: 'Rt/Lt 필수 기입, Skyra Ankle 시 PD FS AX 추가, 아킬레스건 전장 한 장 플랜'
    },
    {
      id: 'elbow-wrist-mri',
      name: 'Elbow & Wrist MRI (상지 관절)',
      tag: '상지·3D리컨',
      time: '15~20 Min',
      sequences: [
        '[Elbow] Survey 촬영 (두번째 Survey까지 확실하게, Rt/Lt 마킹, Head or Feet First)',
        '[Elbow 기준점] Epicondyle (상과) 기준으로 맞춤',
        '[Elbow 3D] Elbow 3D AX만 검사 → 리컨 SAG, COR 생성 (joint calcification만 확인하면 돼서 범위 늘리지 않아도 됨)',
        '[Elbow 신경 평가] 소견에 Neuropathy 나면 → 3D Nerve View (VENC-3) 추가!',
        '[Wrist] 병변이 모호할 경우 Coronal 위로 올려 먼저 검사해서 병소를 찾아야 함 (Coronal SPIR에서 잘 보임)',
        '[Wrist Mass 의심 시] Mass 보이면 Diffusion 검사 추가 (애매하면 일단 찍고 안 넘겨도 됨)'
      ],
      easyGuide: [
        'Elbow: 3D AX만 검사하고 SAG, COR를 리컨한다.',
        'Wrist: 영상 넘길 때는 두번째 스카우트인 Survey 2로 넘기기!'
      ],
      pacsRule: [
        'Elbow: Rt/Lt 마킹 + 3D AX 및 SAG/COR 리컨 전송 | Wrist: Survey 2로 전송'
      ],
      updates2026: [
        '🚨 [이기현 선생님 공지] Shoulder 3D AX 리컨은 X, Elbow는 3D AX만 검사해주시고 리컨 SAG, COR 해주세요!'
      ],
      notes: 'Elbow Epicondyle 기준 & 3D AX→SAG/COR 리컨, Wrist는 Survey 2로 전송'
    }
  ]
};
