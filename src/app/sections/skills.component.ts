import { Component } from '@angular/core';
import { SKILLS } from '../data/resume';

@Component({
  selector: 'app-skills',
  template: `
    <section id="skills" aria-labelledby="skills-title">
      <h2 id="skills-title" class="file-label">skills.json</h2>
      <div class="grid">
        @for (group of skills; track group.key) {
          <div class="panel group">
            <div class="mono"><span class="tk-p">"{{ group.key }}"</span><span class="punct">: [</span></div>
            <ul class="chips">
              @for (skill of group.items; track skill) {
                <li class="chip">{{ skill }}</li>
              }
            </ul>
            <div class="mono punct">]</div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 14px; }
    .group { padding: 18px 20px; }
    .mono { font-family: var(--mono); font-size: 14px; }
    .punct { color: var(--muted); }
    .chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0 10px; padding: 0; }
    .chip {
      padding: 4px 10px;
      border-radius: 4px;
      background: var(--chip);
      border: 1px solid var(--border);
      font-family: var(--mono);
      font-size: 12.5px;
      color: var(--str);
      transition: border-color 0.2s, color 0.2s;
    }
    .chip:hover { border-color: var(--accent); color: var(--accent); }
  `,
})
export class SkillsComponent {
  readonly skills = SKILLS;
}
