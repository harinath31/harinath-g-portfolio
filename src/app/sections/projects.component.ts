import { Component, computed, signal } from '@angular/core';
import { PROJECTS } from '../data/resume';
import { CodeBlockComponent, CodeLine } from '../shared/code-block.component';

type Status = 'Open' | 'In progress' | 'Resolved';
interface Ticket { id: string; title: string; status: Status; }

const DART: CodeLine[] = [
  [['// main.dart — ticket list (BLoC)', 'c']],
  [['BlocBuilder', 'ty'], ['<'], ['TicketBloc', 'ty'], [', '], ['TicketState', 'ty'], ['>(']],
  [['  builder', 'p'], [': (context, state) => '], ['ListView', 'ty'], ['.'], ['builder', 'f'], ['(']],
  [['    itemCount', 'p'], [': state.tickets.length,']],
  [['    itemBuilder', 'p'], [': (_, i) => '], ['TicketTile', 'ty'], ['(state.tickets[i]),']],
  [['  ),']],
  [[');']],
];

@Component({
  selector: 'app-projects',
  imports: [CodeBlockComponent],
  template: `
    <section id="projects" aria-labelledby="projects-title">
      <h2 id="projects-title" class="file-label">projects.ts</h2>
      @for (project of projects; track project.name) {
        <article class="panel project">
          <div class="mono"><span class="tk-kw">const</span> boldDesk: <span class="tk-ty">Project</span> = {{ '{' }}</div>
          <h3>{{ project.name }}</h3>
          <ul class="tags">
            @for (tag of project.tags; track tag) {
              <li>{{ tag }}</li>
            }
          </ul>
          <ul class="points">
            @for (point of project.points; track point) {
              <li>{{ point }}</li>
            }
          </ul>
          <div class="mono">{{ '}' }};</div>
        </article>
      }
    </section>

    <section id="mobile" class="mobile" aria-labelledby="mobile-title">
      <div class="dart">
        <h2 id="mobile-title" class="file-label">main.dart — Android · iOS</h2>
        <div class="panel"><app-code-block [lines]="dart" /></div>
        <p class="note">
          Flutter &amp; Dart with BLoC state management, Firebase push notifications, and releases to Google Play Store
          and Apple App Store. Tap the filters on the phone.
        </p>
      </div>
      <div class="phone" role="group" aria-label="Sample Flutter ticket app">
        <div class="screen">
          <div class="app-bar">Tickets</div>
          <div class="filters">
            @for (f of filters; track f) {
              <button type="button" [class.on]="filter() === f" (click)="filter.set(f)">{{ f }}</button>
            }
          </div>
          <ul class="tickets">
            @for (t of visible(); track t.id) {
              <li>
                <span class="t-title">{{ t.title }}</span>
                <span class="t-meta"
                  ><span>{{ t.id }}</span><span [class]="'st st-' + t.status.replace(' ', '-').toLowerCase()">{{ t.status }}</span></span
                >
              </li>
            } @empty {
              <li class="empty">No tickets</li>
            }
          </ul>
          <div class="home-bar" aria-hidden="true"></div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .project { padding: 24px; }
    .mono { font-family: var(--mono); font-size: 13px; color: var(--muted); }
    h3 { margin: 14px 0 10px; font-size: clamp(20px, 3vw, 26px); color: var(--heading); }
    .tags { list-style: none; padding: 0; margin: 0 0 14px; display: flex; flex-wrap: wrap; gap: 8px; }
    .tags li {
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid var(--accent);
      font-family: var(--mono);
      font-size: 12px;
      color: var(--accent);
    }
    .points { margin: 0 0 14px; padding-left: 18px; color: var(--muted); }
    .points li { margin-bottom: 6px; }

    .mobile { display: flex; flex-wrap: wrap; gap: 32px; align-items: center; }
    .dart { flex: 999 1 420px; min-width: 0; }
    .note { color: var(--muted); font-size: 14px; margin: 14px 0 0; }
    .phone {
      flex: 0 0 auto;
      margin: 0 auto;
      width: 250px;
      height: 470px;
      border: 9px solid var(--phone);
      border-radius: 36px;
      background: var(--panel);
      overflow: hidden;
      box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.45);
    }
    .screen { height: 100%; display: flex; flex-direction: column; }
    .app-bar { padding: 22px 16px 12px; background: var(--accent); color: var(--on-accent); font-weight: 600; }
    .filters { display: flex; gap: 6px; padding: 10px 12px; border-bottom: 1px solid var(--border); }
    .filters button {
      flex: 1;
      min-height: 32px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: transparent;
      color: var(--muted);
      font: 500 11px var(--sans);
      cursor: pointer;
    }
    .filters button.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
    .tickets { list-style: none; margin: 0; padding: 0; overflow-y: auto; }
    .tickets li { padding: 12px 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; }
    .t-title { font-size: 13px; font-weight: 600; color: var(--heading); }
    .t-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }
    .st-open { color: var(--accent2); }
    .st-in-progress { color: var(--accent); }
    .st-resolved { color: var(--green); }
    .empty { color: var(--muted); font-size: 13px; }
    .home-bar { margin: auto auto 8px; width: 90px; height: 4px; border-radius: 4px; background: var(--border); }
  `,
})
export class ProjectsComponent {
  readonly projects = PROJECTS;
  readonly dart = DART;
  readonly filters = ['All', 'Open', 'Resolved'] as const;
  readonly filter = signal<(typeof this.filters)[number]>('All');

  private readonly tickets: Ticket[] = [
    { id: '#1042', title: 'Login fails on SSO', status: 'Open' },
    { id: '#1039', title: 'Export report as PDF', status: 'In progress' },
    { id: '#1035', title: 'SLA timer not resetting', status: 'Open' },
    { id: '#1031', title: 'Push alert delay', status: 'Resolved' },
    { id: '#1027', title: 'Custom form field', status: 'Resolved' },
  ];

  readonly visible = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.tickets : this.tickets.filter((t) => t.status === f);
  });
}
