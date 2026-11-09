/**
 * [HALLYM MRI] 통합 데이터 엔트리 (src/data.js)
 * - 모든 백엔드 데이터는 역할별로 src/backend/ 폴더에 깔끔하게 분리되어 있습니다:
 *   1. src/backend/protocolsDB.js       : 6대 부위별 MRI 프로토콜 및 PACS/특별지침
 *   2. src/backend/parameterDB.js       : MRI 파라메타 원리 & 물리 가이드 (독립 분리)
 *   3. src/backend/clinicalNoticesDB.js : 교수님 특별지침, 장비 에러 대처, 외부 서버, 영어 스크립트
 *   4. src/backend/flashcardsDB.js      : 3D 학습 플래시카드
 *   5. src/backend/storageService.js    : LocalStorage CRUD 및 백엔드 데이터 매니저
 */

export {
  technologistsList,
  bodyPartsConfig,
  initialProtocolsDB as initialProtocolsData,
  parameterPrinciplesData,
  clinicalNoticesData,
  practicalToolsData,
  initialFlashcardsData,
  backendService
} from './backend/storageService';
