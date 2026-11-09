/**
 * ============================================================================
 * [HALLYM MRI BACKEND] 3. 최신 임상 공지 & 실무 도구 데이터베이스 (clinicalNoticesDB.js)
 * ============================================================================
 * - 교수님 특별지침, 장비 에러 대처, 신규 처방 코드, 외부 서버 라우팅, 영어 안내 방송
 */

export const clinicalNoticesData = [
  {
    id: 'notice-1',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'urgent',
    title: '피부과·성형외과·혈액종양내과 처방은 무조건 "Extremity Mass"로 변경 & 마커 부착',
    target: '고성혜 교수님 전달사항',
    summary: '관절 루틴 검사(Knee, Foot, Hand 등)로 검사하지 마시고 반드시 "Extremity Mass"로 처방 받아 Mass 위주로 검사해주세요.',
    details: [
      '피부과, 성형외과(PS), 혈액종양내과에서 내는 사지 처방은 관절 루틴으로 스캔 금지',
      '반드시 "Extremity Mass" 프로토콜로 처방을 받아 병변(Mass) 위주로 커버리지 확보 및 스캔',
      '병변 부위에 Marker 부착 필수!',
      'MARKER 표기 원칙: NON-CE에서는 "W 이미지"에 마킹하고, CE 영상에는 "모두" 마킹할 것 (정재헌 선생님 공지)'
    ],
    tags: ['고성혜교수님', 'Extremity Mass', '마커필수', '피부과/성형외과/혈종']
  },
  {
    id: 'notice-2',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'urgent',
    title: '전치만 교수님 Brain 3D T2, 3D T1 CE 프로토콜 개정 (0.8mm 스캔 → 1mm 3-Plane Recon)',
    target: '전치만 교수님 · 김도완/채수인/최대용 선생님 공지',
    summary: '0.8mm로 스캔 후 SAG, COR, AX 모두 1mm로 Recon 하는 방식으로 수정되었습니다.',
    details: [
      '스캔 시 주의: SAG, COR, AX 3개 모두 Recon 해야 하므로 SAG 영상을 충분히 넓게 스캔해야 함 (타이트하게 스캔하면 Recon 시 영상 잘림)',
      '외부 서버 전송: 0.8mm 소스 영상을 Dynapex로 전송',
      'PACS Verify 순서: 반드시 [SAG → COR → AX] 순서로 맞춰서 베리파이할 것'
    ],
    tags: ['전치만교수님', 'Brain 3D', '0.8mm스캔', 'Dynapex', 'SAG-COR-AX']
  },
  {
    id: 'notice-3',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'high',
    title: 'Shoulder MR 환자 손바닥 자세(위로!) 및 스캔/PACS 순서(AX → SAG → COR) 변경',
    target: '고성혜 교수님 / 채수인·김성훈 선생님 공지',
    summary: '손바닥이 위로 향한 상태(Supination)로 검사하여 Tendon 꺾임을 방지하고, AX → SAG → COR 순서로 통일합니다.',
    details: [
      '환자 자세: 반드시 손바닥이 위로 향한 상태에서 검사해야 극상근건(Tendon)이 펴져서 정확히 평가 가능 (손바닥이 아래로 향하면 꺾여 보임)',
      '스캔 및 PACS 순서: AX 다음에 SAG을 검사하고 마지막에 COR 검사 (PACS 전송 순서도 AX → SAG → COR 동일)',
      'Coronal Plan 각도: Axial 이미지만 보지 말고 Sagittal Scout/이미지에서도 Angle을 주어야 함 (고성혜 교수님 요청)',
      'Shoulder 3D AX는 별도 리컨 하지 않음 (X)'
    ],
    tags: ['Shoulder', '손바닥위로', 'AX-SAG-COR', 'Sagittal Angle'],
    refImage: './refs/shoulder_cor_angle.jpg'
  },
  {
    id: 'notice-4',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'high',
    title: '정형외과 노규철 교수님 Post-op Shoulder (LTT OP) 스캔 범위 확대',
    target: '노규철 교수님 (OS)',
    summary: '소견에 LTT OP가 들어있으면 FOV와 Slice 개수를 늘려 Scapula(견갑골) 전체를 포함해 검사합니다.',
    details: [
      '대상: 정형외과 노규철 교수님 Post-op Shoulder 환자 중 소견에 "LTT OP" 포함 환자',
      '방법: 일반 Shoulder보다 FOV와 Slice 개수를 늘려서 SCAPULA(견갑골)를 다 포함하여 스캔 (12번방에 전용 프로토콜 저장 완료)',
      '예약 주의: Shoulder pre-op 입원 후 검사는 새벽 시간대로 잡지 말 것'
    ],
    tags: ['노규철교수님', 'LTT OP', 'Scapula포함', '12번방']
  },
  {
    id: 'notice-5',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'high',
    title: 'C-Spine 검사 시 T-L T2 Scout 이미지 마킹 규칙',
    target: '고성혜 교수님 · 정재헌/채수인 선생님 공지',
    summary: 'C-Spine 검사 시 T-L T2 Scout W 이미지 하나에만 레벨 확인용 마킹을 넣어줍니다.',
    details: [
      'T1(제1흉추)이 보이는 경우는 T1에 마킹',
      '환자 키가 커서 T1 이미지 이후로 스캔한 경우 이미지에서 첫 번째에 마킹',
      '마킹은 여러 장에 넣지 말고 "T2 Scout W" 이미지 하나에만 넣어주면 됨'
    ],
    tags: ['고성혜교수님', 'C-Spine', 'T2 Scout W', '마킹규칙']
  },
  {
    id: 'notice-6',
    category: 'professor',
    categoryLabel: '교수님 특별지침',
    priority: 'high',
    title: 'Ankle (발목) 검사 장비 배정(Philips 우선), Skyra PD FS AX 추가 및 아킬레스건 플랜',
    target: '고성혜 교수님 / OS 요청 · 채수인/최대용 선생님 공지',
    summary: 'Ankle 골절·인대 환자는 Philips 우선 배정하며, Skyra 검사 시 무조건 PD FS AX를 추가합니다.',
    details: [
      '장비 배정: Ankle fracture, ligament 봐야 하는 환자는 Philips 장비에서 검사 권장',
      'Skyra 추가 시퀀스: Skyra 장비에서 Ankle 검사 시 무조건 "PD FS AX" 추가 검사 필수!',
      'OS 3D Recon 요청: Ankle fracture나 pain(감염 제외)으로 검사하는 경우 기존 3D 이미지에서 하나 더 Recon 시행',
      '아킬레스건 SAG Plan: AX 이미지까지 잘 맞춰서 아킬레스건이 끝까지 쭉 한 장에 나오도록 플랜 (고성혜 교수님 요청)'
    ],
    tags: ['Ankle', 'PD FS AX', '아킬레스건', '3D Recon'],
    refImage: './refs/ankle_achilles_plan.jpg'
  },
  {
    id: 'notice-7',
    category: 'equipment',
    categoryLabel: '장비·에러 대처',
    priority: 'urgent',
    title: 'MRCP Burst RF Power 에러 메시지 발생 시 1·2순위 해결 프로토콜',
    target: 'Siemens 콘솔 트러블슈팅',
    summary: '스캔 시간 변동이 없는 B1 Shim mode(Volume-selective) 변경을 1순위로 적용합니다.',
    details: [
      '1순위 방법 (시간 변동 없음): System 탭 → B1 Shim mode → TrueForm에서 "Volume-selective"로 변경 우선 적용!',
      '2순위 방법 (시간 변동 있음): Sequence 탭 → Gradient mode → "Normal"로 변경',
      '3순위 방법: Normal로도 안 될 시 Gradient mode를 "Whisper"(제일 시간 오래 걸림)로 변경'
    ],
    tags: ['MRCP에러', 'Burst RF Power', 'Volume-selective', 'Gradient mode']
  },
  {
    id: 'notice-8',
    category: 'equipment',
    categoryLabel: '장비·에러 대처',
    priority: 'high',
    title: 'Philips 장비 Angle 진입 시 Scan Time 단축 팁 (Free rotatable = Yes)',
    target: '채수인 선생님 공지 · Philips Achieva / Elition',
    summary: 'Philips 장비에서 Angle이 들어갈 때 스캔 시간이 늘어나면 Offc/Ang 탭의 Free rotatable을 Yes로 변경하세요.',
    details: [
      '증상: Philips 장비에서 C-Spine이나 관절 등에 Angle이 들어갈 때 Scan time이 비정상적으로 늘어나는 경우',
      '해결: 콘솔 하단 [Offc/Ang] 탭 진입 → "Free rotatable" 항목을 [Yes]로 변경하면 Scan time을 줄일 수 있음'
    ],
    tags: ['Philips팁', 'Free rotatable', '스캔시간단축', 'Offc/Ang'],
    refImage: './refs/philips_free_rotatable.jpg'
  },
  {
    id: 'notice-9',
    category: 'equipment',
    categoryLabel: '장비·에러 대처',
    priority: 'urgent',
    title: 'Achieva / Elition에서 Extremity 검사 시 PACS 부위 오표기(HIP) 방지 설정',
    target: '고성혜 교수님 전달 · 장찬순 선생님 공지',
    summary: 'ExamCard Properties에서 Anatomical Region을 반드시 "Extremity"로 변경해야 PACS에 정상 표기됩니다.',
    details: [
      '문제점: Achieva, Elition에서 Extremity 검사 시 기본값이 Hip으로 되어 있으면 PACS 전송 후 검사부위가 HIP으로 다르게 표기됨',
      '해결책: ExamCard Properties 창(표시 부분)에 들어가서 Anatomical Region을 반드시 "Extremity"로 변경 후 검사 진행!'
    ],
    tags: ['Achieva', 'Elition', 'Extremity설정', 'PACS표기'],
    refImage: './refs/achieva_extremity_setting.jpg'
  },
  {
    id: 'notice-10',
    category: 'order',
    categoryLabel: '처방·추가시퀀스',
    priority: 'high',
    title: 'Temporal 신규 처방 2종(HI501A8R, HI501A9R) 신설 및 3D T1 AX 필수 추가',
    target: '채수인 선생님 공지 (2026.10)',
    summary: '기존 Temporal 처방에 Brain 3D AX를 추가 검사하는 신규 처방 코드 2개가 신설되었습니다.',
    details: [
      '코드 HI501A8R: MRI(IAC segment) + 3D T1(Axial)',
      '코드 HI501A9R: MRI(Temporal/IAC + CE) + 3D T1(Axial)',
      '주의사항: 위 두 처방으로 접수된 환자는 반드시 "3D T1 AX" 시퀀스를 추가 검사할 것!'
    ],
    tags: ['Temporal신규처방', 'HI501A8R', 'HI501A9R', '3D T1 AX'],
    refImage: './refs/temporal_new_orders.jpg'
  },
  {
    id: 'notice-11',
    category: 'order',
    categoryLabel: '처방·추가시퀀스',
    priority: 'high',
    title: '응급실(ER) Diffusion 검사 중/후 MRA 추가 시 처방변경 및 50% 매칭 규칙',
    target: '채수인 선생님 공지 (2026.10)',
    summary: '검사 중 추가와 응급실 복귀 후 추가의 처방변경 방식이 다르므로 정확히 구분하여 처리합니다.',
    details: [
      '케이스 1 (검사 중 MRA를 추가하는 경우): 기존과 동일하게 처방변경 후 검사 진행',
      '케이스 2 (환자가 응급실에 갔다가 다시 MRA를 추가하는 경우): 기존 Diffusion 처방은 "50% 처방"으로 변경한 후, 매칭 MRA 처방을 다시 받아서 검사를 나눠 매칭되게 처리',
      '응급실 처방변경 직통 번호: ☎️ 1576 으로 전화 요청'
    ],
    tags: ['응급실(ER)', 'Diffusion+MRA', '50%처방변경', '내선1576']
  },
  {
    id: 'notice-12',
    category: 'order',
    categoryLabel: '처방·추가시퀀스',
    priority: 'high',
    title: '질환·부위별 필수 추가 시퀀스 총정리 (Knee Mass, Spine Metal, Cellulitis, PS Neck, Elbow)',
    target: '검사실 공통 실무 지침',
    summary: '소견 및 진료과에 따라 누락하기 쉬운 필수 추가 시퀀스 체크리스트입니다.',
    details: [
      'Knee 처방 + Mass 소견: DWI (b50, 400, 800) + GRE (T2W_GRE) 추가 검사',
      'C, T, L Spine + Metal 환자: Metal 부위만 T2 AX 추가 검사 (O-MAR 프로토콜에 저장됨)',
      'Cellulitis(봉와직염) 환자: DWI 검사 무조건 추가',
      'PS(성형외과) Neck Non-CE 처방: Neck 쪽만 T2 Dixon AX, T1 AX 추가 검사',
      'Elbow 3D: 3D AX만 스캔 후 SAG, COR 리컨 생성 (관절 석회화 확인 목적)',
      'Vessel Wall 처방: Brain Tumor Research (KES) 폴더 프로토콜로 검사'
    ],
    tags: ['추가시퀀스', 'Knee Mass', 'Spine Metal', 'Cellulitis', 'PS Neck'],
    refImage: './refs/knee_mass_examcard.jpg'
  },
  {
    id: 'notice-13',
    category: 'server',
    categoryLabel: '서버·PACS 전송',
    priority: 'urgent',
    title: '외부 분석 서버(ISP · Dynapex · TeraRecon · JLK · Brain ex · 외장하드) 전송 매트릭스',
    target: '전 검사실 PACS/서버 전송 체크',
    summary: '검사 종료 후 PACS 외에 별도 워크스테이션 및 AI 서버로 전송해야 하는 필수 항목입니다.',
    details: [
      'Liver 검사 영상: ISP + TeraRecon 두 곳 모두 전체 영상 필수 전송!',
      'NS Perfusion 처방: 무조건 ASL 추가 검사 + 영상 전체 ISP로 전송 (일반 Perfusion 소스는 ISP, JLKPMI, Dynapex 전송)',
      'Brain 3D CE (BB, eTHRIVE, VIBE) & 전치만 교수님 0.8mm 소스: Dynapex로 전송',
      'NS DTI 검사: ISP로 필수 전송 / RM DTI (T2 AX 추가 소견 시): 추가 스캔 후 외장하드에 함께 저장',
      'Brain Functional (fMRI): ep2d_로 시작하는 영상 총 4개 + 3D 영상을 "Brain ex"로 전송',
      'Skyra Diffusion: SCOUR SAG, ADC, MAG, PHA, SWI, B0, B1000을 JLK(MEDIHUB)로도 전송 (단, 3mm B-1000은 JLK 제외)'
    ],
    tags: ['ISP', 'TeraRecon', 'Dynapex', 'JLK', 'Brain ex']
  },
  {
    id: 'notice-14',
    category: 'workflow',
    categoryLabel: '검사실 운영·팁',
    priority: 'normal',
    title: '검사실 전화 이동착신 설정(#41) / 해제(#49) 및 컴프레셔 전원 복구 팁',
    target: '검사실 당직 및 일일 운영',
    summary: '자리 비울 때 전화 당겨받기 번호와 컴프레셔 전원 버튼 위치를 숙지하세요.',
    details: [
      '전화 이동착신 설정: 자리를 비울 경우 수화기를 들고 [#41]을 누른 후 [해당 사무실/검사실 번호]를 누르면 그곳에서 전화를 받을 수 있음',
      '전화 이동착신 해제: [#49]번',
      '컴프레셔(Compressor) 장비 전원이 안 들어올 시: 장비 하단에 있는 왼쪽 버튼을 눌러주면 전원이 복구됨 (김도완 선생님 공지)',
      '기계실 정리: 기계실에 있는 개인 물품은 모두 사물함에 보관'
    ],
    tags: ['이동착신#41', '착신해제#49', '컴프레셔전원', '당직팁']
  }
];

