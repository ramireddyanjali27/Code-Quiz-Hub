// ─── Module Icon Mapping ─────────────────────────────────────
// Maps a roadmap module title to a meaningful coding icon so
// every card gets consistent, relevant visual language.
// Returns a cached React element, safe to drop into any subtree.
import { createElement } from 'react';
import {
  FiCoffee,
  FiDatabase,
  FiHash,
  FiGitBranch,
  FiTerminal,
  FiPackage,
  FiShare2,
  FiShield,
  FiLayers,
  FiCpu,
  FiWind,
  FiGlobe,
  FiCheckCircle,
  FiAward,
  FiGrid,
  FiTool,
  FiBookOpen,
} from 'react-icons/fi';

const RULES = [
  [/basic|introduction|^intro|setup|fundament|hello|first steps/i, FiCoffee],
  [/variable|data.?type|\bstring\b|array|tuple|dict|collection lab/i, FiDatabase],
  [/operator/i, FiHash],
  [/control|conditional|loop|flow/i, FiGitBranch],
  [/method|function/i, FiTerminal],
  [/oop|class|object|encapsulat/i, FiPackage],
  [/inherit|polymorph|abstract|interface|generic/i, FiShare2],
  [/exception|error|safe/i, FiShield],
  [/collections?\b|list|queue|stack|\bmap\b|\bset\b|framework/i, FiLayers],
  [/thread|concurren|async|parallel/i, FiCpu],
  [/lambda|stream/i, FiWind],
  [/jdbc|database|sql|mysql|persist|schema/i, FiDatabase],
  [/api|json|network|fetch|http/i, FiGlobe],
  [/test/i, FiCheckCircle],
  [/project|capstone|final/i, FiAward],
  [/dom|event|component|hook|state|routing|context|form/i, FiGrid],
  [/decorator|generator|module|package|file/i, FiTool],
];

const cache = new Map();

export const getModuleIcon = (title) => {
  if (!title) return createElement(FiBookOpen);
  if (cache.has(title)) return cache.get(title);
  const found = RULES.find(([re]) => re.test(title));
  const element = createElement(found ? found[1] : FiBookOpen);
  cache.set(title, element);
  return element;
};
