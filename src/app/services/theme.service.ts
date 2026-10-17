import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'hg-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly theme$$ = new BehaviorSubject<Theme>(this.initialTheme());

  readonly theme$ = this.theme$$.pipe(distinctUntilChanged());
  readonly label$ = this.theme$.pipe(map((t) => (t === 'dark' ? 'Dark+' : 'Light+')));

  constructor() {
    this.theme$.subscribe((t) => {
      this.doc.documentElement.setAttribute('data-theme', t);
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {
        /* storage unavailable: theme still works for this visit */
      }
    });
  }

  get current(): Theme {
    return this.theme$$.value;
  }

  set(theme: Theme): void {
    this.theme$$.next(theme);
  }

  toggle(): void {
    this.set(this.current === 'dark' ? 'light' : 'dark');
  }

  private initialTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      /* ignore */
    }
    return 'dark';
  }
}
