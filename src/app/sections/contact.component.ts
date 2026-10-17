import { Component, signal } from '@angular/core';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { PROFILE } from '../data/resume';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contact',
  template: `
    <section id="contact" aria-labelledby="contact-title">
      <h2 id="contact-title" class="file-label">contact.http</h2>
      <form
        class="panel form"
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        (submit)="submit($event)"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p class="sr-only"><label>Leave this empty <input name="bot-field" /></label></p>
        <div class="req"><span class="post">POST</span> /contact <span class="muted">HTTP/1.1</span></div>
        <label>
          <span class="key">"name":</span>
          <input name="name" type="text" required autocomplete="name" placeholder="Your name" />
        </label>
        <label>
          <span class="key">"email":</span>
          <input name="email" type="email" required autocomplete="email" placeholder="you@company.com" />
        </label>
        <label class="wide">
          <span class="key">"message":</span>
          <textarea name="message" rows="5" required placeholder="Let's build something…"></textarea>
        </label>
        <div class="wide footer">
          <button type="submit" class="btn primary" [disabled]="state() === 'sending'">
            {{ state() === 'sending' ? 'Sending…' : 'Send request' }}
          </button>
          <span class="muted mono" aria-live="polite">
            @switch (state()) {
              @case ('sent') {
                <span class="ok">201 Created</span> — thanks! I'll reply soon.
              }
              @case ('error') {
                <span class="err">500</span> — something went wrong. Mail me at
                <a [href]="'mailto:' + email">{{ email }}</a>
              }
              @default {
                or mail <a [href]="'mailto:' + email">{{ email }}</a>
              }
            }
          </span>
        </div>
      </form>
    </section>
  `,
  styles: `
    .form { padding: 22px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .req, .wide { grid-column: 1 / -1; }
    .req { font: 14px var(--mono); }
    .post { color: var(--accent2); font-weight: 700; }
    label { display: flex; flex-direction: column; gap: 6px; }
    .key { font: 12px var(--mono); color: var(--prop); }
    input, textarea {
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg);
      color: var(--text);
      font: 14px var(--sans);
      box-sizing: border-box;
      resize: vertical;
    }
    input:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: transparent; }
    .footer { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    .muted { color: var(--muted); }
    .mono { font: 12px var(--mono); }
    .ok { color: var(--green); font-weight: 700; }
    .err { color: var(--accent2); font-weight: 700; }
    button[disabled] { opacity: 0.7; cursor: progress; }
  `,
})
export class ContactComponent {
  readonly email = PROFILE.email;
  readonly state = signal<SendState>('idle');

  submit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
    this.state.set('sending');

    of(body)
      .pipe(
        switchMap((b) =>
          from(fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: b })),
        ),
        map((res) => (res.ok ? 'sent' : 'error') as SendState),
        catchError(() => of<SendState>('error')),
      )
      .subscribe((s) => {
        this.state.set(s);
        if (s === 'sent') form.reset();
      });
  }
}
