import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Subject, map, scan, startWith, tap } from 'rxjs';
import { PROFILE, SECTIONS } from '../data/resume';
import { ScrollSpyService } from '../services/scroll-spy.service';
import { ThemeService } from '../services/theme.service';

interface Entry { cmd?: string; out: string[]; tone?: 'ok' | 'err'; }
type Action = { clear: true } | { clear?: false; entry: Entry };

const HELP = [
  'about       who I am',
  'ls          list files in this workspace',
  'open <id>   jump to a section (hero, experience, skills, projects, mobile, api, contact)',
  'resume      download my resume (PDF)',
  'theme       toggle theme · theme dark · theme light',
  'contact     how to reach me',
  'clear       clear the terminal',
];

@Component({
  selector: 'app-terminal',
  imports: [AsyncPipe],
  template: `
    <section class="terminal" aria-label="Terminal" (click)="focus()">
      <div class="head">TERMINAL <span class="hint">— type <b>help</b></span></div>
      <div class="log" #log aria-live="polite">
        @for (e of entries$ | async; track $index) {
          @if (e.cmd !== undefined) {
            <div><span class="user">harinath&#64;portfolio</span><span class="muted">:~$</span> {{ e.cmd }}</div>
          }
          @for (line of e.out; track $index) {
            <div class="out" [class.ok]="e.tone === 'ok'" [class.err]="e.tone === 'err'">{{ line }}</div>
          }
        }
      </div>
      <form class="prompt" (submit)="$event.preventDefault(); run(input.value); input.value = ''">
        <label for="term-input"><span class="user">harinath&#64;portfolio</span><span class="muted">:~$</span></label>
        <input
          id="term-input"
          #input
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          (keydown.arrowup)="recall(input, -1); $event.preventDefault()"
          (keydown.arrowdown)="recall(input, 1); $event.preventDefault()"
        />
      </form>
    </section>
  `,
  styles: `
    .terminal {
      border-top: 1px solid var(--border);
      background: var(--panel);
      padding: 10px 20px 12px;
      font: 13px/1.7 var(--mono);
      cursor: text;
    }
    .head { font-size: 11px; letter-spacing: 2px; color: var(--muted); margin-bottom: 4px; }
    .hint { letter-spacing: 0; }
    .log { max-height: 180px; overflow-y: auto; }
    .user { color: var(--green); }
    .muted { color: var(--muted); }
    .out { color: var(--muted); white-space: pre-wrap; }
    .out.ok { color: var(--text); }
    .out.err { color: var(--accent2); }
    .prompt { display: flex; gap: 8px; align-items: center; }
    input {
      flex: 1;
      min-width: 0;
      min-height: 32px;
      border: 0;
      background: transparent;
      color: var(--text);
      font: inherit;
      caret-color: var(--accent);
    }
    input:focus { outline: none; }
  `,
})
export class TerminalComponent {
  private readonly theme = inject(ThemeService);
  private readonly spy = inject(ScrollSpyService);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly logRef = viewChild<ElementRef<HTMLDivElement>>('log');
  private readonly commands$ = new Subject<string>();
  private history: string[] = [];
  private cursor = 0;

  readonly entries$ = this.commands$.pipe(
    map((raw) => this.exec(raw.trim())),
    startWith<Action>({ entry: { out: ['Welcome! Type help to see what this terminal can do.'] } }),
    scan((log: Entry[], a: Action) => (a.clear ? [] : [...log, a.entry]), []),
    tap(() => setTimeout(() => this.logRef()?.nativeElement.scrollTo({ top: 1e6 }))),
  );

  run(raw: string): void {
    if (raw.trim()) {
      this.history.push(raw.trim());
      this.cursor = this.history.length;
    }
    this.commands$.next(raw);
  }

  recall(input: HTMLInputElement, step: number): void {
    if (!this.history.length) return;
    this.cursor = Math.min(this.history.length, Math.max(0, this.cursor + step));
    input.value = this.history[this.cursor] ?? '';
  }

  focus(): void {
    if (!window.getSelection()?.toString()) this.inputRef()?.nativeElement.focus({ preventScroll: true });
  }

  private exec(cmd: string): Action {
    const [name, arg] = cmd.toLowerCase().split(/\s+/);
    const ok = (out: string[]): Action => ({ entry: { cmd, out, tone: 'ok' } });
    switch (name) {
      case '':
        return { entry: { cmd, out: [] } };
      case 'help':
        return ok(HELP);
      case 'about':
      case 'whoami':
        return ok([`${PROFILE.name} — ${PROFILE.title} (${PROFILE.currentRole} @ ${PROFILE.company})`, PROFILE.summary]);
      case 'ls':
        return ok([SECTIONS.map((s) => s.file).join('   ') + '   ' + PROFILE.resume]);
      case 'open':
      case 'cd': {
        const target = SECTIONS.find((s) => s.id === arg || s.file === arg);
        if (!target) return { entry: { cmd, out: [`open: no such section '${arg ?? ''}'. Try: ls`], tone: 'err' } };
        this.spy.goTo(target.id);
        return ok([`Opening ${target.file}…`]);
      }
      case 'resume':
        window.open(PROFILE.resume, '_blank', 'noopener');
        return ok([`Downloading ${PROFILE.resume}…`]);
      case 'theme':
        if (arg === 'dark' || arg === 'light') this.theme.set(arg);
        else this.theme.toggle();
        return ok([`Theme set to ${this.theme.current}.`]);
      case 'contact':
        return ok([`email    ${PROFILE.email}`, `github   ${PROFILE.github}`, `linkedin ${PROFILE.linkedin}`]);
      case 'sudo':
        return ok(['Permission granted. Great choice — let’s talk:', PROFILE.email]);
      case 'clear':
        return { clear: true };
      default:
        return { entry: { cmd, out: [`command not found: ${name}. Type help.`], tone: 'err' } };
    }
  }
}
