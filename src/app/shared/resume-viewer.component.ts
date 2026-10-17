import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resume-viewer',
  host: { '(document:keydown.escape)': 'closed.emit()' },
  template: `
    <div class="backdrop" (click)="closed.emit()">
      <section class="viewer" role="dialog" aria-modal="true" aria-label="Resume preview" (click)="$event.stopPropagation()">
        <header>
          <span class="name">{{ file() }}</span>
          <a class="btn" [href]="file()" download>Download ↓</a>
          <button class="btn" type="button" aria-label="Close preview" (click)="closed.emit()">✕</button>
        </header>
        <iframe [src]="src()" title="Resume PDF"></iframe>
        <p class="fallback">
          Preview not showing? <a [href]="file()" target="_blank" rel="noopener">Open in a new tab</a>.
        </p>
      </section>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.6);
    }
    .viewer {
      display: flex;
      flex-direction: column;
      width: min(960px, 100%);
      height: min(90vh, 100%);
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      font: 13px var(--mono);
    }
    .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
    .btn {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 0 14px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: transparent;
      color: var(--text);
      font: inherit;
      cursor: pointer;
    }
    .btn:hover { border-color: var(--accent); color: var(--accent); }
    iframe { flex: 1; width: 100%; border: 0; background: #fff; }
    .fallback { margin: 0; padding: 6px 12px; font: 12px var(--mono); color: var(--muted); border-top: 1px solid var(--border); }
  `,
})
export class ResumeViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly file = input.required<string>();
  readonly closed = output<void>();
  // The file name comes from the PROFILE constant, never from user input.
  readonly src = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.file()));
}
