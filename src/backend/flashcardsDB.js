/**
 * ============================================================================
 * [HALLYM MRI BACKEND] 4. 3D 학습 플래시카드 데이터베이스 (flashcardsDB.js)
 * ============================================================================
 * - 신규 입사자 및 실습 학생용 3D Flip Q&A 카드
 */

export const initialFlashcardsData = [
  // 테마 1: MRI 파라메타 원리
  { theme: '테마 1: 파라메타 원리', q: 'TR(Repetition Time)과 TE(Echo Time)는 각각 어떤 대조도 스위치를 담당하나요?', a: '• TR = "T1 손잡이" (짧게 하면 지방이 밝은 T1 강조)\n• TE = "T2 손잡이" (길게 하면 물이 밝은 T2 강조)\n• TI = "조직 지우개" (FLAIR는 CSF 소거, STIR는 지방 소거)' },
  { theme: '테마 1: 파라메타 원리', q: '기름(지방)과 물(CSF·부종)의 T1, T2 신호 특성 암기법은?', a: '"기름은 T1(밝음), 물은 T2(밝음)"\n\n• 지방: T1이 짧아(빨리 다시 서서) T1W에서 밝음\n• 물: T2가 길어(천천히 흩어져서) T2W에서 밝음' },
  { theme: '테마 1: 파라메타 원리', q: 'Dixon 기법에서 나오는 4가지 영상(W, F, In, Out)의 의미는?', a: '1️⃣ W (Water only): 수분 신호 영상 (지방 억제 T2 FS 역할, 병변 밝게)\n2️⃣ F (Fat only): 지방 신호 영상 (골수·피하지방 선명)\n3️⃣ In (In-phase): 동상 영상 (물+지방 합쳐져 밝고 깨끗함)\n4️⃣ Out (Opposed-phase): 역상 영상 (물·지방 상쇄로 지방 섞인 조직 어두워짐)' },
  { theme: '테마 1: 파라메타 원리', q: '대역폭(Bandwidth, BW)을 넓히면(↑) 왜곡(WFS)과 SNR은 어떻게 변하나요?', a: '• 장점: 한 픽셀이 넓은 주파수를 담아 물-지방 갈라짐(WFS)과 금속/화학적이동 왜곡이 감소(↓)하고 최소 TE가 짧아집니다.\n• 단점: 잡음도 더 많이 들어와 SNR은 하락(↓)합니다.' },
  { theme: '테마 1: 파라메타 원리', q: 'SAR 또는 Max B1+rms 제한 경고가 뜰 때 낮추는 실전 레시피는?', a: '• TR↑ (늘리기)\n• Flip angle↓ (줄이기)\n• ETL↓ 또는 가변 Refocusing 사용\n• 평행영상(R)↑ / Scan%↓로 늘어난 시간 보전\n• B1 Shim mode를 TrueForm에서 Volume-selective로 변경' },
  { theme: '테마 1: 파라메타 원리', q: 'STIR 기법과 주파수 FatSat(SPIR)의 차이점과 조영 검사 시 주의사항은?', a: '• STIR: 자장이 불균일한 곳에서도 지방을 확실히 억제하지만 SNR이 낮고, 조영제(Gadolinium)로 짧아진 T1 신호까지 함께 지우므로 조영제 투여 후에는 절대 사용하면 안 됩니다!' },

  // 테마 2: 제조사별 명칭
  { theme: '테마 2: 제조사별 시퀀스 명칭', q: '가변 숙임각을 이용한 3D 고해상도 T2/FLAIR 기법의 제조사별 명칭은?\n(Siemens / Philips / GE)', a: '• Siemens: SPACE\n• Philips: VISTA\n• GE: CUBE' },
  { theme: '테마 2: 제조사별 시퀀스 명칭', q: '복부·유방 3D 역동적 조영(Dynamic T1) 기법의 제조사별 명칭은?', a: '• Siemens: VIBE\n• Philips: THRIVE / eTHRIVE\n• GE: LAVA' },
  { theme: '테마 2: 제조사별 시퀀스 명칭', q: '금속 인공물 감소 기법(Metal Artifact Reduction)의 제조사별 명칭은?', a: '• Siemens: WARP / SEMAC\n• Philips: O-MAR\n• GE: MAVRIC SL' },

  // 테마 3: 한림대성심병원 실무 프로토콜 & 최신 공지
  { theme: '테마 3: 한림 실무 & 최신지침', q: '피부과, 성형외과, 혈액종양내과 사지 처방 시 고성혜 교수님 필수 지침은?', a: '• 관절 루틴(Knee, Foot, Hand 등)으로 찍지 말고 반드시 "Extremity Mass"로 처방 받아 Mass 위주로 검사!\n• 병변에 Marker 필수 부착!\n• 마킹 표기: Non-CE는 "W 이미지"에만 마킹, CE 영상에는 "모두" 마킹!' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: 'Shoulder MRI 검사 시 환자 손바닥 자세와 변경된 스캔/PACS 순서는?', a: '• 손바닥 자세: 반드시 손바닥이 위로 향한 상태(외회전)로 검사해야 Tendon이 꺾이지 않고 펴져서 평가 가능!\n• 스캔 및 PACS 순서: [AX → 다음에 SAG → 마지막에 COR] 순서로 진행!' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: '전치만 교수님 Brain 3D T2, 3D T1 CE 개정 프로토콜 및 전송 규칙은?', a: '• 0.8mm로 스캔 후 SAG, COR, AX 모두 1mm로 Recon (안 잘리게 SAG를 충분히 넓게 스캔)\n• 0.8mm 소스 영상은 Dynapex로 전송\n• PACS Verify 순서는 [SAG → COR → AX] 순서로 정렬!' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: 'MRCP 검사 중 "Burst RF Power" 에러 메시지가 나오면 1순위·2순위 해결법은?', a: '• 1순위 (시간 변동 없음): System → B1 Shim mode → TrueForm에서 "Volume-selective"로 변경\n• 2순위 (시간 변동 있음): Sequence → Gradient mode → "Normal"로 변경 (안 될 시 Whisper)' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: 'Philips 장비에서 Angle 진입 시 스캔 시간이 늘어날 때 단축하는 팁은?', a: '• 콘솔 [Offc/Ang] 탭에 들어가서 "Free rotatable"을 [Yes]로 변경하면 스캔 시간을 줄일 수 있습니다.' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: 'Ankle 골절/인대 환자 장비 배정 원칙과 Skyra 검사 시 필수 추가 시퀀스는?', a: '• 장비 배정: Philips 장비 우선 검사\n• Skyra에서 Ankle 검사 시: 무조건 "PD FS AX" 시퀀스 추가 검사!\n• 아킬레스건 SAG 플랜: AX까지 잘 맞춰서 아킬레스건이 한 장에 끝까지 쭉 나오도록 플랜' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: 'Liver MRI 검사 후 PACS 외에 전체 영상을 필수로 넘겨야 하는 외부 서버 2곳은?', a: '• ISP 및 TeraRecon 두 곳 모두 전체 영상을 꼭 넘겨야 합니다!' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: '신경외과(NS) Perfusion 처방 시 필수 추가 검사와 전송 서버는?', a: '• 무조건 "ASL"을 추가 검사하고, 영상 전체를 ISP로 전송합니다.\n• 일반 Perfusion은 2, 3, 4, 5, 6번만 PACS로 넘기고 소스는 ISP, JLKPMI, Dynapex로 전송합니다.' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: '소장 MRI(Enterography) 음수 전처치와 부스코판(Buscopan) 3회 분할 투여 시점은?', a: '• 음수: 검사 1시간 전부터 물 1L + 레디프리 2포 희석액을 1시간 동안 마신 후 물 한 잔 추가 복용, 완료 15분 후 검사 시작\n• 부스코판(총 1.5 amp): ① 검사 직전 0.5 amp → ② DWI 스캔 전 0.5 amp → ③ CE 조영 스캔 전 0.5 amp' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: '심장 MRI(Cardiac) 지연 조영(DE) 시퀀스의 TI-Scout 대기 시간과 시퀀스별 TI값 보정 규칙은?', a: '• 조영제 주입 후 15분 대기 후 TI-Scout 촬영\n• DE_4ch: 기본 TI값 입력 (Slice 3장 고정)\n• DE_2ch: 기존 TI값 + 20 적용 (Slice 3장 고정)\n• DE_SAX: 기존 TI값 + 40 적용 (Slice 12장)' },
  { theme: '테마 3: 한림 실무 & 최신지침', q: '응급실(ER) Diffusion 환자가 응급실 복귀 후 MRA를 추가할 때 처방 처리법과 내선번호는?', a: '• 기존 Diffusion 처방은 "50% 처방"으로 변경 후, 매칭 MRA 처방을 다시 받아 검사를 나눠서 매칭되게 진행합니다.\n• 응급실 처방변경 연락처: ☎️ 1576' }
];
