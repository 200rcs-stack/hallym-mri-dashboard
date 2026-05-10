export const protocolsDB = {
  brain: [
    {
      name: 'Brain (Basic)',
      time: '15~20 Min',
      sequences: [
        'Survey',
        'T2 Axial',
        'T1 Axial',
        'T2 FLAIR',
        'SWI/P (출혈, 철분침착 평가)',
        'T1 Sagittal',
        'T2 Coronal'
      ],
      notes: 'Brain + CE + MRA + Diffusion + Perfusion 조합. 종양 진단 시 T1 SE CE 필수. Perfusion Image는 ISP로 전송하며, 2-6번 이미지만 PACS 전송. Dynamic은 Scan 5에서 조영제 주입.'
    },
    {
      name: 'Brain 3D',
      time: '15 Min',
      sequences: [
        'Brain 3D 촬영 후 MPR 재구성',
        'Coronal 1mm',
        'Sagittal 1mm'
      ],
      notes: 'Volume - BRAIN TOF. 3D TOF CAROTID는 왼쪽 24장 Clear bath 작업 후 SPIN 3번째 이미지로 MIP2, ROLL 1번째 이미지로 MIP1 생성.'
    },
    {
      name: 'Brain + Aortic + Diffusion + CE (Hearing Loss)',
      time: '30 Min',
      sequences: [
        'AAM Scout',
        'Vessel Scout COR',
        'Vessel Scout SAG',
        'T1 Ax',
        'Diffusion',
        'T2 Ax',
        'T2 FLAIR Ax',
        'T2 COR',
        'SWI',
        'Head TOF',
        'T1 SAG',
        'T2 SPC 3D Ax (Vista view)',
        'Angio 3D PRE',
        'contrast',
        'Cerebolus – CON',
        'Angio 3D POST',
        'T1 VIBE FS Ax CE',
        'T2 FLAIR Ax CE'
      ],
      notes: '청각 소실 증상 시 Aortic 스카우트 포함. 조영제: Gadolinium 15 mL.'
    },
    {
      name: 'Sella + CE',
      time: '15 Min',
      sequences: [
        'AC-PC 라인 맞추기, Center는 Sella',
        'Dynamic 시 oversampling 설정 (P-15 / A-0)',
        'T1 SPAIR Ax 7Dynamic'
      ],
      notes: '소아는 T2 Full Axial 조영 전 시행(안전조치). Dynamic 촬영은 slice 수보다 무조건 두께(Thickness)로 조정.'
    },
    {
      name: 'Orbit + CE',
      time: '15 Min',
      sequences: [
        'COR - ORBIT 여유롭게 포함 (SELLA 까지)'
      ],
      notes: '눈알 움직이지 말고 깜박이지 않게 안내. Orbit 필요 시 T1 FS Axial CE 추가.'
    },
    {
      name: 'Temporal (+ CE)',
      time: '15 Min',
      sequences: [
        'Region 있으면 diffusion 검사 진행',
        'Full 은 Brain imaging plane과 동일하게 설정'
      ],
      notes: '필요시 Diffusion 추가. 소견에 Vista view 있으면 3D T2 Vista 추가.'
    },
    {
      name: 'Brain DTI (Diffusion Tensor Imaging)',
      time: '20 Min',
      sequences: [
        'Scout',
        '3D T1 Ax (AC-PC line 정렬)',
        '32 DIR b-1000',
        '32 b-0',
        '32 b-1000',
        'ADC'
      ],
      notes: '64채널 Head coil 사용. PACS 전송: 1~6 모두 넘기기.'
    },
    {
      name: 'PNS + CE',
      time: '20 Min',
      sequences: [
        'Scout',
        'T2 COR',
        'T1 COR',
        'T2 DIXON AX',
        'T1 AX',
        'DWI',
        'T1 SPIR COR CE',
        'T1 SPIR AX CE',
        'T1 SPIR SAG CE'
      ],
      notes: ''
    },
    {
      name: 'Brain + CE (Meta2 / NSCLC)',
      time: '20 Min',
      sequences: [
        'BB (Black Blood)',
        'SPACE'
      ],
      notes: '비소세포폐암(NSCLC) 등 전이암 환자 권장 프로토콜. 홍영길 교수님 지정 BB 및 SPACE 시퀀스 활용.'
    },
    {
      name: 'Brain + CE (ethrive / skyra)',
      time: '20 Min',
      sequences: [
        'ethrive 로 검사 (T1 SE CE 지우고)',
        'skyra: T1 VIBE FS AX CE'
      ],
      notes: 'mass나 3D contrast 소견 시. cor 이미지에서 sag 1mm, sag에서 cor 1mm 만듦.'
    },
    {
      name: 'Seizure / Epilepsy / TLE',
      time: '25 Min',
      sequences: [
        'T2 TSE Coronal 지우고',
        'T2 OBL Coronal 추가',
        'FLAIR OBL Coronal 추가'
      ],
      notes: 'Slice plane: hippocampus의 long axis에 수직이 되게 세팅.'
    },
    {
      name: 'Nigrosome View (Parkinson\'s Disease)',
      time: '15 Min',
      sequences: [
        'Oblique Coronal Sagittal 획득하여 플랜'
      ],
      notes: '기준선: PC ~ Pons 끝 라인. 정상은 Swallow-tail 모양 관찰 가능.'
    },
    {
      name: 'HFS (Hemifacial Spasm) / 안면신경',
      time: '15 Min',
      sequences: [
        'HFS 전용 프로토콜 사용',
        'NS TOF Vertex (소견 나면 추가)'
      ],
      notes: 'MRA TOF 이미지: SPIN 3번째 -> MIP2 / ROLL 1번째 -> MIP1.'
    }
  ],
  'c-spine': [
    {
      name: 'Neck + CE',
      time: '20 Min',
      sequences: [
        'CE는 ETHRIVE만 하고 3D 생성'
      ],
      notes: '종괴(Mass) 여부에 따라 촬영. 조영제는 Hand Inject. Head First.'
    },
    {
      name: 'C-T-L Spine + 3D + CE',
      time: '30 Min',
      sequences: [
        'C-T-L Scout 1, 2, 3 (mobiview)',
        'L-T2 SPACE COR (3D 처방 시)',
        'L-T2 DIXON SAG (T10 중간 ~ S1 포함)',
        'L-T1 SAG',
        'L-T2 AX',
        'L-T1 AX (TR 1000 안넘게)',
        'C-T T2 DIXON SAG'
      ],
      notes: 'L-Spine T2 SPACE COR 검사 시 Femur head(대퇴골두) 반드시 포함. Contrast: Hand inject 2~3분 후 스캔.'
    },
    {
      name: 'Spine DTI',
      time: '15 Min',
      sequences: [
        'AAH Scout',
        'SAG (Brain 같이 ep2d full cover)',
        'with MT / without MT'
      ],
      notes: 'C3 BODY ~ C7 BODY 포함.'
    }
  ],
  chest: [
    {
      name: 'Breast MRI + CE + DWI',
      time: '30 Min',
      sequences: [
        'Localizer (BH)',
        'T2 AX',
        'T2 SAG LT / RT',
        'DWI (b0, b900)',
        'Contrast (Gado 2mL/sec 자동주입)',
        'T1 SPAIR Ax 7Dynamic',
        'T1 DFS AXIALLY'
      ],
      notes: '조영제: Gadolinium 2 mL/sec 자동 주입. Pre scan 완료 후 1분 10초 후 투여. 1~6Dyn Subtraction 수행 및 PACS 전송(모든 소스 전송).'
    },
    {
      name: 'Heart (Cardiac)',
      time: '45 Min',
      sequences: [
        'localizer @isocenter',
        'DefineLongaxis',
        'DefineSAX (shortaxis all)',
        'T1Map_pre / T2Map_FLASH',
        'DynamicRest / CINE_4ch / CINE_2ch / CINE_3ch / CINE_SAX',
        'TI-Scout 15M (15분 대기 필수)',
        'DE_4ch, DE_2ch, DE_SAX (지연 조영)',
        'T1Map_post'
      ],
      notes: '키/몸무게 정확히 입력 필수! 조영제 gado15 (3ml/s). SAR limit 확인.'
    }
  ],
  abdomen: [
    {
      name: 'Liver (Primovist + CE)',
      time: '25 Min',
      sequences: [
        'SCOUT',
        'T2 HASTE COR, T2 HASTE AX',
        'T1 VIBE OPP In AX',
        'T1 VIBE E-DIXON AX',
        'T1 VIBE Q-DIXON AX',
        'HISTO',
        'T1 VIBE FS AX PRE / Arterial / Portal / 50s / 3Min / 10Min / 20Min delay',
        'T2 FAST BLADE FS AX',
        'DWI b50/400/800'
      ],
      notes: '조영제: Primovist + Salin 1 mL/sec. PACS 전송 시 Scout부터 delay 이미지까지 모두 포함. MRCP 소견 시 MRCP ROLL PROTOCOL 추가.'
    },
    {
      name: 'Abdomen + CE + MRCP',
      time: '30 Min',
      sequences: [
        'SCOUT',
        'T2 HASTE COR / AX',
        'T1 VIBE OPP In / T2 LONG TE AX',
        'T1 VIBE E-DIXON / Q-DIXON AX',
        'HISTO',
        '3D MRCP-PACS ZOOMIT_SAT',
        'T1 VIBE FS AX PRE / Care bolus / Arterial / Venous / 50s / 3M / 5M',
        'MRCP RADIAL-ROLL',
        'DWI b0/100/800 + ADC'
      ],
      notes: '조영제: Gadolinium + Salin 2 mL/sec 주입. MRCP ROLL PROTOCOL 병행 가능.'
    },
    {
      name: 'Pancreas / MRCP only',
      time: '15~20 Min',
      sequences: [
        'Survey',
        'Coronal',
        'Axial',
        'Axial Heavily (T2 heavy)',
        'Dixon',
        'DWI',
        '3D GRASE (MRCP)'
      ],
      notes: '각종 Angle 피하기. 심박/호흡 트리거 동조 필수. Coronal은 심장 포함, Axial은 간/담낭/췌관 전체 포함. 3D GRASE 시 각도 주지말고 전체 포함.'
    },
    {
      name: 'Kidney & Adrenal + CE',
      time: '20 Min',
      sequences: [
        'Scout, T2 COR',
        'AX BH (3mm)',
        'T1 VIBE _bh_AX',
        'T2 HASTE AX, T2 long TE AX',
        'SAG RT or LT (마킹 필수)',
        'T1 DIXON COR PRE',
        'Care bolus (AORTA 범위)',
        'T1 VIBE DIXON COR IMME / 1mm / 3mm / 5mm W',
        'DWI (b0, b400, b800)'
      ],
      notes: '조영제: Gadolinium 2 mL/sec 주입. 손 내리고 검사. 전송 시 ADC, DWI 등 PACS로 모든 시퀀스 전송.'
    },
    {
      name: 'Enterography',
      time: '30 Min',
      sequences: [
        'Bowel check (stomach~bladder)',
        'T2 haste COR p3 / fs mbh',
        'truefisp COR bh (위아래 넓게)',
        'T2 haste fs tra mbh (꼬리쪽까지)',
        'ep2d diffusion COR b0, b800',
        'T1 VIBE dixon COR bh pre / fs COR arterial / veno',
        'T1 VIBE fs Ax upper / lower'
      ],
      notes: '장관 확장을 위해 검사 1시간 전 레디프리 희석액 1L 지속 복용. 장운동 억제용 Buscopan 0.5mg 주사제 투여. 조영제 2mL/sec.'
    }
  ],
  pelvis: [
    {
      name: 'Pelvis + CE (Female Pelvis)',
      time: '30 Min',
      sequences: [
        'Scout (Sagittal L5까지, Axial pubic symphysis 포함)',
        'T1 3D AX (kidney plane)',
        'DWI AX',
        'T1 3D enhance PRE',
        'T1 3D VIBE FS AX CE'
      ],
      notes: '큰 종괴 제외하고 촬영. Kidney Scout 별도 계획. 생식기(Vulva 병변 시) 포함. Dynamic (1,3,5분) PACS 전송.'
    },
    {
      name: 'Prostate MRI + CE',
      time: '35 Min',
      sequences: [
        'Scout, T2 SAG, T2 COR, T2 AX, T1 AX, T1 AX UP',
        'Diffusion (b0, b50, b400, b800) -> Center 따라가기',
        'T1 3D VIBE DIXON AX',
        'T1 AX CE'
      ],
      notes: 'SAR 경고 시 Flip Angle 조절. Diffusion/Enhance는 Center 기준 FOV 좁게 위치 P/L로 조정. Reference line 1번 허용. Pre-scan 14초 후 주입.'
    },
    {
      name: 'Rectal MRI + CE',
      time: '25 Min',
      sequences: [
        'Scout, T2 SAG, T2 COR, T2 AX',
        'T2 AX HR',
        'T2 FLAIR FS AX',
        'APC -> AX 따라가기',
        'T1 VIBE FS PRE-W',
        'DCE (Dynamic Contrast Enhancement)',
        'T1 VIBE FS POST-W',
        'DWI (b0, b100, b800)'
      ],
      notes: '조영제: Gadolinium 15mL, 2 mL/sec Auto injector. Skyra/Achieva 타이밍 맞춤. DCE는 Thickness로 시간 조정.'
    }
  ],
  knee: [
    {
      name: 'Extremity (기본 + Mass)',
      time: '15~20 Min',
      sequences: [
        'T1 COR',
        'T2 DIXON COR / AX',
        'T2 AX',
        'T1 AX',
        'T2 DIXON SAG',
        'CE: COR / AX / SAG 방향 수행'
      ],
      notes: '관절 항상 포함. T2 COR 삭제하고 T2 DIXON COR와 T1 COR 조합. 큰 종괴(Mass) 의심 시 Body coil 허용 및 DWI(b50/400/800) 필수 추가.'
    },
    {
      name: 'Extremity Upper: CE (Brachial plexus injury)',
      time: '25 Min',
      sequences: [
        'SAG 3D T2 -> Volume에서 COR, AX 재구성',
        '3D STIR COR',
        'T1 TSE COR',
        'DIXON T2 AX (C0 포함, 신경 나가는거 포함)',
        'DIXON T2 RT / LT',
        'DIXON T1 AX / COR POST CONTRAST'
      ],
      notes: '손상 의심 시 조영제 주입은 반대쪽 팔 사용.'
    },
    {
      name: 'Shoulder',
      time: '20 Min',
      sequences: [
        'PD SPIR AX',
        'T2 TSE AX',
        'PD SPIR COR',
        'T2 TSE COR / T1 TSE COR',
        'PD SPIR SAG / T2 TSE SAG'
      ],
      notes: 'Lt/Rt 구분 필수. Coronal: AC joint 포함.'
    },
    {
      name: 'Knee',
      time: '20 Min',
      sequences: [
        'Survey',
        '3D PD FS VISTA',
        'T2 TSE SAG / T1 TSE SAG',
        'T2 TSE FS AX',
        'T2 TSE OBL (ACL 평행)',
        'PD TSE COR (Medial & Lateral meniscus 평행)'
      ],
      notes: 'Lt/Rt 선택. CE는 AX, COR, SAG 다 해줌.'
    },
    {
      name: 'Foot + CE',
      time: '20 Min',
      sequences: [
        'Scout',
        'T1 SAG / T1 FS SAG',
        'T2 FS AX / T1 AX / T2 AX',
        'T2 COR / T1 COR / FS COR',
        'T1 SAG / AX / COR CE'
      ],
      notes: '발가락 2개 이상 포함.'
    },
    {
      name: 'Elbow',
      time: '15 Min',
      sequences: [
        'Survey (Scout, 위치확인용 두번째까지)',
        'Head First / Feet First 자세 확인',
        '3D Nerve View (VENC-3) - 신경평가시 추가'
      ],
      notes: 'Rt/Lt 명확히 표시. Epicondyle(상과) 기준으로 맞춰 시퀀스 조정.'
    },
    {
      name: 'Wrist',
      time: '15 Min',
      sequences: [
        'Coronal 방향 선행 촬영 (병변 탐색)',
        'Diffusion (Mass 의심시 추가)'
      ],
      notes: '병변이 불명확하면 Coronal 먼저 촬영하여 병소 위치 찾기.'
    },
    {
      name: 'TM Joint (측두하악관절)',
      time: '15 Min',
      sequences: [
        'Sagittal (Open / Closed Mouth)',
        'Coronal (Closed Mouth)'
      ],
      notes: '센터는 인중. 검사 중 침 절대 삼키지 않도록 환자 안내. 마지막 입 벌린 상태는 Sagittal만 촬영.'
    }
  ]
};
