import { Component } from '@angular/core';
import { JOBS, PROFILE } from '../data/resume';

@Component({
  selector: 'app-experience',
  template: `
    <section id="experience" aria-labelledby="exp-title">
      <h2 id="exp-title" class="file-label">experience.sql</h2>
      <div class="panel query">
        <span class="tk-kw">SELECT</span> role, company, period <span class="tk-kw">FROM</span> experience
        <span class="tk-kw">ORDER BY</span> start <span class="tk-kw">DESC</span>;
      </div>
      <p class="rows">✓ {{ jobs.length }} rows returned</p>
      <ol class="timeline">
        @for (job of jobs; track job.role) {
          <li class="panel job" [class.current]="job.current">
            <div class="period">{{ job.period }}</div>
            <div class="body">
              <h3>
                {{ job.role }} <span class="org">· {{ company }}, Chennai</span>
                @if (job.current) {
                  <span class="badge">current</span>
                }
              </h3>
              <ul>
                @for (point of job.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    .query { padding: 14px 18px; font-family: var(--mono); font-size: 14px; overflow-x: auto; white-space: nowrap; }
    .rows { margin: 10px 0 18px; font-family: var(--mono); font-size: 12px; color: var(--green); }
    .timeline { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
    .job { display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 20px 22px; transition: border-color 0.2s, transform 0.2s; }
    .job:hover { border-color: var(--accent); transform: translateX(4px); }
    .job.current { border-left: 3px solid var(--accent2); }
    .period { flex: 1 1 170px; font-family: var(--mono); font-size: 13px; color: var(--accent2); }
    .body { flex: 999 1 380px; min-width: 0; }
    h3 { margin: 0; font-size: 18px; color: var(--heading); }
    .org { font-weight: 400; color: var(--muted); }
    .badge {
      margin-left: 6px;
      padding: 2px 8px;
      border-radius: 999px;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 500;
      color: var(--green);
      border: 1px solid var(--green);
      vertical-align: middle;
    }
    ul { margin: 8px 0 0; padding-left: 18px; color: var(--muted); }
    li li { margin-bottom: 4px; }
  `,
})
export class ExperienceComponent {
  readonly jobs = JOBS;
  readonly company = PROFILE.company;
}
