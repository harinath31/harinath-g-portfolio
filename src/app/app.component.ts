import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { PROFILE, SECTIONS } from './data/resume';
import { ApiPlaygroundComponent } from './sections/api-playground.component';
import { ContactComponent } from './sections/contact.component';
import { ExperienceComponent } from './sections/experience.component';
import { HeroComponent } from './sections/hero.component';
import { ProjectsComponent } from './sections/projects.component';
import { SkillsComponent } from './sections/skills.component';
import { TerminalComponent } from './sections/terminal.component';
import { ScrollSpyService } from './services/scroll-spy.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    HeroComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    ApiPlaygroundComponent,
    ContactComponent,
    TerminalComponent,
  ],
  template: `
    <a class="skip" href="#hero">Skip to content</a>
    <header class="titlebar">
      <button class="icon-btn menu" type="button" aria-label="Toggle explorer" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <div class="lights" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="title">harinath-g — portfolio</div>
      <div class="actions">
        <a class="chip-btn" [href]="p.resume" download>resume.pdf ↓</a>
        <button class="chip-btn accent" type="button" (click)="theme.toggle()" [attr.aria-label]="'Switch to ' + ((theme.theme$ | async) === 'dark' ? 'light' : 'dark') + ' theme'">
          {{ (theme.theme$ | async) === 'dark' ? '☀ light' : '☾ dark' }}
        </button>
      </div>
    </header>

    <div class="workbench">
      <nav class="explorer" [class.open]="menuOpen()" aria-label="Explorer">
        <div class="label">EXPLORER</div>
        <div class="folder">▾ harinath-g</div>
        @for (s of sections; track s.id) {
          <a [href]="'#' + s.id" [class.active]="(spy.active$ | async) === s.id" (click)="go($event, s.id)">
            <span class="badge" [class]="'badge b-' + s.kind">{{ s.badge }}</span>{{ s.file }}
          </a>
        }
        <a [href]="p.resume" download><span class="badge b-pdf">PDF</span>{{ p.resume }}</a>
        <div class="label outline">OUTLINE</div>
        <pre class="tree">class Harinath
  ├ Experience
  ├ Stack
  └ BuildAsync()</pre>
      </nav>

      <div class="main">
        <div class="tabs" role="tablist" aria-label="Open files">
          @for (s of sections; track s.id) {
            <a role="tab" [href]="'#' + s.id" [attr.aria-selected]="(spy.active$ | async) === s.id" [class.active]="(spy.active$ | async) === s.id" (click)="go($event, s.id)">{{ s.file }}</a>
          }
        </div>
        <main class="content">
          <app-hero />
          <app-experience />
          <app-skills />
          <app-projects />
          <app-api-playground />
          <app-contact />
        </main>
        <app-terminal />
        <footer class="statusbar">
          <span>⎇ main</span>
          <span>✓ 0 errors</span>
          <span class="push">Angular · TypeScript · RxJS</span>
          <span>Theme: {{ theme.label$ | async }}</span>
          <span class="hide-sm">UTF-8</span>
          <span class="hide-sm">© {{ year }} {{ p.name }}</span>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; min-height: 100vh; }
    .skip { position: absolute; left: -999px; top: 8px; z-index: 50; background: var(--accent); color: var(--on-accent); padding: 8px 14px; border-radius: 4px; }
    .skip:focus { left: 8px; }

    .titlebar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: var(--panel);
      border-bottom: 1px solid var(--border);
    }
    .lights { display: flex; gap: 7px; }
    .lights span { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; }
    .lights span:nth-child(2) { background: #febc2e; }
    .lights span:nth-child(3) { background: #28c840; }
    .title { flex: 1; text-align: center; font: 13px var(--mono); color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .actions { display: flex; gap: 8px; }
    .chip-btn {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 0 14px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: transparent;
      color: var(--text);
      font: 13px var(--mono);
      cursor: pointer;
      white-space: nowrap;
    }
    .chip-btn:hover { border-color: var(--accent); color: var(--accent); }
    .chip-btn.accent { border-color: var(--accent); color: var(--accent); }
    .icon-btn { display: none; width: 40px; height: 40px; border: 0; background: transparent; color: var(--text); cursor: pointer; border-radius: 6px; }

    .workbench { display: flex; align-items: flex-start; }
    .explorer {
      position: sticky;
      top: 53px;
      flex: 0 0 256px;
      height: calc(100vh - 53px);
      overflow-y: auto;
      box-sizing: border-box;
      padding: 18px 0;
      background: var(--panel);
      border-right: 1px solid var(--border);
      font: 13px var(--mono);
    }
    .label { padding: 0 20px 10px; font-size: 11px; letter-spacing: 2px; color: var(--muted); }
    .label.outline { margin: 22px 20px 0; padding: 16px 0 6px; border-top: 1px solid var(--border); }
    .folder { padding: 4px 20px; color: var(--muted); }
    .explorer a {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 34px;
      padding: 0 16px 0 32px;
      color: var(--text);
      border-left: 2px solid transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .explorer a:hover { background: var(--hover); color: var(--text); }
    .explorer a.active { background: var(--selected); border-left-color: var(--accent); }
    .badge { min-width: 34px; font-size: 10px; font-weight: 700; }
    .b-cs { color: var(--kw); } .b-sql { color: var(--accent2); } .b-json { color: var(--str); }
    .b-ts { color: var(--type); } .b-dart { color: var(--fn); } .b-get { color: var(--green); }
    .b-post { color: var(--accent2); } .b-pdf { color: var(--muted); }
    .tree { margin: 0; padding: 4px 20px; color: var(--muted); font: inherit; line-height: 2; }

    .main { flex: 1; min-width: 0; display: flex; flex-direction: column; min-height: calc(100vh - 53px); }
    .tabs {
      position: sticky;
      top: 53px;
      z-index: 10;
      display: flex;
      overflow-x: auto;
      background: var(--panel2);
      border-bottom: 1px solid var(--border);
      font: 13px var(--mono);
      scrollbar-width: none;
    }
    .tabs a {
      padding: 10px 18px;
      white-space: nowrap;
      color: var(--muted);
      border-right: 1px solid var(--border);
      border-top: 2px solid transparent;
    }
    .tabs a:hover { color: var(--text); }
    .tabs a.active { background: var(--bg); color: var(--heading); border-top-color: var(--accent); }

    .content {
      width: 100%;
      max-width: 1180px;
      box-sizing: border-box;
      padding: 40px clamp(16px, 4vw, 56px) 64px;
      display: flex;
      flex-direction: column;
      gap: 64px;
    }

    .statusbar {
      position: sticky;
      bottom: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 18px;
      padding: 4px 16px;
      background: var(--status);
      color: #fff;
      font: 12px var(--mono);
    }
    .push { margin-left: auto; }

    @media (max-width: 900px) {
      .icon-btn { display: inline-flex; align-items: center; justify-content: center; }
      .lights { display: none; }
      .explorer {
        position: fixed;
        left: 0;
        top: 53px;
        z-index: 15;
        width: 260px;
        transform: translateX(-100%);
        transition: transform 0.2s;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.35);
      }
      .explorer.open { transform: none; }
      .title { text-align: left; }
    }
    @media (max-width: 560px) {
      .title, .hide-sm { display: none; }
      .actions { margin-left: auto; }
    }
  `,
})
export class AppComponent implements AfterViewInit {
  readonly theme = inject(ThemeService);
  readonly spy = inject(ScrollSpyService);
  readonly sections = SECTIONS;
  readonly p = PROFILE;
  readonly year = new Date().getFullYear();
  readonly menuOpen = signal(false);

  ngAfterViewInit(): void {
    this.spy.observe(this.sections.map((s) => s.id));
  }

  go(event: Event, id: string): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.spy.goTo(id);
    history.replaceState(null, '', '#' + id);
  }
}
