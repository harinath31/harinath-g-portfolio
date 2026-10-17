import { Component, input } from '@angular/core';

/** kw keyword · ty type · s string · c comment · f function · n number · p property · x plain */
export type TokenKind = 'kw' | 'ty' | 's' | 'c' | 'f' | 'n' | 'p' | 'x';
export type Token = [text: string, kind?: TokenKind];
export type CodeLine = Token[];

@Component({
  selector: 'app-code-block',
  template: `
    <div class="code" [class.numbered]="numbered()">
      @for (line of lines(); track $index) {
        <div class="line">
          @if (numbered()) {
            <span class="ln" aria-hidden="true">{{ $index + 1 }}</span>
          }
          <span class="src"
            >@for (tok of line; track $index) {<span [class]="'tk-' + (tok[1] ?? 'x')">{{ tok[0] }}</span>}</span
          >
        </div>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .code {
      font-family: var(--mono);
      font-size: 13.5px;
      line-height: 1.75;
      overflow-x: auto;
      padding: 14px 0;
    }
    .line { display: flex; white-space: pre; padding-right: 16px; }
    .code:not(.numbered) .line { padding-left: 18px; }
    .ln {
      width: 44px;
      flex-shrink: 0;
      text-align: right;
      padding-right: 16px;
      color: var(--line-no);
      user-select: none;
    }
  `,
})
export class CodeBlockComponent {
  readonly lines = input.required<CodeLine[]>();
  readonly numbered = input(true);
}
