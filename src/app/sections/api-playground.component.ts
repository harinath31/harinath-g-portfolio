import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, Subject, concat, map, of, switchMap, timer } from 'rxjs';
import { ACHIEVEMENTS, JOBS, PROFILE, PROJECTS, SKILLS } from '../data/resume';
import { CodeBlockComponent, CodeLine, Token } from '../shared/code-block.component';

interface Endpoint { path: string; body: () => unknown; }

const ENDPOINTS: Endpoint[] = [
  {
    path: '/api/harinath',
    body: () => ({
      name: PROFILE.name,
      title: PROFILE.title,
      experienceYears: PROFILE.experienceYears,
      current: { role: PROFILE.currentRole, company: PROFILE.company, teamSize: 4 },
      location: PROFILE.location,
      stack: ['C#', 'ASP.NET Web API', 'Angular', 'Flutter'],
      achievements: ACHIEVEMENTS,
      openToWork: true,
    }),
  },
  { path: '/api/harinath/experience', body: () => JOBS.map(({ role, period }) => ({ role, company: PROFILE.company, period })) },
  { path: '/api/harinath/skills', body: () => Object.fromEntries(SKILLS.map((g) => [g.key, g.items])) },
  { path: '/api/harinath/projects', body: () => PROJECTS.map(({ name, tags }) => ({ name, tags })) },
];

/** Turns any JSON value into highlighted code lines. */
function toJsonLines(value: unknown): CodeLine[] {
  const lines: CodeLine[] = [];
  const pad = (d: number) => '  '.repeat(d);
  const scalar = (v: unknown): Token =>
    typeof v === 'string' ? [JSON.stringify(v), 's'] : typeof v === 'number' ? [String(v), 'n'] : [String(v), 'kw'];

  const walk = (v: unknown, depth: number, prefix: Token[], comma: string) => {
    if (Array.isArray(v) && v.every((x) => typeof x !== 'object')) {
      const toks: Token[] = [...prefix, ['[']];
      v.forEach((x, i) => toks.push(scalar(x), [i < v.length - 1 ? ', ' : '']));
      lines.push([...toks, [']' + comma]]);
    } else if (Array.isArray(v)) {
      lines.push([...prefix, ['[']]);
      v.forEach((x, i) => walk(x, depth + 1, [[pad(depth + 1)]], i < v.length - 1 ? ',' : ''));
      lines.push([[pad(depth) + ']' + comma]]);
    } else if (v && typeof v === 'object') {
      const entries = Object.entries(v);
      lines.push([...prefix, ['{']]);
      entries.forEach(([k, x], i) =>
        walk(x, depth + 1, [[pad(depth + 1)], [JSON.stringify(k), 'p'], [': ']], i < entries.length - 1 ? ',' : ''),
      );
      lines.push([[pad(depth) + '}' + comma]]);
    } else {
      lines.push([...prefix, scalar(v), [comma]]);
    }
  };
  walk(value, 0, [], '');
  return lines;
}

type Result =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'done'; lines: CodeLine[]; ms: number; bytes: number };

@Component({
  selector: 'app-api-playground',
  imports: [AsyncPipe, CodeBlockComponent],
  template: `
    <section id="api" aria-labelledby="api-title">
      <h2 id="api-title" class="file-label">api.http — try it</h2>
      <div class="panel">
        <form class="bar" (submit)="$event.preventDefault(); send(path.value)">
          <span class="method">GET</span>
          <label class="sr-only" for="endpoint">Endpoint</label>
          <select id="endpoint" #path>
            @for (e of endpoints; track e.path) {
              <option [value]="e.path">{{ e.path }}</option>
            }
          </select>
          <button type="submit" class="btn primary">Send</button>
        </form>
        @let r = result$ | async;
        <div class="response" aria-live="polite">
          @if (r && r.state === 'done') {
            <p class="status">
              <span class="ok">200 OK</span> · application/json · {{ r.ms }} ms · {{ r.bytes }} B
            </p>
            <app-code-block [lines]="r.lines" [numbered]="false" />
          } @else if (r && r.state === 'loading') {
            <p class="hint">Sending request<span class="dots"></span></p>
          } @else {
            <p class="hint">Pick an endpoint and hit Send to fetch my resume as JSON.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 14px; border-bottom: 1px solid var(--border); }
    .method {
      padding: 8px 12px;
      border-radius: 4px;
      background: var(--green);
      color: var(--on-accent);
      font: 700 13px var(--mono);
    }
    select {
      flex: 1 1 240px;
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg);
      color: var(--text);
      font: 13px var(--mono);
    }
    .response { min-height: 120px; }
    .hint { margin: 0; padding: 28px 18px; font: 13px var(--mono); color: var(--muted); }
    .status { margin: 0; padding: 14px 18px 0; font: 13px var(--mono); color: var(--muted); }
    .ok { color: var(--green); font-weight: 700; }
    .dots::after { content: '...'; animation: dots 1s steps(4) infinite; display: inline-block; width: 0; overflow: hidden; vertical-align: bottom; }
    @keyframes dots { to { width: 1.6em; } }
  `,
})
export class ApiPlaygroundComponent {
  readonly endpoints = ENDPOINTS;
  private readonly send$ = new Subject<string>();

  readonly result$: Observable<Result> = concat(
    of<Result>({ state: 'idle' }),
    this.send$.pipe(
      switchMap((path) => {
        const ms = 120 + Math.round(Math.random() * 260);
        const body = (ENDPOINTS.find((e) => e.path === path) ?? ENDPOINTS[0]).body();
        return concat(
          of<Result>({ state: 'loading' }),
          timer(ms).pipe(
            map((): Result => ({ state: 'done', lines: toJsonLines(body), ms, bytes: JSON.stringify(body).length })),
          ),
        );
      }),
    ),
  );

  send(path: string): void {
    this.send$.next(path);
  }
}
