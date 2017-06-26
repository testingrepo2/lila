import { Prop, StoredProp, StoredBooleanProp } from 'common';

export interface Eval {
  cp?: number;
  mate?: number;
}

export interface WorkerOpts {
  variant: VariantKey;
  threads: false | (() => number | string);
  hashSize: false | (() => number | string);
  minDepth: number;
}

export interface Work {
  path: string;
  maxDepth: number;
  multiPv: number;
  ply: number;
  threatMode: boolean;
  initialFen: string;
  currentFen: string;
  moves: string[];
  emit: (ev: Tree.ClientEval) => void;
}

export interface PoolOpts {
  pnacl: string | false;
  wasm: string | false;
  asmjs: string;
  onCrash: (err: any) => void;
}

export interface CevalOpts {
  storageKeyPrefix?: string;
  failsafe: boolean;
  multiPvDefault?: number;
  possible: boolean;
  variant: Variant;
  onCrash: (err: any) => void;
  emit: (ev: Tree.ClientEval) => void;
  setAutoShapes: () => void;
}

export interface Hovering {
  fen: string;
  uci: string;
}

export interface Started {
  path: string;
  steps: Step[];
  threatMode: boolean;
}

export interface CevalController {
  goDeeper: () => void;
  canGoDeeper: () => boolean;
  effectiveMaxDepth: () => number;
  pnaclSupported: boolean;
  wasmSupported: boolean;
  allowed: Prop<boolean>;
  enabled: Prop<boolean>;
  possible: boolean;
  isComputing: () => boolean;
  variant: Variant;
  setHovering: (fen: string, uci: string | null) => void;
  multiPv: StoredProp<number>;
  start: (path: string, steps: Step[], threatMode: boolean, deeper: boolean) => void;
  stop: () => void;
  threads: StoredProp<number>;
  hashSize: StoredProp<number>;
  infinite: StoredBooleanProp;
  hovering: Prop<Hovering | null>;
  toggle: () => void;
  curDepth: () => number;
  isDeeper: () => boolean;
  destroy: () => void
}

export interface ParentController {
  getCeval: () => CevalController;
  nextNodeBest: () => boolean;
  disableThreatMode?: Prop<Boolean>;
  toggleThreatMode: () => void;
  toggleCeval: () => void;
  gameOver: () => boolean;
  mandatoryCeval?: Prop<boolean>;
  showEvalGauge: Prop<boolean>;
  currentEvals: () => NodeEvals;
  ongoing: boolean;
  playUci(uci: string): void;
  getOrientation(): Color;
  threatMode: boolean;
  node: Tree.Node;
  showComputer: () => boolean;
}

export interface NodeEvals {
  client?: Tree.ClientEval
  server?: Tree.ServerEval
}

export interface Step {
  ply: number;
  fen: string;
  san?: string;
  uci?: string;
  threat?: Tree.ClientEval;
  ceval?: Tree.ClientEval;
}