export const practicalToolsData = {
  jlkPlatform: {
    name: 'MEDIHUB STROKE (JLK AI 뇌졸중 분석 웹 플랫폼)',
    ipUrl: 'http://10.65.17.93/login',
    ipRaw: '10.65.17.93',
    userId: 'user0001',
    password: 'jlk123123',
    steps: [
      '1. 웹 브라우저 주소창에 10.65.17.93 입력 후 MEDIHUB STROKE 웹 플랫폼 로그인 화면 접속',
      '2. ID: user0001 / PW: jlk123123 입력 후 Sign In 클릭',
      '3. 좌측 메뉴 [Subject List]에서 환자번호(Patient ID)를 검색하여 Skyra Diffusion / Perfusion 전송 상태 및 AI 분석 결과 확인'
    ],
    refImage: './refs/jlk_medihub_guide.jpg'
  },

  serverRoutingSummary: [
    { server: 'ISP (Philips Portal)', items: 'Brain/Neck TOF MRA Volume, Perfusion(PWI 1200장), NS Perfusion(+ASL 전체), NS DTI, Liver 전체 영상' },
    { server: 'JLK (MEDIHUB 10.65.17.93)', items: 'Perfusion 소스, Skyra Diffusion (SCOUR SAG, ADC, MAG, PHA, SWI, B0, B1000 — ※ 3mm B-1000은 제외)' },
    { server: 'Dynapex (Dynapacs)', items: 'Perfusion 소스, Brain 3D CE (BB, eTHRIVE, VIBE), 전치만 교수님 Brain 3D (0.8mm 소스)' },
    { server: 'TeraRecon', items: 'Liver MRI 검사 영상 전체 (ISP와 동시에 필수 전송!)' },
    { server: 'Brain ex', items: 'Brain Functional (fMRI): ep2d_로 시작하는 영상 총 4개 + 3D 영상' },
    { server: 'BECAD', items: 'Breast MRI: Dyn 소스 (PRE / 1 / 2 / 3 / 4 / 5 / 6) + DWI 소스 (DWI b0-900_tracew)' },
    { server: '외장하드 (DICOM Export)', items: 'F4 단축키 → 디스크파일 → 브라우저 → Desktop → 외장하드 DTI 폴더 내 환자이름/ID 폴더 → [1) 3D 폴더: 3D T1 AX] / [2) DTI 폴더: 2Reg_32 DTI_b-1000 (+ RM 소견 시 T2 AX)]' }
  ],

  quickCodes: [
    { badge: '전화 착신 설정', code: '#41 + 사무실번호', desc: '자리를 비울 때 수화기 들고 #41 누른 후 받을 사무실 번호 입력' },
    { badge: '전화 착신 해제', code: '#49', desc: '이동착신 해제 시 #49 입력' },
    { badge: '응급실 처방변경', code: '☎️ 1576', desc: 'ER Diffusion 검사 중/후 MRA 추가 처방변경 요청 내선번호' },
    { badge: 'Temporal 신규코드 1', code: 'HI501A8R', desc: 'MRI(IAC segment) + 3D T1(Axial) → 반드시 3D T1 AX 추가!' },
    { badge: 'Temporal 신규코드 2', code: 'HI501A9R', desc: 'MRI(Temporal/IAC + CE) + 3D T1(Axial) → 반드시 3D T1 AX 추가!' }
  ],

  englishScripts: [
    {
      step: '1. 안전 확인 및 금속 제거 (Safety & Metal Check)',
      items: [
        {
          en: 'Do you have any dentures, hearing aids, or medical devices in your body?',
          ko: '틀니, 보청기, 혹은 몸 안에 의료기기가 있으신가요?',
          pron: '두 유 해브 애니 덴처스, 히어링 에이즈, 오어 메디컬 디바이시스 인 유어 바디?'
        },
        {
          en: 'Please remove all metal objects or jewelry.',
          ko: '모든 금속류와 장신구는 빼주세요.',
          pron: '플리즈 리무브 올 메탈 오브젝츠 오어 주얼리.'
        }
      ]
    },
    {
      step: '2. 검사 시간 및 소음 안내 (Scan Time & Noise)',
      items: [
        {
          en: 'The scan will take about 30 minutes.',
          ko: '검사는 약 30분 정도 걸립니다.',
          pron: '더 스캔 윌 테이크 어바웃 써티 미닛츠.'
        },
        {
          en: 'The machine is very loud, so we will give you headphones.',
          ko: '기계 소리가 매우 크니 헤드폰을 씌워 드릴게요.',
          pron: '더 머신 이즈 베리 라우드, 쏘 위 윌 기브 유 헤드폰스.'
        }
      ]
    },
    {
      step: '3. 검사 중 주의사항 및 비상벨 (Instructions & Squeeze Ball)',
      items: [
        {
          en: 'Please make sure not to move.',
          ko: '절대 움직이시면 안 됩니다.',
          pron: '플리즈 메이크 슈어 낫 투 무브.'
        },
        {
          en: 'If you need help, just squeeze this ball.',
          ko: '도움이 필요하시면 이 볼(비상벨)을 꽉 쥐세요.',
          pron: '이프 유 니드 헬프, 저스트 스퀴즈 디스 볼.'
        },
        {
          en: 'We will also ask you to hold your breath at times.',
          ko: '중간에 숨을 참으라는 안내도 나옵니다.',
          pron: '위 윌 올소 애스크 유 투 홀드 유어 브레스 앳 타임즈.'
        }
      ]
    }
  ]
};
