/**
 * File Discovery & Workspace Traversal Utility
 * Recursively locates UI template files (.tsx, .jsx, .html, .vue, .svelte)
 * while honoring default ignores (node_modules, .git, dist, build, .next, .turbo, .output)
 * and respecting .gitignore rules.
 */

import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.turbo',
  '.output',
]);

export const SUPPORTED_EXTENSIONS = new Set([
  '.tsx',
  '.jsx',
  '.html',
  '.vue',
  '.svelte',
]);

export interface GitIgnoreRule {
  pattern: string;
  regex: RegExp;
  negate: boolean;
  dirOnly: boolean;
  baseDir: string;
}

function globToRegex(glob: string): RegExp {
  let cleanGlob = glob;
  if (cleanGlob.startsWith('/')) {
    cleanGlob = cleanGlob.slice(1);
  }

  let regexStr = '';
  let i = 0;
  while (i < cleanGlob.length) {
    const char = cleanGlob[i];
    if (char === '*') {
      if (cleanGlob[i + 1] === '*') {
        if (cleanGlob[i + 2] === '/') {
          regexStr += '(?:.*/)?';
          i += 3;
          continue;
        } else {
          regexStr += '.*';
          i += 2;
          continue;
        }
      } else {
        regexStr += '[^/]*';
        i++;
        continue;
      }
    } else if (char === '?') {
      regexStr += '[^/]';
      i++;
      continue;
    } else if (['.', '+', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'].includes(char)) {
      regexStr += '\\' + char;
      i++;
    } else {
      regexStr += char;
      i++;
    }
  }

  if (glob.includes('/')) {
    return new RegExp(`^${regexStr}(?:/.*)?$`);
  } else {
    return new RegExp(`(?:^|/)${regexStr}(?:/.*)?$`);
  }
}

export function parseGitIgnore(content: string, baseDir: string): GitIgnoreRule[] {
  const rules: GitIgnoreRule[] = [];
  const lines = content.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    let negate = false;
    if (line.startsWith('!')) {
      negate = true;
      line = line.slice(1).trim();
    }

    let dirOnly = false;
    if (line.endsWith('/')) {
      dirOnly = true;
      line = line.slice(0, -1);
    }

    if (!line) continue;

    const regex = globToRegex(line);
    rules.push({
      pattern: line,
      regex,
      negate,
      dirOnly,
      baseDir: path.resolve(baseDir),
    });
  }

  return rules;
}

export function loadGitIgnoreRules(startDir: string): GitIgnoreRule[] {
  const rules: GitIgnoreRule[] = [];
  let curr = path.resolve(startDir);

  while (true) {
    const gitignorePath = path.join(curr, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      try {
        const content = fs.readFileSync(gitignorePath, 'utf-8');
        rules.push(...parseGitIgnore(content, curr));
      } catch {
        // Ignore unreadable .gitignore files
      }
    }
    const gitDir = path.join(curr, '.git');
    const parent = path.dirname(curr);
    if (fs.existsSync(gitDir) || parent === curr) {
      break;
    }
    curr = parent;
  }

  return rules;
}

export function isIgnored(
  targetPath: string,
  isDir: boolean,
  rules: GitIgnoreRule[] = []
): boolean {
  const baseName = path.basename(targetPath);
  if (isDir && DEFAULT_IGNORED_DIRS.has(baseName)) {
    return true;
  }

  let ignored = false;
  for (const rule of rules) {
    const rel = path.relative(rule.baseDir, targetPath).replace(/\\/g, '/');
    if (rel.startsWith('..')) continue;

    if (rule.dirOnly && !isDir) continue;

    const targetToTest = rule.pattern.includes('/') ? rel : baseName;
    if (rule.regex.test(targetToTest)) {
      ignored = !rule.negate;
    }
  }

  return ignored;
}

export function getWorkspaceDisplayName(targetPath: string): string {
  try {
    const pkgPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      if (pkg.name) {
        return pkg.name;
      }
    }
  } catch {
    // Ignore error reading package.json
  }
  return path.basename(path.resolve(targetPath)) || targetPath;
}

export function findTargetFiles(
  target: string,
  options: { rules?: GitIgnoreRule[]; fileList?: string[] } = {}
): string[] {
  const fileList = options.fileList || [];
  if (!fs.existsSync(target)) return fileList;

  const stat = fs.statSync(target);
  if (stat.isFile()) {
    const ext = path.extname(target).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(ext)) {
      fileList.push(path.resolve(target));
    }
    return fileList;
  }

  const rootRules = options.rules || loadGitIgnoreRules(target);

  function walk(currentDir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    let localRules = rootRules;
    const localGitIgnore = path.join(currentDir, '.gitignore');
    if (currentDir !== target && fs.existsSync(localGitIgnore)) {
      try {
        const content = fs.readFileSync(localGitIgnore, 'utf-8');
        localRules = [...rootRules, ...parseGitIgnore(content, currentDir)];
      } catch {
        // Ignore unreadable .gitignore
      }
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORED_DIRS.has(entry.name)) {
          continue;
        }
        if (isIgnored(fullPath, true, localRules)) {
          continue;
        }
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!SUPPORTED_EXTENSIONS.has(ext)) {
          continue;
        }
        if (isIgnored(fullPath, false, localRules)) {
          continue;
        }
        fileList.push(fullPath);
      }
    }
  }

  walk(target);
  return fileList;
}
