import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, concat, interval, map, of, take } from 'rxjs';
import { PROFILE } from '../data/resume';
import { CodeBlockComponent, CodeLine } from '../shared/code-block.component';

const CODE: CodeLine[] = [
  [['// Harinath.cs', 'c']],
  [['public class ', 'kw'], ['Harinath', 'ty'], [' : '], ['SeniorSoftwareEngineer', 'ty']],
  [['{']],
  [['    public string ', 'kw'], ['Location', 'p'], [' => '], ['"Bengaluru, IN"', 's'], [';']],
  [['    public double ', 'kw'], ['Experience', 'p'], [' => '], ['4.5', 'n'], ['; '], ['// years', 'c']],
  [['    public string', 'kw'], ['[] '], ['Stack', 'p'], [' => ['], ['".NET"', 's'], [', '], ['"Angular"', 's'], [', '], ['"Flutter"', 's'], ['];']],
  [['    public string ', 'kw'], ['Role', 'p'], [' => '], ['"Team Lead @ Syncfusion"', 's'], [';']],
  [['']],
  [['    public ', 'kw'], ['Task', 'ty'], ['<'], ['Impact', 'ty'], ['> '], ['BuildAsync', 'f'], ['() => '], ['Ship', 'f'], ['(web, mobile);']],
  [['}']],
];

/** Cuts the code to the first `n` characters, keeping token colours intact. */
function sliceCode(n: number): CodeLine[] {
  const out: CodeLine[] = [];
  let left = n;
  for (const line of CODE) {
    if (left <= 0) break;
    const cut: CodeLine = [];
    for (const [text, kind] of line) {
      if (left <= 0) break;
      cut.push([text.slice(0, left), kind]);
      left -= text.length;
    }
    out.push(cut);
    left -= 1; // newline
  }
  return out;
}

const TOTAL = CODE.reduce((sum, l) => sum + l.reduce((s, t) => s + t[0].length, 0) + 1, 0);

@Component({
  selector: 'app-hero',
  imports: [AsyncPipe, CodeBlockComponent],
  template: `
    <section id="hero" class="hero" aria-labelledby="hero-title">
      <div class="intro">
        <p class="hello">// hello, world — I build for web &amp; mobile</p>
        <h1 id="hero-title">{{ p.name }}</h1>
        <p class="role">{{ p.title }} · .NET · Angular · Flutter</p>
        <p class="summary">
          {{ p.experienceYears }} years building scalable web and Android/iOS applications. Currently
          {{ p.currentRole }} at {{ p.company }}, shipping BoldDesk across Angular and Flutter.
        </p>
        <div class="actions">
          <a class="btn primary" href="#projects">View projects</a>
          <a class="btn" href="#contact">Contact me</a>
          <a class="link" [href]="p.github" target="_blank" rel="noopener">github ↗</a>
          <a class="link" [href]="p.linkedin" target="_blank" rel="noopener">linkedin ↗</a>
        </div>
      </div>
      <div class="editor panel">
        <div class="panel-head">Harinath.cs</div>
        <app-code-block [lines]="(typed$ | async) ?? []"><span class="cursor" aria-hidden="true"></span></app-code-block>
      </div>
    </section>
  `,
  styles: `
    .hero { display: flex; flex-wrap: wrap; gap: 40px; align-items: center; min-height: 52vh; }
    .intro { flex: 1 1 340px; min-width: 0; }
    .hello { margin: 0; font-family: var(--mono); font-size: 13px; color: var(--green); }
    h1 {
      margin: 12px 0 8px;
      font-size: clamp(40px, 6vw, 68px);
      line-height: 1.05;
      letter-spacing: -1.5px;
      color: var(--heading);
    }
    .role { margin: 0; font-family: var(--mono); font-size: 15px; color: var(--accent); }
    .summary { margin: 18px 0 0; max-width: 520px; color: var(--muted); }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; align-items: center; }
    .link { font-family: var(--mono); font-size: 13px; color: var(--muted); padding: 12px 8px; }
    .link:hover { color: var(--accent); }
    .editor { flex: 1 1 440px; min-width: 0; min-height: 330px; }
    .cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      margin-left: 62px;
      background: var(--accent);
      animation: blink 1s steps(1) infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
  `,
})
export class HeroComponent {
  readonly p = PROFILE;

  readonly typed$: Observable<CodeLine[]> = matchMedia('(prefers-reduced-motion: reduce)').matches
    ? of(CODE)
    : concat(
        of(sliceCode(0)),
        interval(16).pipe(
          take(Math.ceil(TOTAL / 2)),
          map((i) => sliceCode((i + 1) * 2)),
        ),
      );
}
