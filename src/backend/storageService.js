/**
 * ============================================================================
 * [HALLYM MRI BACKEND] 5. 통합 데이터 스토리지 & CRUD 매니저 (storageService.js)
 * ============================================================================
 * - 누구나 백엔드 구조와 데이터를 한눈에 파악하고 관리할 수 있도록 모듈화된 서비스 레이어
 * - LocalStorage 동기화, 프로토콜/공지/플래시카드 추가·수정·삭제, JSON 백업/복원 제공
 */

import { technologistsList, bodyPartsConfig, initialProtocolsDB } from './protocolsDB';
import { parameterPrinciplesData } from './parameterDB';
import { clinicalNoticesData, practicalToolsData } from './clinicalNoticesDB';
import { initialFlashcardsData } from './flashcardsDB';

export const STORAGE_KEYS = {
  PROTOCOLS: 'hallym_mri_protocols_2026_v3',
  NOTICES: 'hallym_mri_notices_2026_v3',
  FLASHCARDS: 'hallym_mri_flashcards_2026_v3'
};

export const backendService = {
  // 1. 프로토콜 DB 로드 및 저장
  loadProtocols() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROTOCOLS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load protocolsDB:', e);
    }
    return initialProtocolsDB;
  },

  saveProtocols(db) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROTOCOLS, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save protocolsDB:', e);
    }
  },

  // 2. 공지사항 DB 로드 및 저장
  loadNotices() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load noticesDB:', e);
    }
    return clinicalNoticesData;
  },

  saveNotices(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save noticesDB:', e);
    }
  },

  // 3. 플래시카드 DB 로드 및 저장
  loadFlashcards() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load flashcardsDB:', e);
    }
    return initialFlashcardsData;
  },

  saveFlashcards(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save flashcardsDB:', e);
    }
  },

  // 4. 전체 초기화 (원본 표준 데이터 복원)
  resetAllToDefault() {
    localStorage.removeItem(STORAGE_KEYS.PROTOCOLS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
    return {
      protocols: initialProtocolsDB,
      notices: clinicalNoticesData,
      flashcards: initialFlashcardsData
    };
  },

  // 5. 백엔드 통계 요약
  getBackendStats(protocolsDB, noticesList, flashcardsList) {
    const totalProtocols = Object.values(protocolsDB).reduce((sum, arr) => sum + arr.length, 0);
    const totalUpdates = Object.values(protocolsDB)
      .flat()
      .reduce((sum, p) => sum + (p.updates2026 ? p.updates2026.length : 0), 0);
    return {
      totalBodyParts: bodyPartsConfig.length,
      totalProtocols,
      totalUpdates,
      totalNotices: noticesList.length,
      totalCoreParams: parameterPrinciplesData.core10Params.length,
      totalConsoleParams: parameterPrinciplesData.console14Params.length,
      totalFlashcards: flashcardsList.length,
      modules: [
        { file: 'src/backend/protocolsDB.js', role: '6대 부위별 프로토콜 · 시퀀스 · PACS 규칙 · 특별지침 DB', count: `${totalProtocols}개 프로토콜` },
        { file: 'src/backend/parameterDB.js', role: '파라메타 원리 (10대 핵심 · 콘솔 14종 · 레시피 4선 · T1/T2 · Dixon)', count: '24개 파라메타 & 4종 레시피' },
        { file: 'src/backend/clinicalNoticesDB.js', role: '교수님 특별지침 · 에러 해결 · 외부서버(JLK/ISP) · 영어 안내방송', count: `${noticesList.length}건 공지 & 7대 서버` },
        { file: 'src/backend/flashcardsDB.js', role: '학생 및 신규 방사선사용 3D Q&A 플래시카드 DB', count: `${flashcardsList.length}장 카드` },
        { file: 'src/backend/storageService.js', role: 'LocalStorage 동기화 · CRUD · JSON 백업/복원 컨트롤러', count: '실시간 동기화' }
      ]
    };
  }
};

export {
  technologistsList,
  bodyPartsConfig,
  initialProtocolsDB,
  parameterPrinciplesData,
  clinicalNoticesData,
  practicalToolsData,
  initialFlashcardsData
};
