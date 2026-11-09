/**
 * ============================================================================
 * [HALLYM MRI BACKEND] 2. 파라메타 원리 & 물리 가이드 데이터베이스 (parameterDB.js)
 * ============================================================================
 * - 프로토콜과 완전히 분리된 MRI 파라메타 물리 원리 전용 DB
 * - 10대 핵심 파라메타 원리 + 초보자 암기용 비유
 * - 콘솔 실전 파라메타 14종 쉬운 가이드
 * - 상황별 실전 레시피 4선 & 3대 공식
 * - T1·T2 물리 원리 & 10살 버전 스토리텔링 & 바이올린 비유 & 4칸 요약표 & 10계명
 * - Dixon 4종 영상(W, F, In, Out) 원리 & 제조사별(Siemens/Philips/GE) 시퀀스 비교표
 */

export const parameterPrinciplesData = {
  // 1. 10대 핵심 파라메타 원리 정리 + 암기 비유
  core10Params: [
    {
      num: '01',
      name: 'SNR (Signal to Noise Ratio)',
      ko: '신호 대 잡음비',
      definition: '사진 속 "유용한 정보(신호)" / "지저분한 얼룩(잡음)"의 비율',
      analogy: '🗣️ 신호는 "사람 목소리", 잡음은 "시장 소음" → 목소리가 크면 잘 들림!',
      whyPoints: [
        '왜 SNR↑ → 사진이 깨끗해질까? MRI에서 신호는 수소(H) 원자에서 나오는 정돈된 파동이고, 잡음은 기계·환경에서 오는 무작위 파동입니다. 신호가 세고 잡음이 상대적으로 약하면 사진이 매끄럽고 명확하게 보입니다.'
      ],
      principle: '신호는 보셀(Voxel)에 담긴 프로톤 수에 비례하고, 잡음은 코일/전자회로가 만드는 랜덤한 값입니다. 보셀 크기를 키우면 신호가 더 모이고(SNR↑), 반대로 보셀이 작으면 신호가 흩어져 SNR↓',
      upFactors: '두꺼운 슬라이스, 큰 픽셀(FOV↑ / 매트릭스↓), NEX/NSA↑(√배로 증가), 좋은 밀착 코일, 고자장(3T), 낮은 BW',
      downFactors: '얇은 슬라이스, 높은 매트릭스(해상도↑), 넓은 대역폭(BW↑), 평행영상 가속(R/√R 손실)'
    },
    {
      num: '02',
      name: 'SAR (Specific Absorption Rate)',
      ko: '특정 흡수율 (RF 열 에너지)',
      definition: '1kg의 몸이 1초에 흡수하는 RF 에너지 (단위: W/kg)',
      analogy: '🔥 "전자레인지 원리" → RF가 인체 물분자를 흔들어 열 발생!',
      whyPoints: [
        '왜 중요할까? 전자레인지처럼 RF 펄스가 인체 물분자를 흔들어 열을 발생시키기 때문입니다.',
        'SAR↑ 위험성: 환자 체온 상승(↑) 및 화상 위험!'
      ],
      principle: 'TR을 짧게, Flip angle을 크게, TSE(180° 펄스 많음)를 쓰면 더 많은 RF 펄스가 단위 시간당 들어와서 인체가 에너지를 많이 흡수하게 됩니다. (3T 및 고체중 환자에서 급증)',
      upFactors: '짧은 TR, 큰 Flip angle, 높은 ETL/TSE, 3T 고자장, 큰 체격',
      downFactors: 'TR↑(연장), Flip angle↓, TSE refocus angle↓, ETL↓(또는 가변 refocusing), 슬라이스군 분할, R↑/Scan%↓'
    },
    {
      num: '03',
      name: 'Voxel (Volume element)',
      ko: '보셀 (3D 픽셀)',
      definition: 'MRI 영상의 3차원 입체 픽셀 단위 (FOV / Matrix × Slice Thickness)',
      analogy: '🧱 "레고 블록 크기" → 블록이 작을수록 정밀하지만, 작으면 힘(신호)이 약해짐!',
      whyPoints: [
        '왜 작으면 선명할까? 작은 보셀은 더 세밀하게 나눠 찍으니 작은 구조가 뭉개지지 않고 또렷합니다(부분용적효과 감소).',
        '왜 작으면 SNR↓? 보셀이 작으면 그 안에 담기는 프로톤(수소) 수가 줄어 신호량 자체가 줄기 때문입니다.'
      ],
      principle: '신호는 보셀 부피에 비례 → 보셀 크기↓ → 신호↓ → 잡음이 상대적으로 커짐(SNR↓) + 보통 위상 매트릭스(P) 증가가 동반되어 스캔 시간도 증가(↑).',
      upFactors: 'FOV 확대, Matrix 감소, Slice 두께 증가 → SNR↑, 시간↓ (단, 미세구조 뭉개짐)',
      downFactors: 'FOV 축소, Matrix 증가, 얇은 Slice → 해상도↑ (단, SNR↓, 스캔시간↑)'
    },
    {
      num: '04',
      name: 'Matrix (M × P)',
      ko: '매트릭스 (격자 수)',
      definition: '사진 격자의 개수 (M = 주파수 부호화 방향, P = 위상 부호화 방향 줄 수)',
      analogy: '🖼️ "사진 해상도 격자" → 칸이 많을수록 선명하지만, 그만큼 오래 걸림!',
      whyPoints: [
        '왜 많을수록 선명할까? 격자 칸이 많을수록 작은 해부학적 구조도 세밀하게 나눠 보이기 때문입니다.',
        '왜 시간↑? 위상 방향(P)을 늘리면 k-space에서 채워야 할 줄(line) 수가 늘어나서 더 오래 찍어야 합니다.'
      ],
      principle: 'MRI는 TR마다 위상 부호화(Phase encode line)를 한 줄씩 스캔합니다. 따라서 위상 줄 수(P)↑ = 스캔 시간↑, 보셀 크기↓ = SNR↓.',
      upFactors: '작은 병변을 선명하게 보려 할 때 P↑ (해상도↑, 스캔시간↑, SNR↓)',
      downFactors: '환자가 힘들어하거나 시간이 급할 때 P↓ (시간↓, SNR↑, 단 계단현상/거칠음↑)'
    },
    {
      num: '05',
      name: 'TR (Repetition Time)',
      ko: '반복 시간 (T1 스위치)',
      definition: 'RF 자극 후 다음 RF 자극까지 기다리는 시간 (한 슬라이스를 다시 자극할 때까지의 시간)',
      analogy: '🔋 "기다리는 충전 시간" → TR 길면 충전 충분(SNR↑), TR 짧으면 빨리 서는 지방만 유리(T1 강조)!',
      whyPoints: [
        '왜 길면 SNR↑? 긴 시간 동안 프로톤이 종자화를 충분히 회복(T1 회복)하여 다음 자극 때 더 강한 신호를 방출하기 때문입니다.',
        '왜 길면 시간↑? 한 슬라이스를 찍고 다음 자극까지 오래 기다려야 하니까 전체 스캔 시간이 늘어납니다.'
      ],
      principle: '프로톤은 RF 자극으로 쓰러진 후 다시 세워지는 데 시간이 필요합니다. TR을 짧게 주면 빨리 일어나는 조직(지방)과 늦게 일어나는 조직(물)의 차이가 극대화되어 T1 강조영상(T1W)이 됩니다.',
      upFactors: 'T1 영향 감소(PD/T2 쪽), 스캔 시간↑, SNR 약간↑, SAR↓ (임플란트·3T 안전 확보 시 TR↑)',
      downFactors: 'T1 강조 효과↑ (지방 밝고 물 어두움), 스캔 시간↓, SAR↑'
    },
    {
      num: '06',
      name: 'TE (Echo Time)',
      ko: '에코 시간 (T2 스위치)',
      definition: 'RF 자극 후 돌아오는 에코 신호를 듣는(측정하는) 시점',
      analogy: '⏱️ "신호 듣기까지 기다리는 시간" → TE 길면 물과 고형조직 차이가 확실(T2 강조)!',
      whyPoints: [
        '왜 TE 길면 T2 강조↑? 오래 기다리면 조직 간 T2 감쇠 차이가 두드러집니다 (물은 천천히 흩어져 아직 밝고, 고형조직은 신호가 소실되어 어두워짐).',
        '왜 TE 길면 SNR↓? 기다리는 동안 전체적인 횡자화 신호도 함께 줄어들기 때문입니다.'
      ],
      principle: '신호는 시간이 지날수록 T2 이완에 의해 감쇠합니다. TE가 길면 조직 간 대조도(T2 차이)는 뚜렷해지지만 전체 신호 세기는 약해집니다(SNR↓).',
      upFactors: 'T2 강조↑ (물·부종·염증 밝게), SNR↓, 블러링↑',
      downFactors: '해부학적 구조 또렷, SNR↑, T2 강조 효과는 약해짐 (T1/PD 쪽)'
    },
    {
      num: '07',
      name: 'BW (Bandwidth) & WFS (Water Fat Shift)',
      ko: '수신 대역폭 & 물-지방 이동',
      definition: 'BW = 한 픽셀이 받아들이는 주파수 폭(Hz) / WFS = 물·지방이 어긋나 보이는 픽셀 수(pix)',
      analogy: '📻 "라디오 주파수 채널 폭" → 폭을 넓히면(BW↑) 왜곡은 줄지만 잡음도 같이 들어옴(SNR↓)!',
      whyPoints: [
        '왜 BW↑ → 왜곡(갈라짐)↓? 한 픽셀이 커다란 주파수 폭을 받아들이면 물과 지방의 공명주파수 차이(약 3.5ppm)가 한 픽셀 안에 다 들어가 무시되므로 덜 갈라져 보입니다(WFS↓).',
        '왜 BW↑ → SNR↓? 주파수 문을 넓게 열면 픽셀이 백색 잡음(Noise)을 더 많이 끌어안기 때문입니다.'
      ],
      principle: '신호는 특정 주파수에서 나오지만 잡음은 전 주파수 범위에서 생깁니다. BW와 WFS는 반비례 관계입니다 (BW↑ = WFS↓ = 왜곡↓ = TE 단축 가능 = 대신 SNR↓).',
      upFactors: '금속 인공물/부비동/고관절, EPI 왜곡이 심한 곳에서 BW↑ (왜곡↓, 케미컬시프트↓, 최소 TE↓, 단 SNR↓)',
      downFactors: '자장이 균일하고 높은 신호(SNR↑)가 필요할 때 BW↓ (단, 가장자리 이중선/화학적 이동 왜곡↑)'
    },
    {
      num: '08',
      name: 'ETL (Echo Train Length / Turbo factor)',
      ko: '에코 열 길이 (터보 팩터)',
      definition: '한 번의 TR 동안 연달아 모으는 에코(k-space 줄)의 수',
      analogy: '🖨️ "복사기 한 번에 여러 장 뽑기" → 엄청 빠르지만 뒤로 갈수록 잉크가 옅어져 번짐(Blur)!',
      whyPoints: [
        '왜 ETL↑ → 시간↓? 한 번의 TR에 k-space 여러 줄을 한꺼번에 빨리 채우니까 스캔 시간이 1/ETL로 단축됩니다.',
        '왜 ETL↑ → 블러(Blur)↑? 뒤쪽 에코일수록 신호가 T2 감쇠로 많이 줄어든 상태에서 k-space 주변부(해상도 결정)에 기여하기 때문에 영상이 흐릿해집니다.'
      ],
      principle: 'k-space 중앙부는 대조도(명암), 주변부는 세부 윤곽선(선명도)을 담당합니다. 너무 긴 ETL로 뒤쪽 약한 에코가 주변부를 채우면 블러링이 생기고, 180° 재초점 펄스가 많아져 SAR도 상승합니다.',
      upFactors: '숨참기·응급 등 시간이 급할 때 ETL↑ (시간 단축↓, 단 블러↑ / SNR↓ / SAR↑ 경향)',
      downFactors: '미세 구조의 선명도가 최우선이거나 SAR 경고가 뜰 때 ETL↓'
    },
    {
      num: '09',
      name: 'Flow Compensation (GMN)',
      ko: '흐름 보정 (Gradient Moment Nulling)',
      definition: '흐르는 혈액(피)이나 뇌척수액(CSF)의 움직임으로 인한 아티팩트 보정 기법',
      analogy: '📷 "흔들린 사진 손떨림 보정" → 피·뇌척수액 줄무늬를 잡아주지만 셔터 시간(TE)이 살짝 길어짐!',
      whyPoints: [
        '왜 켜면 흐림(줄무늬)↓? 일정한 속도로 움직이는 스핀의 위상 누적(Phase shift)을 역방향 보정 그라디언트로 상쇄해 줄무늬(Ghosting)를 줄여줍니다.',
        '왜 TE↑? 보정용 그라디언트 로브를 추가로 더 넣어야 해서 에코를 듣는 시간(최소 TE)이 길어집니다.'
      ],
      principle: '경사자장 내에서 움직이는 스핀은 정지한 스핀보다 위상이 밀립니다. GMN은 속도 성분을 상쇄하는 그라디언트를 추가해 제자리 신호로 맞춰줍니다.',
      upFactors: 'C-Spine, 뇌기저부, MRCP, 조영 후 뇌영상 등 혈류/CSF 박동 아티팩트가 큰 부위에 ON',
      downFactors: '최단 TE 확보가 필수이거나 흐름 영향이 적은 부위에서는 OFF'
    },
    {
      num: '10',
      name: 'B1+rms (Max B1+rms)',
      ko: '시간 평균 RF 자기장 세기',
      definition: '환자에게 인가되는 RF 자기장(B1+)의 시간 평균 실효치 (단위: µT)',
      analogy: '🛡️ "임플란트 RF 파워 안전선" → 체내 금속/삽입물 가열을 막는 절대 기준선!',
      whyPoints: [
        '왜 중요한가? 체중 의존적인 SAR과 달리 장비가 쏘는 순수 RF 자기장 세기 자체를 나타내므로, 최신 조건부 MRI 안전(MR Conditional) 임플란트 제조사에서 안전 허용 기준으로 가장 많이 사용합니다.'
      ],
      principle: 'Flip angle이 크고 단위 시간당 RF 펄스 개수가 많을수록 평균 RF 강도(B1+rms)가 높아져 체내 임플란트 유도 가열 위험이 커집니다.',
      upFactors: '큰 Flip angle, 짧은 TR, 높은 ETL/TSE 펄스',
      downFactors: '임플란트 허용치 초과 위험 시: Flip angle↓, TR↑, ETL↓, 가변 Refocusing 사용 (임플란트가 B1+rms 한계를 주면 최우선 준수!)'
    }
  ],

  // 2. 콘솔 실전 파라메타 14종 쉬운 가이드
  console14Params: [
    { id: 1, name: 'ACQ Matrix (M×P)', sub: '획득 매트릭스', what: '사진의 픽셀 격자 수 (M=주파수, P=위상 방향 줄 수)', principle: 'P줄을 더 많이 읽을수록(k-space 선 더 채움) 격자가 촘촘해짐', up: '해상도↑, 스캔시간↑(특히 P), SNR↓', down: '스캔시간↓, SNR↑, 계단현상/거칠음↑', when: '작은 병변 보려면 P↑, 급하면 P↓(+시간절약 옵션 동원)' },
    { id: 2, name: 'Voxel (M/P/Slice) 크기', sub: 'ACQ/REC voxel MPS', what: '3D에서 한 칸(레고 블록)의 실제 크기(mm)', principle: '한 보셀 안에 있는 신호를 평균냄. 작아질수록 담는 신호량↓', up: '크게: SNR↑, 시간↓, 대신 미세 구조가 섞여 보임(부분용적효과↑)', down: '작게: 해상도↑, SNR↓, 시간↑(보통 P↑가 필요해서)', when: '미세 신경/연골은 작게, 신호가 부족한 복부/심부 조직은 적절히 크게' },
    { id: 3, name: 'Scan percentage (%)', sub: 'Partial Fourier / Half Scan', what: 'k-space를 전부 말고 일부(예: 6/8, 75~80%)만 채우고 수학적으로 보완', principle: 'k-space의 켤레 대칭성(Conjugate symmetry)을 이용해 빠르게 재구성', up: '100% 유지 시: 최고 SNR 및 선명도, 아티팩트 없음', down: '낮추면(예 6/8): 시간↓, SNR↓, 드물게 링잉(Ringing)/블러↑', when: '숨참기·소아·통증 환자 등 스캔 시간 단축이 최우선일 때' },
    { id: 4, name: 'Packages', sub: '패키지 / 스택 분할', what: '스택(Stack)/스테이션을 쪼개서 여러 묶음으로 나누어 찍기', principle: '한 번의 TR에 수용할 수 있는 슬라이스 수를 넘어설 때 여러 패키지로 분할 스캔', up: '커버리지↑ 또는 크로스토크 감소, 단 전체 스캔 시간 배수 증가(↑)', down: '1 Package로 통합 시 전체 스캔 시간 단축(↓)', when: '척추 전장이나 넓은 범위 촬영 시 (스택 간 틈/오프셋 주의)' },
    { id: 5, name: 'Slice thickness / Min. gap', sub: '절편 두께 및 간격', what: '한 장의 두께(mm)와 장 사이 간격(Gap)', principle: '슬라이스 선택 경사자장과 RF 대역폭으로 두께 결정', up: '두께↑: SNR↑, 커버리지↑ / 갭 너무 큼: 해부학 공백 생김(병변 놓칠 수 있음)', down: '두께↓: 미세 구조 잘 보임, SNR↓/시간↑ / 갭 너무 작음: 슬라이스 간 간섭(Cross-talk)으로 가장자리 어두워짐', when: '기본 Gap 10~20% 유지, 미세 병변 시 두께↓, Dynamic 범위 조절 시 무조건 두께(Thickness)로 조정!' },
    { id: 6, name: 'WFS (pix) / BW (Hz)', sub: '케미컬 시프트 관련', what: 'BW는 한 픽셀에 허용하는 주파수 폭, WFS는 물·지방이 픽셀에서 얼마나 갈라져 보이는지(픽셀 수)', principle: '물과 지방은 공명주파수가 조금 다름. BW↑이면 한 픽셀 안에 더 넓은 주파수를 담아 갈라짐(WFS)↓', up: 'BW↑ (WFS↓): 왜곡/케미컬시프트↓, 최소 TE↓(더 짧게 가능), 대신 SNR↓', down: 'BW↓ (WFS↑): SNR↑, 하지만 가장자리 이중선/왜곡↑', when: '금속/부비동/고관절, EPI 왜곡 많은 곳 → BW↑ (WFS↓)' },
    { id: 7, name: 'Full flow comp (=GMN)', sub: '흐름 보정', what: '흐르는 피·CSF 때문에 생기는 줄무늬/번짐 아티팩트를 보정', principle: '속도 성분을 상쇄시키는 보정 그라디언트 추가', up: 'ON: 흐름 아티팩트↓, 최소 TE↑ → 시간/SNR 손해 약간', down: 'OFF: 최소 TE 단축 가능, 혈류/CSF 박동 아티팩트 증가 가능', when: 'C-Spine, 뇌기저, MRCP 등 흐름 영향이 큰 부위' },
    { id: 8, name: 'TSE ETL / shot (=Turbo factor)', sub: '터보 팩터', what: '한 번의 TR에 몇 개 에코를 연달아 모을지 결정', principle: '뒤로 갈수록 신호가 T2 감쇠로 줄어 블러(Blur)가 생길 수 있음', up: 'ETL↑: 시간↓, 블러↑ / SNR↓ / SAR↑ 경향', down: 'ETL↓: 선명도↑, SAR↓, 스캔시간↑', when: '시간이 급하면 ↑, 선명도가 중요하면 과도하게 올리지 않기' },
    { id: 9, name: 'TEeff / TEequiv', sub: '유효 에코 시간', what: 'TSE에서 실제 영상 성격(대조도)을 좌우하는 유효 TE (k-space 중심부를 채우는 에코의 TE)', principle: '다중 에코 중 k-space 중앙(명암 결정)에 배치되는 에코 시점이 대조도를 지배함', up: 'TE↑: T2 강조↑ (물/염증 밝게), SNR↓ / 블러↑', down: 'TE↓: 해부학 구조 또렷, SNR↑, T2 강조는 약해짐', when: 'T2W/MRCP에서는 길게, T1W/PDW에서는 짧게 설정' },
    { id: 10, name: 'TR (Min. TR)', sub: '반복 시간', what: '한 슬라이스를 다시 자극할 때까지의 시간', principle: '종자화(T1) 회복 정도와 한 패키지 내 수용 가능한 슬라이스 수를 결정', up: 'TR↑: T1 영향↓, 시간↑, SNR 약간↑, SAR↓', down: 'TR↓: 시간↓, T1 강조↑, SAR↑', when: 'T1 강조 시 짧게, 임플란트·고체중·3T 등 가열/안전 여유가 필요할 때 TR↑' },
    { id: 11, name: 'SAR / SED', sub: '특정 흡수율 / 비에너지 용량', what: '인체가 흡수하는 순간 RF 에너지(W/kg) / 그 에너지의 총 누적치(J/kg)', principle: '짧은 TR, 큰 Flip angle, TSE(펄스 많음), 3T, 큰 체격에서 급증', up: '높아지면 환자 체온 상승 및 콘솔 스캔 제한 경고 발생', down: '낮추는 법: TR↑, Flip↓, ETL↓(또는 가변 refocusing), R↑/Scan%↓로 시간 보전', when: '3T 고자장 스캔, 발열 환자, 소아, 임플란트 환자에서 필수 모니터링' },
    { id: 12, name: 'Max B1+rms', sub: '시간 평균 RF 자기장', what: '시간 평균된 RF 자기장 세기(µT). 임플란트 허용조건이 B1+rms로 주어지는 경우가 많음', principle: 'Flip angle 크기 및 단위 시간당 RF 펄스 개수와 직접 연관', up: '임플란트 허용 한계 초과 시 스캔 불가 또는 화상 위험', down: '초과 위험 시: Flip↓, TR↑, ETL↓, 가변 refocusing, B1 Shim(Volume-selective) 사용', when: 'MR Conditional 임플란트 조건 입력 및 MRCP RF Power 에러 시' },
    { id: 13, name: 'Coil Power / PNS level / dB/dt', sub: '말초신경 자극 & 코일 전력', what: 'Coil Power: 보낸 RF 전력 / PNS level (dB/dt): 그라디언트가 빠르게 변할 때 말초신경이 찌릿할 수 있어 제한', principle: '급격한 경사자장 변화(Slew rate)가 인체 말초신경에 유도전류를 발생시킴', up: '공격적인 EPI/고속 시퀀스에서 환자 근육 떨림·찌릿함 유발', down: '줄이는 법: 공격적인 Slew rate / Echo spacing 완화, Gradient mode를 "Normal / Whisper" 또는 "Quiet/Soft" 옵션 적용', when: '환자가 찌릿거림(PNS)을 호소하거나 콘솔 dB/dt 제한 경고 시' },
    { id: 14, name: 'Sound Pressure Level (dB)', sub: '검사 소음 레벨', what: '빠른 그라디언트 코일 구동 시 로렌츠 힘으로 발생하는 기계적 소음(dB)', principle: '경사자장 전환이 빠르고 강할수록 소음 증가', up: '환자 불안감 및 청각 피로 증가', down: '관리: 귀마개 + 헤드폰 기본 착용, 필요 시 "Quiet / Whisper" 시퀀스 사용', when: '소아, 노약자, 청각 예민 환자(Hearing loss 등) 검사 시' }
  ],

  // 3. 상황별 실전 레시피 4선 & 핵심 공식
  recipes4: [
    {
      code: 'A',
      title: '미세 병변 / 관 구조가 목표일 때',
      subtitle: '고해상도 정밀 스캔 레시피 (내이도, 뇌하수체, 연골, 담췌관 등)',
      color: '#38bdf8',
      steps: [
        { label: '해상도 우선', action: 'Voxel↓ (작게), P-매트릭스↑ (촘촘하게)' },
        { label: '시간 보정', action: '늘어난 시간을 잡기 위해 ETL↑ 또는 Scan%↓ / 평행영상(R)↑' },
        { label: '왜곡 억제', action: 'BW↑ (WFS↓)로 경계선 화학적 이동 왜곡 최소화' },
        { label: 'SNR 부족 타협', action: '노이즈가 심하면 NEX(NSA)↑ 또는 두께(Thickness)를 약간↑ 타협' }
      ]
    },
    {
      code: 'B',
      title: '환자가 움직여요 / 숨참기가 짧아요',
      subtitle: '초고속 스캔 & 모션 억제 레시피 (응급, 소아, 호흡곤란 복부)',
      color: '#10b981',
      steps: [
        { label: '시간 최우선 단축', action: 'ETL↑, Scan%↓ (Partial Fourier), 평행영상 가속(R)↑, P-매트릭스↓' },
        { label: 'Readout 단축 보너스', action: 'BW↑로 에코 수집(Readout) 시간을 짧게 → 움직임 왜곡도 함께 감소↓' },
        { label: '흐름 줄무늬 억제', action: 'Flow comp (GMN) ON (단, 최소 TE가 약간 길어지는 점 감안)' },
        { label: '방사형/호흡 기법', action: 'BLADE / MultiVane / PROPELLER 활용 또는 MRCP 시 Thickness 조정' }
      ]
    },
    {
      code: 'C',
      title: '금속 / 공기 인접 부위 왜곡이 심할 때',
      subtitle: 'Susceptibility 아티팩트 극복 레시피 (척추 고정물, 인공관절, 부비동)',
      color: '#f59e0b',
      steps: [
        { label: '대역폭 & 두께 조절', action: 'BW↑ (대폭 확대), Slice 두께↓ (얇게 썰어 복셀 내 위상 분산 감소)' },
        { label: '시퀀스 변경', action: 'GRE/EPI 대신 반드시 180° 재초점 펄스가 있는 TSE/FSE 기반 사용!' },
        { label: '지방 억제 변경', action: '자장 불균일에 민감한 주파수 FatSat(SPIR) 대신 STIR 또는 Dixon 사용 (단, 조영 후에는 STIR 금지 → Dixon 활용)' },
        { label: '전용 금속 기법', action: 'Philips: O-MAR / Siemens: WARP 또는 SEMAC / GE: MAVRIC SL 적용' }
      ]
    },
    {
      code: 'D',
      title: 'SAR / B1+rms 제한 경고가 뜰 때 (3T, 임플란트)',
      subtitle: 'RF 열 에너지 & 안전 한계 준수 레시피',
      color: '#f43f5e',
      steps: [
        { label: 'RF 펄스 에너지 감소', action: 'TR↑ (연장), Flip angle↓ (축소), ETL↓ / 가변 Refocusing 사용' },
        { label: '스캔 시간 유지', action: 'TR 연장으로 늘어난 시간은 R↑ (평행영상) 및 Scan%↓로 상쇄하여 유지' },
        { label: 'B1 Shim 변경', action: 'System → B1 Shim mode → TrueForm에서 "Volume-selective"로 변경' },
        { label: '절대 원칙', action: '체내 임플란트가 Max B1+rms 한계를 제시하면 그 수치를 최우선으로 준수!' }
      ]
    }
  ],

  coreFormulas: [
    {
      title: '스캔 시간 (Scan Time) 결정 공식',
      formula: '스캔 시간 ≈ [ TR × (위상선수 P × NEX) ] / (ETL × R) × Partial Fourier 계수',
      tip: '👉 시간 단축 3대 무기: ETL↑, 가속팩터(R)↑, Scan%(Partial Fourier)↓ (또는 P-매트릭스↓, NEX↓)'
    },
    {
      title: '신호대잡음비 (SNR) 핵심 관계',
      formula: 'SNR ∝ Voxel 부피 × √(NEX) / √(BW × R)',
      tip: '👉 Voxel↑, BW↓, NEX↑ → SNR↑ 상승! (대신 해상도 저하·화학적 이동 왜곡↑·스캔 시간↑ 등 반대 효과 존재)'
    },
    {
      title: '왜곡(Chemical Shift)과 선명도(Resolution) 관계',
      formula: '왜곡 억제: BW↑ → WFS↓  |  선명도 향상: Voxel↓, Matrix↑',
      tip: '👉 콘트라스트(TR/TE/TI)를 먼저 잡고, 나머지는 [해상도 vs SNR vs 스캔 시간]의 삼각 줄다리기입니다!'
    }
  ],

  // 4. T1·T2 물리 원리 & 콘트라스트 마스터
  t1t2Master: {
    tenYearOldSteps: [
      { step: 1, title: '우리 몸속 작은 자석(수소)', desc: '우리 몸엔 물(H₂O)이 많아요 → 그 안에 수소(작은 자석)가 잔뜩 들어있습니다.' },
      { step: 2, title: 'MRI 자석 안에서 줄 서기', desc: '강력한 MRI 자석 안에 들어가면 수소들이 한쪽 방향으로 슬금슬금 줄을 섭니다 (종자화).' },
      { step: 3, title: '라디오파(RF) "탁!" 쏘기', desc: '기계가 라디오파(RF)를 "탁!" 쏘면 줄 서 있던 수소들이 에너지를 먹고 옆으로 눕고 다 같이 흔들려요 (횡자화).' },
      { step: 4, title: 'T1(다시 서기)과 T2(흩어지기)', desc: 'RF를 끄면 수소들은 다시 똑바로 서려고 하고(T1 회복), 서로 맞춰 흔들리던 게 제각각 흩어져요(T2 감쇠).' },
      { step: 5, title: '코일이 듣고 영상으로 변환', desc: '이 돌아오는 신호(에코)를 안테나(코일)가 듣고 컴퓨터가 흑백 사진(영상)으로 바꿉니다!' }
    ],
    violinAnalogy: [
      { icon: '🎻', term: '프로톤 (수소 원자)', meaning: '작은 바이올린 줄' },
      { icon: '🏹', term: 'RF 펄스', meaning: '활로 바이올린 줄을 켜는 동작' },
      { icon: '🎵', term: '자기공명 신호 (Echo)', meaning: '줄이 진동하면서 나오는 소리(신호)' },
      { icon: '🎙️', term: '수신 코일 & 컴퓨터', meaning: '마이크(코일)가 소리를 듣고 → 컴퓨터가 악보(영상)로 바꿔줌' }
    ],
    t1VsT2Comparison: {
      ruleOfThumb: '💡 절대 안 틀리는 기억법: "기름은 T1(밝음), 물은 T2(밝음)" — TR="T1 손잡이", TE="T2 손잡이", TI="지우개"만 기억해도 80% 끝!',
      t1: {
        title: 'T1 강조 (T1W) — "세워지기 속도"',
        concept: '쓰러져 있던 자석 막대(수소)가 에너지를 내놓고 다시 똑바로 서는 데 걸리는 시간',
        winner: '"빨리 다시 서는 애들이 유리!" → 지방(기름) 밝음, 물(CSF) 어두움',
        why: '지방은 주변 분자 환경이 복잡하고 끈적여서 에너지를 주변에 빨리 내보내 금방 다시 잘 섭니다(짧은 T1 = 에너지 빨리 방출 = 밝음). 반면 물은 게으르게 늦게 일어나서(긴 T1) 짧은 TR을 주면 신호가 약해 어둡게 나옵니다.',
        usage: '해부학적 정상 윤곽 확인, 지방/아급성 출혈 시기 구분, 조영제(Gadolinium은 T1을 단축시켜 밝게 만듦!) 전·후 비교'
      },
      t2: {
        title: 'T2 강조 (T2W) — "흩어지기 속도"',
        concept: '서로 같은 방향으로 줄 맞춰 돌던 자석들이 서로 어긋나며 흐트러지는 시간',
        winner: '"오래 대열을 유지하며 남는 애들이 유리!" → 물(부종·염증·CSF) 밝음',
        why: '물은 분자들이 느슨하고 빠르게 움직여 서로 자기장 간섭이 적으니 맞춤이 오래 유지됩니다(긴 T2 = 신호가 오래 살아남아 밝음). 반면 고형조직은 빨리 흐트러져(짧은 T2) 긴 TE에서 어두워집니다.',
        usage: '대부분의 병변(수분 증가), 뇌부종, 염증, 종양, 낭종 스크리닝의 핵심'
      }
    },
    fourSwitches: [
      { name: '1. TR (Repetition Time, 반복시간)', role: 'T1 스위치', short: '짧게 → 조직들이 완전히 못 서고 다음 RF를 맞음 → 빨리 서는 지방만 밝아져 T1 차이 두드러짐 (=T1W)', long: '길게 → 다들 충분히 서서 T1 차이가 줄어듦 → PD / T2 쪽으로 이동' },
      { name: '2. TE (Echo Time, 에코시간)', role: 'T2 스위치', short: '짧게 → 아직 흩어지기 전이라 T2 차이가 적음 → T1 / PD 쪽', long: '길게 → 흩어지는 정도(T2 차이)가 크게 반영됨 → 물만 살아남아 밝은 T2W' },
      { name: '3. TI (Inversion Time, 역전시간)', role: '조직 지우개 (IR 계열)', short: 'STIR (짧은 TI): 지방 신호가 0(Null)을 지날 때 촬영 → 지방 완전 억제 T2 (자장 불균일에 강함, 단 조영 후 사용 금지!)', long: 'FLAIR (긴 TI, 약 1480~2500ms): 물(CSF) 신호를 0으로 지움 → 물이 밝은 T2에서 뇌척수액(CSF)만 까맣게 꺼서 뇌실 주변 백질 병변을 선명하게 관찰' },
      { name: '4. Flip Angle (플립각, 주로 GRE)', role: 'GRE T1/T2* 조절기', short: '작게 + 긴 TR, 짧은 TE → PD / T2* 강조 쪽', long: '크게 + 짧은 TR, 짧은 TE → T1 효과 극대화(↑) (빨리 서는 조직 유리)' }
    ],
    fourCellTable: [
      { target: 'T1W (T1 강조)', tr: '짧게 (Short)', te: '짧게 (Short)', switch: 'GRE 시퀀스면 Flip Angle 크게 (해부 윤곽, 지방 밝게, 조영 전·후)' },
      { target: 'T2W (T2 강조)', tr: '길게 (Long)', te: '길게 (Long)', switch: 'TSE면 ETL이 길어도 Effective TE(유효 TE)를 길게 설정 (부종·염증 찾기)' },
      { target: 'PDW (양자밀도)', tr: '길게 (Long)', te: '짧게 (Short)', switch: '해상도↑ 필요 시 높은 SNR 보완 (반월판 연골, 관절 구조 평가)' },
      { target: 'T2 FLAIR', tr: '길게 (Long)', te: '길게 (Long)', switch: 'TI(역전시간)로 CSF(뇌척수액)만 Null(0)로 소거 (백질 병변은 밝게 유지)' }
    ],
    fieldChecklist10: [
      '1. 기름 밝게? → T1 (짧은 TR · 짧은 TE / GRE는 큰 FA)',
      '2. 물(염증·부종) 밝게? → T2 (긴 TR · 긴 TE / FLAIR는 여기서 CSF만 끔)',
      '3. 해상도 올리면 SNR은 무조건 떨어진다 (얇게·빽빽하게 할수록 노이즈↑).',
      '4. 시간이 모자라면: 평행영상(R)↑ · ETL↑ · 위상매트릭스(P)↓ · NEX↓ (단, SNR 저하 및 블러 감수).',
      '5. 왜곡(금속·공기) 심하면: BW↑(SNR↓ 감수), 평행영상↑, 두께↓, TSE 기반(O-MAR/SEMAC) 사용.',
      '6. SAR 경고 뜨면: Refocus angle↓, ETL↓, TR↑, 슬라이스군 분할, Flip angle↓.',
      '7. 3T 특성: 1.5T보다 T1이 길어지고 T2가 조금 짧아짐 → T1W는 TR을 좀 더 길게 잡고, FatSat 불균일 및 T2* 왜곡에 더 예민함.',
      '8. FLAIR 설정: TI는 CSF 널(Null) 포인트에 맞춤 (벤더·자장별 프리셋 신뢰).',
      '9. STIR vs FatSat: 자장이 불균일하면 STIR이 안전하지만 SNR이 낮고, 조영제 투여 후에는 조영 증강된 병변까지 같이 지워버리므로 조영 후에는 절대 STIR 사용 금지!',
      '10. Effective TE(유효 TE)가 TSE T2 콘트라스트의 실세이다.'
    ]
  },

  // 5. Dixon 4종 영상 원리 & 제조사별 시퀀스 명칭 일람표
  dixonFourImages: [
    {
      code: '1️⃣ W (Water Only)',
      title: '수분 신호 영상 (Fat Suppressed 역할)',
      badge: 'Water 강조 → 병변 밝게',
      desc: 'Water만 남기고 지방(Fat) 신호를 완벽히 제거한 영상으로, Fat Suppression(지방 억제) 효과와 동일합니다.',
      clinical: '염증, 부종, 종양, 낭종 등 수분이 많은 병변이 밝게(High signal) 보이며, 보통 T2 FS 또는 조영 후 T1 FS 역할로 가장 중요하게 사용됩니다. (Non-CE Extremity Mass 마킹 기준 영상!)'
    },
    {
      code: '2️⃣ F (Fat Only)',
      title: '지방 신호 영상',
      badge: 'Fat 강조 → 지방이 밝게',
      desc: 'Fat만 남기고 Water 신호를 제거한 영상입니다.',
      clinical: '지방조직, 피하지방, 골수강 내 정상 지방 신호나 지방종(Lipoma)이 선명히 보이며 보통 T1과 유사한 콘트라스트 느낌을 줍니다.'
    },
    {
      code: '3️⃣ In (In-phase)',
      title: '동상 영상 (물 + 지방 합산)',
      badge: 'In = 둘이 합쳐져서 밝고 깨끗함',
      desc: '물(Water)과 지방(Fat) 스핀의 위상이 일치하여 두 신호가 서로 더해지는 상태입니다.',
      clinical: '해부학적 구조가 밝고 깨끗하게 보이며, T2 Dixon Coronal의 In-phase 영상이 기존 T2 Coronal과 유사하여 Extremity에서 기존 T2 COR을 대체합니다.'
    },
    {
      code: '4️⃣ Out (Opposed-phase)',
      title: '역상 영상 (물 - 지방 상쇄)',
      badge: 'Out = 서로 상쇄 → 지방 섞인 부위 어두워짐',
      desc: '물과 지방 스핀의 위상이 180° 반대여서 두 신호가 서로 상쇄되는 상태입니다.',
      clinical: '한 복셀 안에 물과 미세 지방이 섞여 있는 부위(지방간, 부신 선종 등)에서 신호가 뚝 떨어져 어둡게 보이며(Signal drop), 물-지방 경계면에 검은 테두리(India ink artifact)가 나타납니다.'
    }
  ],

  vendorSequenceTable: [
    { category: '2D 고속 스핀 에코 (Fast SE)', siemens: 'TSE (Turbo SE)', philips: 'TSE (Turbo SE)', ge: 'FSE (Fast SE)', note: '다중 에코(Echo Train)를 이용해 시간을 단축한 T1, T2 표준 기법' },
    { category: '초고속 단일 호흡 스핀 에코', siemens: 'HASTE', philips: 'SSH-TSE / UFSE', ge: 'SS-FSE', note: '한 번의 RF 자극으로 영상 전체 획득 (호흡 정지 복부·MRCP 표준)' },
    { category: '3D 가변 숙임각 고해상도 TSE', siemens: 'SPACE', philips: 'VISTA (mVox)', ge: 'CUBE', note: '가변 Flip angle로 블러링과 SAR을 줄인 3D T2 / FLAIR / PD 기법' },
    { category: '기본 경사 에코 (Gradient Echo)', siemens: 'GRE / FLASH', philips: 'FFE', ge: 'GRE / SPGR', note: '그라디언트 반전을 이용한 고속 스캔 (Spoiled GRE는 T1 강조)' },
    { category: '3D 뇌 고해상도 T1 강조', siemens: 'MP-RAGE', philips: '3D TFE / 3D FFE', ge: '3D BRAVO / FSPGR', note: '뇌 구조 분석, NeuroQuant 체적 측정 및 1mm 등방성 MPR 재구성용' },
    { category: '3D 복부·유방 역동적 조영 (Dynamic T1)', siemens: 'VIBE / StarVIBE', philips: 'THRIVE / eTHRIVE', ge: 'LAVA / DISCO', note: '호흡 정지 하에 간·복부·유방·골반을 빠르게 3D 역동적 조영 스캔' },
    { category: '균형 정상 상태 경사 에코 (Balanced GRE)', siemens: 'TrueFISP / CISS', philips: 'Balanced FFE (bFFE)', ge: 'FIESTA / COSMIC', note: '혈관·뇌척수액(CSF)·장관(Enterography)에서 매우 높은 SNR 제공' },
    { category: '자화율 강조 영상 (미세출혈·철분)', siemens: 'SWI', philips: 'SWIp', ge: 'SWAN', note: '자화율 차이를 극대화해 미세 출혈, 정맥 혈관, 석회화, Nigrosome 평가' },
    { category: '물·지방 위상 분리 기법 (Dixon)', siemens: 'Dixon VIBE / TSE', philips: 'mDixon (XD)', ge: 'IDEAL / LAVA-Flex', note: '한 번 스캔으로 In, Out, Water(FS), Fat 4종 영상을 동시 생성' },
    { category: '단열 펄스 지방 억제 (Adiabatic FatSat)', siemens: 'SPAIR', philips: 'SPAIR', ge: 'ASPIR', note: '일반 SPIR/FatSat보다 B1 자장 불균일에 강해 유방·체간부에서 균일한 지방 억제' },
    { category: '모션 보정 방사형 K-space 획득', siemens: 'BLADE', philips: 'MultiVane (XD)', ge: 'PROPELLER', note: 'k-space 중심부를 회전 블레이드 형태로 반복 채워 호흡/움직임 아티팩트 억제' },
    { category: '고해상도 분할 확산강조 (DWI)', siemens: 'RESOLVE', philips: 'sEPI / MultiVane DWI', ge: 'PROPELLER DWI / FOCUS', note: '기존 단일 EPI 확산 영상의 자화율 왜곡(Distortion)을 줄인 고해상도 DWI' },
    { category: '금속 인공물 감소 기법 (MAR)', siemens: 'WARP / SEMAC', philips: 'O-MAR', ge: 'MAVRIC SL', note: '척추 유합물, 인공관절 등 금속 임플란트 주변 자기장 왜곡을 대폭 감소' }
  ]
};
